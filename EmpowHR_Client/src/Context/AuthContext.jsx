import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncInProgress, setSyncInProgress] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  // Enhanced Register user with email and password
  const registerUser = async (email, password, userData) => {
    setLoading(true);
    try {
      console.log('Starting user registration for:', email);
      
      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase profile
      await updateProfile(result.user, {
        displayName: userData.name,
        photoURL: userData.photo
      });
      
      console.log('Firebase user created successfully');
      
      // Save user to database with enhanced error handling
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
          email: email.toLowerCase().trim(),
          name: userData.name.trim(),
          role: userData.role,
          designation: userData.designation,
          salary: userData.salary,
          bank_account_no: userData.bank_account_no,
          photo: userData.photo
        });
        
        console.log('User registered in database successfully');
        setUserDetails(response.data.user || response.data);
      } catch (dbError) {
        console.error('Database registration error:', dbError);
        
        if (dbError.response?.status === 409) {
          // User already exists in database, try to fetch existing user
          console.log('User already exists in database, fetching existing data');
          try {
            const existingUserResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${email.toLowerCase().trim()}`);
            setUserDetails(existingUserResponse.data);
            console.log('Existing user data retrieved successfully');
          } catch (fetchError) {
            console.error('Failed to fetch existing user:', fetchError);
            // Set fallback user details from Firebase
            setUserDetails({
              email: email.toLowerCase().trim(),
              name: userData.name.trim(),
              role: userData.role,
              designation: userData.designation,
              salary: userData.salary,
              bank_account_no: userData.bank_account_no,
              photo: userData.photo,
              isVerified: false
            });
          }
        } else {
          console.warn('Database registration failed, using Firebase data as fallback');
          // Set basic user details from Firebase
          setUserDetails({
            email: email.toLowerCase().trim(),
            name: userData.name.trim(),
            role: userData.role,
            designation: userData.designation,
            salary: userData.salary,
            bank_account_no: userData.bank_account_no,
            photo: userData.photo,
            isVerified: false
          });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      
      // Enhanced error handling for Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('An account with this email already exists. Please try logging in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Please choose a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address format.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Login user with email and password
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google sign in with database sync
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Explicitly sync user data with database after successful Google login
      if (result.user) {
        try {
          await syncUserWithDatabase(result.user);
        } catch (syncError) {
          console.error('Error syncing Google user with database:', syncError);
          // Set fallback user details if sync fails
          const fallbackUser = {
            email: result.user.email,
            name: result.user.displayName || result.user.email.split('@')[0],
            role: 'employee',
            designation: 'Staff',
            salary: 25000,
            photo: result.user.photoURL || '',
            isVerified: false
          };
          setUserDetails(fallbackUser);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserDetails(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sync user with database (with duplicate prevention)
  const syncUserWithDatabase = async (firebaseUser) => {
    // Prevent multiple simultaneous sync calls
    if (syncInProgress) {
      console.log('Sync already in progress, skipping...');
      return userDetails;
    }

    setSyncInProgress(true);
    try {
      // Try to fetch user from database first
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${firebaseUser.email}`, { 
        timeout: 5000 
      });
      
      console.log('User found in database:', response.data.email);
      setUserDetails(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // User not found, create a new user via the register endpoint
        try {
          console.log('User not found, creating via register endpoint...');
          const newUserResponse = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'employee',
            designation: 'Staff',
            salary: 25000,
            photo: firebaseUser.photoURL || ''
          });
          
          const newUser = newUserResponse.data.user;
          console.log('User created successfully:', newUser.email);
          setUserDetails(newUser);
          return newUser;
        } catch (createError) {
          console.error('Failed to create user in database:', createError);
          
          // If create fails due to duplicate (race condition), try to fetch the user
          if (createError.response?.status === 409) {
            try {
              console.log('User already exists, fetching existing data...');
              const existingUserResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${firebaseUser.email}`);
              setUserDetails(existingUserResponse.data);
              return existingUserResponse.data;
            } catch (fetchError) {
              console.error('Failed to fetch existing user:', fetchError);
            }
          }
          
          // Set fallback user details
          const fallbackUser = {
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'employee',
            designation: 'Staff',
            salary: 25000,
            photo: firebaseUser.photoURL || '',
            isVerified: false
          };
          setUserDetails(fallbackUser);
          return fallbackUser;
        }
      } else {
        console.error('Database connection failed:', error);
        // Set fallback user details from Firebase
        const fallbackUser = {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          role: 'employee',
          designation: 'Staff',
          salary: 25000,
          photo: firebaseUser.photoURL || '',
          isVerified: false
        };
        setUserDetails(fallbackUser);
        return fallbackUser;
      }
    } finally {
      setSyncInProgress(false);
    }
  };

  // Monitor auth state changes (with debouncing to prevent multiple calls)
  useEffect(() => {
    let timeoutId;
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth state changed:', currentUser?.email || 'No user');
      
      // Clear any pending sync operations
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (currentUser) {
        setUser(currentUser);
        
        // Debounce user sync to prevent rapid multiple calls
        timeoutId = setTimeout(async () => {
          try {
            await syncUserWithDatabase(currentUser);
          } catch (error) {
            console.error('Error syncing user:', error);
            // Set minimal user details as fallback
            setUserDetails({
              email: currentUser.email,
              name: currentUser.displayName || currentUser.email.split('@')[0],
              role: 'employee',
              designation: 'Staff',
              salary: 25000,
              photo: currentUser.photoURL || '',
              isVerified: false
            });
          }
        }, 500); // 500ms debounce
      } else {
        setUser(null);
        setUserDetails(null);
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribe();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const authInfo = {
    user,
    userDetails,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logoutUser
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
