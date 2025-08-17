# EmpowHR - Employee Workload Monitoring & Management System

A comprehensive web application for managing employee workloads, processing payments, and streamlining HR operations with role-based access control.

## 🔗 Live Demo & Access
- **Local Development Client**: `http://localhost:5173`
- **Local Development Server**: `http://localhost:3000`

## 🔐 Admin Credentials (After Database Seeding)

## Live Url = https://empowhr-a46ca.web.app

### Admin Account
- **Email**: `admin@empowhr.com`
- **Password**: `Admin@123`
- **Role**: Admin
- **Access**: Full system control, payment processing, employee management

### HR Account
- **Email**: `hr.manager@empowhr.com`
- **Password**: `HrManager@123`
- **Role**: HR Manager
- **Access**: Employee verification, payment requests, progress monitoring

### Employee Test Accounts
- **John Doe**: `john.doe@empowhr.com` (Password: `JohnDoe@123`)
- **Jane Smith**: `jane.smith@empowhr.com` (Password: `JaneSmith@123`)
- **Emily Brown**: `emily.brown@empowhr.com` (Password: `EmilyBrown@123`)
- **Mike Wilson**: `mike.wilson@empowhr.com` (Password: `MikeWilson@123`)

*Note: These accounts are created by the database seeding script. Run `npm run seed` in the server directory to create them.*

## ✨ Key Features

### 🔐 Multi-Role Authentication System
- **Firebase Authentication** with email/password and Google OAuth
- **Role-based Access Control**: Employee, HR, and Admin dashboards
- **User Verification System**: HR-managed employee verification
- **Account Security**: Password requirements with validation

### 📊 Employee Workload Management
- **Work-sheet System**: Daily task logging with hours tracking
- **Task Categories**: Sales, Support, Content, Paper-work
- **Real-time Updates**: Add, edit, delete work entries without page reload
- **Date Validation**: Prevents future date entries
- **Employee-specific Data**: Secure data isolation per user

### 💳 Advanced Payment System
- **Stripe Integration**: Secure payment processing with test environment
- **Payment Workflow**: HR creates requests → Admin processes payments
- **Transaction Logging**: Complete payment history with unique IDs
- **Duplicate Prevention**: No double payments for same month/year
- **Payment History**: Comprehensive transaction records with pagination

### 👥 HR Management Features
- **Employee Verification**: Toggle verification status for payment eligibility
- **Payment Request Creation**: Submit payment requests with month/year selection
- **Employee Details**: Individual profiles with salary charts
- **Progress Monitoring**: Advanced analytics and productivity tracking
- **Work Hours Analysis**: Filter by employee and month with summation

### 🎯 Admin Dashboard Features
- **Employee Management**: Full CRUD operations with role promotion
- **Payroll Processing**: Stripe-powered salary payments
- **User Statistics**: Comprehensive system overview and analytics
- **Fire/Rehire System**: Account suspension and reactivation
- **Salary Management**: Adjust employee salaries (increase only)

### 📈 Analytics & Reporting
- **Interactive Charts**: Recharts-powered data visualization
- **Productivity Metrics**: Employee performance comparison
- **Task Distribution**: Work type breakdown with filtering
- **Payment Analytics**: Salary trends and payment history charts
- **Real-time Statistics**: Live system health monitoring

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** with Vite for lightning-fast development
- **Material-UI (MUI)** for professional component library
- **TanStack Query** for efficient data fetching and caching
- **React Hook Form** for advanced form management
- **React Router DOM v6** for client-side routing
- **Firebase SDK v10** for authentication services
- **Stripe.js v2** for payment processing
- **Recharts** for interactive data visualization
- **React DatePicker** for date selection

### Backend Stack
- **Node.js & Express.js** for robust server framework
- **MongoDB** with native driver for database operations
- **Stripe API** for secure payment processing
- **Firebase Admin SDK** for user management
- **JWT** for secure API authentication
- **CORS** enabled for cross-origin requests

### Security Features
- **Environment Variables**: All sensitive data properly secured
- **Role-based API Protection**: JWT middleware for endpoint security
- **Input Validation**: Both client and server-side validation
- **Password Requirements**: Minimum 6 chars, capital letter, special character
- **Firebase Auth**: Industry-standard authentication
- **Stripe Security**: PCI-compliant payment processing

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or cloud service)
- **Firebase Project** (configured for web)
- **Stripe Account** (test mode enabled)

### Environment Configuration

#### Client (.env) - Already Configured
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_API_URL=your_api_url
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### Server (.env) - Already Configured
```env
MONGODB_URI=your_mongodb_uri
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Installation Steps

1. **Clone and Setup Server**
```bash
cd server
npm install
npm run seed  # Create test accounts and sample data
npm run dev   # Start development server
```

2. **Setup Client**
```bash
cd client
npm install --legacy-peer-deps
npm run dev   # Start development client
```

3. **Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🎮 Usage Guide

### For Employees
1. **Register/Login** with email and password or Google OAuth
2. **Work-sheet Management**:
   - Add daily work entries with task type, hours, and date
   - Edit existing entries through modal interface
   - Delete entries with confirmation
3. **Payment History**: View salary payments with transaction details

### For HR Personnel
1. **Employee Management**:
   - View all employees in professional table
   - Toggle employee verification status (❌/✅)
   - Access individual employee details with salary charts
2. **Payment Processing**:
   - Create payment requests for verified employees
   - Select month/year for salary payments
   - Monitor employee progress and productivity

### For Administrators
1. **System Management**:
   - Process salary payments via Stripe integration
   - Manage all employees (fire, promote, adjust salaries)
   - View comprehensive system analytics
2. **Payroll Operations**:
   - Approve payment requests from HR
   - Process payments with Stripe test cards
   - Monitor transaction history and system health

## 💳 Payment Testing

### Stripe Test Cards
- **Success Card**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3-digit number (e.g., 123)
- **ZIP**: Any 5-digit number (e.g., 12345)

### Payment Workflow
1. **HR Creates Request**: Select employee, month, year
2. **Admin Processes**: Use Stripe interface with test card
3. **System Records**: Automatic transaction logging
4. **Employee Views**: Payment appears in history

## 📊 Database Collections

### Users Collection
- Personal information (name, email, designation)
- Role data (employee, hr, admin)
- Verification status and employment details
- Salary and bank account information
- Profile photos and creation timestamps

### Worksheets Collection
- Employee work entries with email reference
- Task types and hours worked
- Date tracking for payroll periods
- CRUD operation timestamps

### Payments Collection
- Salary payment records with employee reference
- Stripe transaction data and IDs
- Monthly payment tracking (month/year)
- Payment dates and status information

### Payroll Requests Collection
- HR payment approval requests
- Admin processing status and timestamps
- Request metadata and employee details

### Contacts Collection
- Customer support messages
- Contact form submissions from website

## 🔒 Security Implementation

### Authentication & Authorization
- **Firebase Authentication**: Email/password with Google OAuth
- **Role-based Access Control**: Strict route and API protection
- **JWT Tokens**: Secure API communication
- **Password Security**: Strong password requirements enforced

### Data Protection
- **Environment Variables**: All credentials secured
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Comprehensive client and server validation
- **User Data Isolation**: Employee-specific data access

### Payment Security
- **Stripe Integration**: PCI-compliant payment processing
- **Test Environment**: Safe testing with sandbox mode
- **Transaction Logging**: Complete audit trail
- **Duplicate Prevention**: Business logic protection

## 📱 Responsive Design Features

### Mobile Optimization (320px - 767px)
- **Touch-friendly Interface**: Optimized button sizes and spacing
- **Mobile Navigation**: Hamburger menu with smooth transitions
- **Responsive Tables**: Horizontal scrolling for data tables
- **Mobile Forms**: Stack layout for better usability

### Tablet Support (768px - 1024px)
- **Adaptive Grid System**: Flexible column layouts
- **Touch Navigation**: Tablet-optimized interaction patterns
- **Dashboard Layouts**: Responsive card and table arrangements

### Desktop Experience (1025px+)
- **Full Feature Access**: Complete functionality exposure
- **Advanced Layouts**: Multi-column dashboard designs
- **Keyboard Navigation**: Full keyboard accessibility support

## 🛠️ Development Features

### Code Quality & Performance
- **ESLint Configuration**: Enforced code standards
- **Error Boundaries**: Graceful error handling throughout
- **Loading States**: Professional loading indicators
- **Optimistic Updates**: Immediate UI feedback
- **Query Caching**: Efficient data management with TanStack Query

### Developer Experience
- **Hot Module Replacement**: Fast development iteration
- **TypeScript Ready**: Type definitions available
- **Component Library**: Reusable UI components
- **API Documentation**: Clear endpoint specifications

## 🔄 API Endpoints

### Authentication Routes
- `POST /api/users/register` - User registration with role assignment
- `POST /api/users/sync` - Firebase-MongoDB user synchronization
- `GET /api/users/:email` - Fetch user profile by email
- `GET /api/users/statistics` - System user statistics (Admin)

### Employee Management
- `GET /api/employees` - Get all employees (HR/Admin)
- `PUT /api/users/:id` - Update user details (Admin)
- `PATCH /api/users/:id/verify` - Toggle verification (HR)
- `PATCH /api/users/:id/fire` - Fire/rehire employee (Admin)
- `PATCH /api/users/:id/promote` - Promote user role (Admin)

### Worksheet Operations
- `POST /api/worksheets` - Create work entry
- `GET /api/worksheets/:email` - Get user worksheets
- `PUT /api/worksheets/:id` - Update work entry
- `DELETE /api/worksheets/:id` - Delete work entry

### Payment & Payroll
- `GET /api/payments/:email` - Get payment history
- `POST /api/payroll-requests` - Create payment request (HR)
- `GET /api/payroll-requests` - Get pending requests (Admin)
- `POST /api/create-payment-intent` - Stripe payment intent
- `POST /api/process-payment` - Process salary payment

### System Operations
- `POST /api/contacts` - Submit contact form
- `GET /api/users` - Get all users (Admin)

## 🎯 Business Rules Implementation

### Employee Rules
- **Work Entry Validation**: Minimum 0.5 hours, maximum 24 hours
- **Date Restrictions**: Cannot enter future dates
- **Data Isolation**: Only see own work entries and payments
- **Payment History**: Sorted by earliest payments first
- **Task Categories**: Limited to specified options (Sales, Support, Content, Paper-work)

### HR Rules
- **Employee Verification**: Must verify before payment processing
- **Payment Requests**: Can only create for verified employees
- **Progress Monitoring**: Access to all employee work data
- **Filtering Capabilities**: Filter by employee and month with work hours summation

### Admin Rules
- **Full System Access**: Can manage all users and data
- **Payment Processing**: Only admins can process Stripe payments
- **Salary Management**: Can increase salaries (decrease not allowed)
- **User Management**: Fire, rehire, and promote employees
- **System Analytics**: Access to comprehensive statistics

## 📈 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading for dashboard components
- **Image Optimization**: ImgBB integration for efficient image storage
- **Query Caching**: TanStack Query for reduced API calls
- **Debounced Inputs**: Optimized form interactions

### Backend Optimizations
- **MongoDB Indexing**: Optimized queries for user data
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Comprehensive error management
- **Request Logging**: Performance monitoring capabilities

## 🔧 Troubleshooting

### Common Issues & Solutions

#### White Screen / Loading Issues
1. **Check MongoDB Connection**: Ensure database is accessible
2. **Verify Environment Variables**: Confirm all credentials are correct
3. **Clear Browser Cache**: Remove localStorage data
4. **Check Console Logs**: Monitor for JavaScript errors

#### Authentication Problems
1. **Firebase Configuration**: Verify Firebase project settings
2. **User Sync Issues**: Check database connectivity
3. **Token Expiration**: Refresh authentication tokens
4. **Role Assignment**: Ensure proper role assignment in database

#### Payment Processing Issues
1. **Stripe Keys**: Verify test/live key configuration
2. **Test Cards**: Use official Stripe test card numbers
3. **Webhook Configuration**: Ensure proper webhook setup
4. **Currency Settings**: Verify USD currency configuration

#### Database Connection
```bash
# Test MongoDB connection
mongosh "your_mongodb_uri"

# Check if server is running
curl http://localhost:3000

# Test user registration
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test User"}'
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

### Code Standards
- Follow ESLint configuration
- Use Material-UI components consistently
- Implement proper error handling
- Add comprehensive comments for complex logic
- Test all features across different roles

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support & Contact

### Support Channels
- **Email**: support@empowhr.com
- **Phone**: +1 (555) 123-4567
- **Business Hours**: Monday-Friday, 9:00 AM - 6:00 PM EST

### Documentation
- **API Documentation**: Available in server/docs
- **Component Library**: Storybook documentation
- **User Guides**: Comprehensive user manuals for each role

---

**Built with ❤️ using React 19, Node.js, MongoDB, Material-UI, and Stripe**

*EmpowHR - Empowering your workforce management for the digital age*
