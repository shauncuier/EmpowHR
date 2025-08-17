const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// Initialize Stripe with error handling
let stripe;
try {
    if (!process.env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY environment variable is not set');
        process.exit(1);
    }
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    console.log('Stripe initialized successfully');
} catch (error) {
    console.error('Failed to initialize Stripe:', error);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: true, // Allow all origins for development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Request logging middleware (disabled for production)
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection URI
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/empowhr";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server
        await client.connect();

        // Database and collections
        const database = client.db("empowhr");
        const usersCollection = database.collection("users");
        const worksheetsCollection = database.collection("worksheets");
        const paymentsCollection = database.collection("payments");
        const contactsCollection = database.collection("contacts");
        const payrollRequestsCollection = database.collection("payroll_requests");

        console.log("Connected to MongoDB!");

        // Create unique indexes to prevent duplicates at database level
        try {
            // Unique index on email field for users
            await usersCollection.createIndex({ email: 1 }, { unique: true });
            console.log('Unique index created on users email field');

            // Compound unique index for payments to prevent duplicate payments for same employee/month/year
            await paymentsCollection.createIndex(
                { employeeEmail: 1, month: 1, year: 1 },
                { unique: true, name: 'unique_payment_per_month' }
            );
            console.log('Unique compound index created on payments collection');

            // Compound unique index for payroll requests to prevent duplicate requests
            await payrollRequestsCollection.createIndex(
                { employeeEmail: 1, month: 1, year: 1 },
                { unique: true, name: 'unique_payroll_request_per_month' }
            );
            console.log('Unique compound index created on payroll_requests collection');

        } catch (indexError) {
            console.log('Indexes already exist or creation failed:', indexError.message);
        }

        // Test route
        app.get('/', (req, res) => {
            res.send('EmpowHR Server is running!');
        });

        // Test Stripe connection
        app.get('/api/test-stripe', async (req, res) => {
            try {
                // Test Stripe connection by listing payment methods
                const paymentMethods = await stripe.paymentMethods.list({
                    type: 'card',
                    limit: 1,
                });

                res.json({
                    success: true,
                    message: 'Stripe connection successful',
                    stripeConfigured: true
                });
            } catch (error) {
                console.error('Stripe test error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Stripe connection failed',
                    error: error.message,
                    stripeConfigured: false
                });
            }
        });

        // Enhanced User registration endpoint with duplicate prevention
        app.post('/api/users/register', async (req, res) => {
            try {
                const { email, name, role, designation, salary, bank_account_no, photo } = req.body;

                // Registration request logging disabled for production

                // Validate required fields
                if (!email || !name) {
                    return res.status(400).json({ message: 'Email and name are required' });
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ message: 'Invalid email format' });
                }

                const newUser = {
                    email: email.toLowerCase().trim(), // Normalize email
                    name: name.trim(),
                    role: role || 'employee',
                    designation: designation || 'Staff',
                    salary: parseInt(salary) || 100,
                    bank_account_no: bank_account_no || '',
                    photo: photo || '',
                    isVerified: false,
                    isFired: false,
                    createdAt: new Date()
                };

                // Use findOneAndUpdate with upsert to prevent race conditions
                try {
                    const result = await usersCollection.findOneAndUpdate(
                        { email: newUser.email },
                        { $setOnInsert: newUser },
                        {
                            upsert: true,
                            returnDocument: 'after',
                            includeResultMetadata: true
                        }
                    );

                    if (result.lastErrorObject?.upserted) {
                        console.log('User successfully created:', result.value._id);
                        res.status(201).json({
                            message: 'User registered successfully',
                            userId: result.value._id,
                            user: result.value
                        });
                    } else {
                        console.log('User already exists:', newUser.email);
                        res.status(409).json({
                            message: 'User already exists with this email address',
                            existingUser: {
                                email: result.value.email,
                                name: result.value.name,
                                createdAt: result.value.createdAt
                            }
                        });
                    }
                } catch (upsertError) {
                    if (upsertError.code === 11000) {
                        console.log('Duplicate key error during registration:', upsertError);
                        return res.status(409).json({ message: 'User already exists with this email address' });
                    }
                    throw upsertError;
                }

            } catch (error) {
                console.error('Registration error:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });

        // Get user by email
        app.get('/api/users/:email', async (req, res) => {
            try {
                const email = req.params.email.toLowerCase().trim();
                const user = await usersCollection.findOne({ email });

                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json(user);
            } catch (error) {
                console.error('Get user error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Get all employees (HR route)
        app.get('/api/employees', async (req, res) => {
            try {
                const employees = await usersCollection.find({
                    role: { $in: ['employee', 'hr'] },
                    isFired: { $ne: true }
                }).toArray();
                res.json(employees);
            } catch (error) {
                console.error('Get employees error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Get all users (Admin route)
        app.get('/api/users', async (req, res) => {
            try {
                const users = await usersCollection.find({}).toArray();
                res.json(users);
            } catch (error) {
                console.error('Get all users error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Update user details (Admin route)
        app.put('/api/users/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const { name, role, designation, salary, bank_account_no, isVerified, isFired } = req.body;

                const updateData = {
                    name: name?.trim(),
                    role,
                    designation,
                    salary: parseInt(salary),
                    bank_account_no,
                    isVerified,
                    isFired,
                    updatedAt: new Date()
                };

                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: updateData }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json({ message: 'User updated successfully' });
            } catch (error) {
                console.error('Update user error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Fire employee (Admin route)
        app.patch('/api/users/:id/fire', async (req, res) => {
            try {
                const { id } = req.params;
                const { isFired } = req.body;

                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { isFired, firedAt: isFired ? new Date() : null } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json({ message: `User ${isFired ? 'fired' : 'reinstated'} successfully` });
            } catch (error) {
                console.error('Fire user error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Promote employee to HR (Admin route)
        app.patch('/api/users/:id/promote', async (req, res) => {
            try {
                const { id } = req.params;
                const { newRole } = req.body;

                if (!['employee', 'hr', 'admin'].includes(newRole)) {
                    return res.status(400).json({ message: 'Invalid role' });
                }

                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { role: newRole, promotedAt: new Date() } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json({ message: `User promoted to ${newRole} successfully` });
            } catch (error) {
                console.error('Promote user error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Update user verification status (HR route)
        app.patch('/api/users/:id/verify', async (req, res) => {
            try {
                const { id } = req.params;
                const { isVerified } = req.body;

                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(id) },
                    { $set: { isVerified } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json({ message: 'User verification status updated' });
            } catch (error) {
                console.error('Update verification error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Worksheet routes
        app.post('/api/worksheets', async (req, res) => {
            try {
                const { email, task, hours, date } = req.body;

                const newWorksheet = {
                    email: email.toLowerCase().trim(),
                    task: task.trim(),
                    hours: parseInt(hours),
                    date: new Date(date),
                    createdAt: new Date()
                };

                const result = await worksheetsCollection.insertOne(newWorksheet);
                res.status(201).json({
                    message: 'Worksheet added successfully',
                    worksheet: { ...newWorksheet, _id: result.insertedId }
                });
            } catch (error) {
                console.error('Add worksheet error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Get worksheets by user email
        app.get('/api/worksheets/:email', async (req, res) => {
            try {
                const email = req.params.email.toLowerCase().trim();
                const worksheets = await worksheetsCollection
                    .find({ email })
                    .sort({ date: -1 })
                    .toArray();
                res.json(worksheets);
            } catch (error) {
                console.error('Get worksheets error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Update worksheet
        app.put('/api/worksheets/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const { task, hours, date } = req.body;

                const result = await worksheetsCollection.updateOne(
                    { _id: new ObjectId(id) },
                    {
                        $set: {
                            task: task.trim(),
                            hours: parseInt(hours),
                            date: new Date(date),
                            updatedAt: new Date()
                        }
                    }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: 'Worksheet not found' });
                }

                res.json({ message: 'Worksheet updated successfully' });
            } catch (error) {
                console.error('Update worksheet error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Delete worksheet
        app.delete('/api/worksheets/:id', async (req, res) => {
            try {
                const { id } = req.params;

                const result = await worksheetsCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 0) {
                    return res.status(404).json({ message: 'Worksheet not found' });
                }

                res.json({ message: 'Worksheet deleted successfully' });
            } catch (error) {
                console.error('Delete worksheet error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Get payments by user email
        app.get('/api/payments/:email', async (req, res) => {
            try {
                const email = req.params.email.toLowerCase().trim();
                const payments = await paymentsCollection
                    .find({ employeeEmail: email })
                    .sort({ paymentDate: -1 })
                    .toArray();
                res.json(payments);
            } catch (error) {
                console.error('Get payments error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Enhanced Create payroll request (HR endpoint) with duplicate prevention
        app.post('/api/payroll-requests', async (req, res) => {
            try {
                const { employeeId, employeeEmail, employeeName, salary, month, year, requestedBy } = req.body;

                // Validate required fields
                if (!employeeEmail || !employeeName || !salary || !month || !year || !requestedBy) {
                    return res.status(400).json({ message: 'All fields are required' });
                }

                // Normalize email
                const normalizedEmail = employeeEmail.toLowerCase().trim();
                const monthInt = parseInt(month);
                const yearInt = parseInt(year);

                // Payroll request creation logging disabled for production

                const payrollRequest = {
                    employeeId,
                    employeeEmail: normalizedEmail,
                    employeeName: employeeName.trim(),
                    salary: parseFloat(salary),
                    month: monthInt,
                    year: yearInt,
                    requestedBy: requestedBy.trim(),
                    status: 'pending',
                    createdAt: new Date()
                };

                try {
                    const result = await payrollRequestsCollection.insertOne(payrollRequest);
                    console.log('Payroll request created successfully:', result.insertedId);
                    res.status(201).json({
                        message: 'Payroll request created successfully',
                        requestId: result.insertedId
                    });
                } catch (insertError) {
                    if (insertError.code === 11000) {
                        console.log('Duplicate payroll request blocked:', insertError);
                        return res.status(409).json({
                            message: `Payroll request already exists for ${new Date(0, monthInt - 1).toLocaleString('en-US', { month: 'long' })} ${yearInt}`
                        });
                    }
                    throw insertError;
                }

            } catch (error) {
                console.error('Create payroll request error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Get all payroll requests (Admin endpoint) - Show both pending and completed
        app.get('/api/payroll-requests', async (req, res) => {
            try {
                const requests = await payrollRequestsCollection
                    .find({}) // Get all requests regardless of status
                    .sort({
                        status: 1, // Show pending first, then completed
                        createdAt: -1 // Then sort by most recent
                    })
                    .toArray();

                console.log(`Found ${requests.length} payroll requests`);
                res.json(requests);
            } catch (error) {
                console.error('Get payroll requests error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Create Stripe Checkout Session for Salary Payment
        app.post('/api/create-checkout-session', async (req, res) => {
            try {
                const {
                    requestId,
                    employeeEmail,
                    employeeName,
                    amount,
                    month,
                    year
                } = req.body;

                // Validate required fields
                if (!employeeEmail || !employeeName || !amount || !month || !year) {
                    return res.status(400).json({ message: 'Missing required payment information' });
                }

                // Normalize data
                const normalizedEmail = employeeEmail.toLowerCase().trim();
                const monthInt = parseInt(month);
                const yearInt = parseInt(year);
                const amountFloat = parseFloat(amount);

                console.log('Creating Stripe checkout session for:', {
                    employeeEmail: normalizedEmail,
                    amount: amountFloat,
                    month: monthInt,
                    year: yearInt
                });

                // Check for duplicate payment before creating session
                const existingPayment = await paymentsCollection.findOne({
                    employeeEmail: normalizedEmail,
                    month: monthInt,
                    year: yearInt
                });

                if (existingPayment) {
                    console.log('Duplicate payment blocked before Stripe session:', existingPayment);
                    return res.status(409).json({
                        message: `Payment already exists for ${new Date(0, monthInt - 1).toLocaleString('en-US', { month: 'long' })} ${yearInt}. Transaction ID: ${existingPayment.transactionId}`,
                        existingPayment: {
                            transactionId: existingPayment.transactionId,
                            amount: existingPayment.amount,
                            paymentDate: existingPayment.paymentDate
                        }
                    });
                }

                const monthName = new Date(0, monthInt - 1).toLocaleString('en-US', { month: 'long' });

                // Create Stripe Checkout Session
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: `Salary Payment - ${employeeName}`,
                                    description: `Salary payment for ${monthName} ${yearInt}`,
                                    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=200&fit=crop&crop=center'], // Professional payment image
                                },
                                unit_amount: Math.round(amountFloat * 100), // Convert to cents
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: `${process.env.CLIENT_URL || 'https://empowhr-a46ca.web.app'}/payment-success?success=true&session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.CLIENT_URL || 'https://empowhr-a46ca.web.app'}/dashboard/admin/payroll?canceled=true`,
                    metadata: {
                        requestId: requestId || '',
                        employeeEmail: normalizedEmail,
                        employeeName: employeeName.trim(),
                        month: monthInt.toString(),
                        year: yearInt.toString(),
                        paymentType: 'salary_payment'
                    },
                    customer_email: normalizedEmail, // Pre-fill customer email
                    billing_address_collection: 'auto',
                    shipping_address_collection: {
                        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP', 'IN', 'BD'], // Add more countries as needed
                    },
                });

                console.log('Stripe checkout session created successfully:', session.id);

                res.json({
                    sessionId: session.id,
                    url: session.url,
                    paymentDetails: {
                        employeeName,
                        amount: amountFloat,
                        month: monthName,
                        year: yearInt
                    }
                });

            } catch (error) {
                console.error('Create checkout session error:', error);

                if (error.type === 'StripeCardError') {
                    res.status(400).json({ message: 'Payment card error: ' + error.message });
                } else if (error.type === 'StripeRateLimitError') {
                    res.status(429).json({ message: 'Too many requests. Please try again later.' });
                } else if (error.type === 'StripeInvalidRequestError') {
                    res.status(400).json({ message: 'Invalid payment request: ' + error.message });
                } else if (error.type === 'StripeAPIError') {
                    res.status(500).json({ message: 'Payment service temporarily unavailable. Please try again.' });
                } else {
                    res.status(500).json({
                        message: 'Failed to create payment session',
                        error: error.message
                    });
                }
            }
        });

        // Process Stripe Payment Completion (called after successful payment)
        app.post('/api/confirm-stripe-payment', async (req, res) => {
            try {
                const { sessionId } = req.body;

                if (!sessionId) {
                    return res.status(400).json({ message: 'Session ID required' });
                }

                console.log('Confirming Stripe payment for session:', sessionId);

                // Retrieve the session from Stripe to verify payment
                const session = await stripe.checkout.sessions.retrieve(sessionId);

                if (session.payment_status !== 'paid') {
                    return res.status(400).json({ message: 'Payment not completed' });
                }

                console.log('Payment verified, creating payment record');

                const {
                    requestId,
                    employeeEmail,
                    employeeName,
                    month,
                    year,
                    paymentType
                } = session.metadata;

                if (paymentType === 'salary_payment') {
                    // Normalize data
                    const normalizedEmail = employeeEmail.toLowerCase().trim();
                    const monthInt = parseInt(month);
                    const yearInt = parseInt(year);
                    const amountFloat = session.amount_total / 100; // Convert from cents

                    // Generate transaction ID
                    const transactionId = `STRIPE_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

                    // Create payment record with duplicate protection
                    const payment = {
                        employeeEmail: normalizedEmail,
                        employeeName: employeeName.trim(),
                        amount: amountFloat,
                        month: monthInt,
                        year: yearInt,
                        transactionId,
                        stripeSessionId: session.id,
                        stripePaymentIntentId: session.payment_intent,
                        paymentDate: new Date(),
                        status: 'paid',
                        paymentMethod: 'stripe_checkout',
                        processedBy: 'admin_confirmation',
                        createdAt: new Date(),
                        metadata: {
                            processingTime: new Date().toISOString(),
                            stripeCustomerId: session.customer,
                            paymentGateway: 'Stripe_Checkout',
                            customerEmail: session.customer_email
                        }
                    };

                    try {
                        // Insert payment record - database index will prevent duplicates
                        await paymentsCollection.insertOne(payment);
                        console.log('Payment record created:', transactionId);

                        // Update payroll request status if provided
                        if (requestId) {
                            try {
                                const updateResult = await payrollRequestsCollection.updateOne(
                                    { _id: new ObjectId(requestId) },
                                    {
                                        $set: {
                                            status: 'completed',
                                            processedAt: new Date(),
                                            transactionId,
                                            stripeSessionId: session.id,
                                            completedBy: 'admin_confirmation'
                                        }
                                    }
                                );

                                if (updateResult.matchedCount > 0) {
                                    console.log('Payroll request updated successfully');
                                } else {
                                    console.warn('Payroll request not found for update:', requestId);
                                }
                            } catch (updateError) {
                                console.error('Payroll request update error:', updateError);
                            }
                        }

                        res.json({
                            success: true,
                            message: 'Payment confirmed and recorded',
                            transactionId,
                            payment: {
                                transactionId,
                                amount: payment.amount,
                                employeeName: payment.employeeName,
                                employeeEmail: payment.employeeEmail,
                                month: payment.month,
                                year: payment.year,
                                paymentDate: payment.paymentDate,
                                stripeSessionId: session.id
                            }
                        });

                    } catch (insertError) {
                        if (insertError.code === 11000) {
                            console.log('Duplicate payment prevented - payment already exists');

                            // Find the existing payment
                            const existingPayment = await paymentsCollection.findOne({
                                employeeEmail: normalizedEmail,
                                month: monthInt,
                                year: yearInt
                            });

                            return res.status(409).json({
                                message: `Payment already exists for ${new Date(0, monthInt - 1).toLocaleString('en-US', { month: 'long' })} ${yearInt}`,
                                existingPayment: {
                                    transactionId: existingPayment?.transactionId,
                                    amount: existingPayment?.amount,
                                    paymentDate: existingPayment?.paymentDate
                                }
                            });
                        }
                        throw insertError;
                    }
                } else {
                    return res.status(400).json({ message: 'Invalid payment type' });
                }

            } catch (error) {
                console.error('Payment confirmation error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to confirm payment',
                    error: error.message
                });
            }
        });

        // Get Stripe Checkout Session details
        app.get('/api/checkout-session/:sessionId', async (req, res) => {
            try {
                const { sessionId } = req.params;

                const session = await stripe.checkout.sessions.retrieve(sessionId);

                res.json({
                    session: {
                        id: session.id,
                        payment_status: session.payment_status,
                        customer_email: session.customer_email,
                        amount_total: session.amount_total,
                        currency: session.currency,
                        metadata: session.metadata
                    }
                });
            } catch (error) {
                console.error('Get checkout session error:', error);
                res.status(500).json({ message: 'Failed to retrieve payment session' });
            }
        });

        // Enhanced Process salary payment with comprehensive duplicate prevention
        app.post('/api/process-payment', async (req, res) => {
            try {
                const {
                    requestId,
                    employeeEmail,
                    employeeName,
                    amount,
                    month,
                    year,
                    cardLast4,
                    transactionId,
                    paymentMethod,
                    cardholderName
                } = req.body;

                // Validate required fields
                if (!employeeEmail || !employeeName || !amount || !month || !year) {
                    return res.status(400).json({ message: 'Missing required payment information' });
                }

                // Normalize data
                const normalizedEmail = employeeEmail.toLowerCase().trim();
                const monthInt = parseInt(month);
                const yearInt = parseInt(year);
                const amountFloat = parseFloat(amount);

                console.log('Processing payment:', {
                    employeeEmail: normalizedEmail,
                    amount: amountFloat,
                    month: monthInt,
                    year: yearInt,
                    paymentMethod: paymentMethod || 'credit_card'
                });

                // Generate unique transaction ID if not provided
                const finalTransactionId = transactionId || `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

                // Create comprehensive payment record
                const payment = {
                    employeeEmail: normalizedEmail,
                    employeeName: employeeName.trim(),
                    amount: amountFloat,
                    month: monthInt,
                    year: yearInt,
                    transactionId: finalTransactionId,
                    paymentDate: new Date(),
                    status: 'paid',
                    paymentMethod: paymentMethod || 'credit_card',
                    cardLast4: cardLast4 || '4242',
                    cardholderName: cardholderName?.trim() || 'Admin User',
                    processedBy: 'admin',
                    createdAt: new Date(),
                    metadata: {
                        processingTime: new Date().toISOString(),
                        systemGenerated: true,
                        paymentGateway: 'EmpowHR_Custom'
                    }
                };

                try {
                    // Insert payment record - this will fail if duplicate due to unique index
                    await paymentsCollection.insertOne(payment);
                    console.log('Payment record created successfully:', finalTransactionId);

                    // Update payroll request status if provided
                    if (requestId) {
                        try {
                            const updateResult = await payrollRequestsCollection.updateOne(
                                { _id: new ObjectId(requestId) },
                                {
                                    $set: {
                                        status: 'completed',
                                        processedAt: new Date(),
                                        transactionId: finalTransactionId,
                                        completedBy: 'admin'
                                    }
                                }
                            );

                            if (updateResult.matchedCount > 0) {
                                console.log('Payroll request updated successfully');
                            } else {
                                console.warn('Payroll request not found for update:', requestId);
                            }
                        } catch (updateError) {
                            console.error('Payroll request update error:', updateError);
                            // Continue execution - payment was successful even if request update failed
                        }
                    }

                    // Return success response with transaction details
                    res.json({
                        success: true,
                        message: 'Payment processed successfully',
                        transactionId: finalTransactionId,
                        payment: {
                            transactionId: finalTransactionId,
                            amount: payment.amount,
                            employeeName: payment.employeeName,
                            employeeEmail: payment.employeeEmail,
                            month: payment.month,
                            year: payment.year,
                            paymentDate: payment.paymentDate,
                            paymentMethod: payment.paymentMethod,
                            cardLast4: payment.cardLast4,
                            status: payment.status
                        }
                    });

                } catch (insertError) {
                    if (insertError.code === 11000) {
                        console.log('Duplicate payment blocked by database index:', insertError);

                        // Find the existing payment to return details
                        const existingPayment = await paymentsCollection.findOne({
                            employeeEmail: normalizedEmail,
                            month: monthInt,
                            year: yearInt
                        });

                        return res.status(409).json({
                            message: `Payment already exists for ${new Date(0, monthInt - 1).toLocaleString('en-US', { month: 'long' })} ${yearInt}. Transaction ID: ${existingPayment?.transactionId || 'N/A'}`,
                            existingPayment: {
                                transactionId: existingPayment?.transactionId,
                                amount: existingPayment?.amount,
                                paymentDate: existingPayment?.paymentDate
                            }
                        });
                    }
                    throw insertError;
                }

            } catch (error) {
                console.error('Process payment error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Payment processing failed',
                    error: error.message
                });
            }
        });

        // Enhanced Sync user between Firebase and MongoDB with duplicate prevention
        app.post('/api/users/sync', async (req, res) => {
            try {
                const { firebaseUser } = req.body;

                if (!firebaseUser || !firebaseUser.email) {
                    return res.status(400).json({ message: 'Firebase user data required' });
                }

                const normalizedEmail = firebaseUser.email.toLowerCase().trim();
                console.log('Sync request for user:', normalizedEmail);

                // Enhanced user data extraction from Firebase
                const userName = firebaseUser.displayName?.trim() ||
                    firebaseUser.email.split('@')[0].replace(/[^a-zA-Z\s]/g, '').trim() ||
                    'User';

                const newUser = {
                    email: normalizedEmail,
                    name: userName,
                    role: 'employee',
                    designation: 'Staff',
                    salary: 25000,
                    bank_account_no: '',
                    photo: firebaseUser.photoURL || '',
                    isVerified: false,
                    isFired: false,
                    createdAt: new Date(),
                    syncedFromFirebase: true,
                    firebaseUid: firebaseUser.uid || null,
                    lastSyncedAt: new Date()
                };

                console.log('Attempting to sync user with data:', {
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role,
                    syncedFromFirebase: newUser.syncedFromFirebase
                });

                try {
                    // Use findOneAndUpdate with upsert to handle race conditions
                    const result = await usersCollection.findOneAndUpdate(
                        { email: normalizedEmail }, // Find condition
                        {
                            $setOnInsert: newUser, // Only set these values if inserting
                            $set: {
                                lastSyncedAt: new Date(),
                                // Update photo if provided and different
                                ...(firebaseUser.photoURL && { photo: firebaseUser.photoURL }),
                                // Update name if provided and different
                                ...(firebaseUser.displayName && { name: firebaseUser.displayName.trim() }),
                                // Update Firebase UID if provided
                                ...(firebaseUser.uid && { firebaseUid: firebaseUser.uid })
                            }
                        },
                        {
                            upsert: true, // Create if doesn't exist
                            returnDocument: 'after', // Return the document after update
                            includeResultMetadata: true
                        }
                    );

                    const dbUser = result.value;
                    const action = result.lastErrorObject?.upserted ? 'created' : 'updated';

                    console.log('User sync successful:', {
                        email: dbUser.email,
                        name: dbUser.name,
                        action: action,
                        upserted: !!result.lastErrorObject?.upserted
                    });

                    res.json({
                        success: true,
                        message: `User ${action} successfully`,
                        user: dbUser,
                        action: action
                    });

                } catch (upsertError) {
                    console.error('Upsert operation failed:', upsertError);

                    // If upsert fails due to duplicate, try to find the existing user
                    if (upsertError.code === 11000) {
                        console.log('Duplicate key error during sync, fetching existing user');
                        try {
                            const dbUser = await usersCollection.findOne({ email: normalizedEmail });
                            if (dbUser) {
                                // Update the existing user's last sync time
                                await usersCollection.updateOne(
                                    { email: normalizedEmail },
                                    {
                                        $set: {
                                            lastSyncedAt: new Date(),
                                            ...(firebaseUser.photoURL && { photo: firebaseUser.photoURL }),
                                            ...(firebaseUser.displayName && { name: firebaseUser.displayName.trim() }),
                                            ...(firebaseUser.uid && { firebaseUid: firebaseUser.uid })
                                        }
                                    }
                                );

                                console.log('Existing user updated successfully');

                                res.json({
                                    success: true,
                                    message: 'User already exists and updated',
                                    user: dbUser,
                                    action: 'updated'
                                });
                            } else {
                                throw new Error('User not found after duplicate key error');
                            }
                        } catch (fetchError) {
                            console.error('Failed to fetch existing user after duplicate error:', fetchError);
                            throw fetchError;
                        }
                    } else {
                        throw upsertError;
                    }
                }

            } catch (error) {
                console.error('User sync error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to sync user with database',
                    error: error.message
                });
            }
        });

        // Get comprehensive system statistics (Admin route)
        app.get('/api/users/statistics', async (req, res) => {
            try {
                console.log('Statistics endpoint called');

                // Get raw user count first for debugging
                const totalUsersCount = await usersCollection.countDocuments({});
                console.log('Total users count (direct):', totalUsersCount);

                // User statistics with detailed logging
                const userStats = await usersCollection.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalUsers: { $sum: 1 },
                            employees: { $sum: { $cond: [{ $eq: ['$role', 'employee'] }, 1, 0] } },
                            hrPersonnel: { $sum: { $cond: [{ $eq: ['$role', 'hr'] }, 1, 0] } },
                            admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
                            verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
                            fired: { $sum: { $cond: ['$isFired', 1, 0] } },
                            totalSalary: { $sum: '$salary' },
                            averageSalary: { $avg: '$salary' }
                        }
                    }
                ]).toArray();

                console.log('User stats aggregation result:', userStats);

                // Payment statistics
                const paymentStats = await paymentsCollection.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalPayments: { $sum: 1 },
                            totalPaid: { $sum: '$amount' },
                            averagePayment: { $avg: '$amount' }
                        }
                    }
                ]).toArray();

                // Worksheet statistics
                const worksheetStats = await worksheetsCollection.aggregate([
                    {
                        $group: {
                            _id: null,
                            totalWorksheets: { $sum: 1 },
                            totalHours: { $sum: '$hours' },
                            averageHours: { $avg: '$hours' }
                        }
                    }
                ]).toArray();

                // Pending payroll requests count
                const pendingRequests = await payrollRequestsCollection.countDocuments({ status: 'pending' });

                const result = {
                    ...(userStats[0] || {
                        totalUsers: 0,
                        employees: 0,
                        hrPersonnel: 0,
                        admins: 0,
                        verified: 0,
                        fired: 0,
                        totalSalary: 0,
                        averageSalary: 0
                    }),
                    ...(paymentStats[0] || {
                        totalPayments: 0,
                        totalPaid: 0,
                        averagePayment: 0
                    }),
                    ...(worksheetStats[0] || {
                        totalWorksheets: 0,
                        totalHours: 0,
                        averageHours: 0
                    }),
                    pendingPayrollRequests: pendingRequests,
                    // Add debug info
                    debug: {
                        directUserCount: totalUsersCount,
                        aggregationResult: userStats[0] || null
                    }
                };

                console.log('Final statistics result:', result);
                res.json(result);
            } catch (error) {
                console.error('Get statistics error:', error);
                res.status(500).json({ message: 'Internal server error', error: error.message });
            }
        });

        // Get recent system activities (Admin route)
        app.get('/api/activities/recent', async (req, res) => {
            try {
                const activities = [];

                // Recent user registrations
                const recentUsers = await usersCollection
                    .find({})
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .toArray();

                recentUsers.forEach(user => {
                    activities.push({
                        id: `user_${user._id}`,
                        type: 'user_registered',
                        message: `New ${user.role} ${user.name} registered`,
                        time: user.createdAt,
                        icon: 'PersonAdd',
                        color: 'success'
                    });
                });

                // Recent payments
                const recentPayments = await paymentsCollection
                    .find({})
                    .sort({ paymentDate: -1 })
                    .limit(5)
                    .toArray();

                recentPayments.forEach(payment => {
                    activities.push({
                        id: `payment_${payment._id}`,
                        type: 'payment_processed',
                        message: `Salary payment of $${payment.amount} processed for ${payment.employeeName}`,
                        time: payment.paymentDate,
                        icon: 'Payment',
                        color: 'primary'
                    });
                });

                // Recent worksheet entries
                const recentWorksheets = await worksheetsCollection
                    .find({})
                    .sort({ createdAt: -1 })
                    .limit(5)
                    .toArray();

                for (const worksheet of recentWorksheets) {
                    const user = await usersCollection.findOne({ email: worksheet.email });
                    activities.push({
                        id: `worksheet_${worksheet._id}`,
                        type: 'worksheet_created',
                        message: `${user?.name || worksheet.email} logged ${worksheet.hours} hours for ${worksheet.task}`,
                        time: worksheet.createdAt,
                        icon: 'Assignment',
                        color: 'info'
                    });
                }

                // Recent payroll requests
                const recentRequests = await payrollRequestsCollection
                    .find({})
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .toArray();

                recentRequests.forEach(request => {
                    activities.push({
                        id: `request_${request._id}`,
                        type: 'payroll_request',
                        message: `Payroll request for ${request.employeeName} by ${request.requestedBy}`,
                        time: request.createdAt,
                        icon: 'AttachMoney',
                        color: 'warning'
                    });
                });

                // Sort all activities by time and take the 10 most recent
                activities.sort((a, b) => new Date(b.time) - new Date(a.time));
                const recentActivities = activities.slice(0, 10);

                res.json(recentActivities);
            } catch (error) {
                console.error('Get recent activities error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Contact form submission
        app.post('/api/contacts', async (req, res) => {
            try {
                const { email, message } = req.body;

                const newContact = {
                    email: email.toLowerCase().trim(),
                    message: message.trim(),
                    createdAt: new Date()
                };

                const result = await contactsCollection.insertOne(newContact);
                res.status(201).json({ message: 'Message sent successfully' });
            } catch (error) {
                console.error('Contact form error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Start server
        app.listen(port, () => {
            console.log(`EmpowHR server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Database connection error:', error);
    }
}

run().catch(console.dir);
