import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import './Signin.css';
import { useState } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSucess, signInFailure } from '../redux/user/userSlice';
import ima from '../assets/gicon.png';
import OAuth from '../components/OAuth';

/**
 * Signin Component
 * Renders the sign-in form and handles user authentication.
 *
 * Features:
 * - Validates user input for email and password.
 * - Dispatches Redux actions for loading, success, and error states.
 * - Shows loading spinner and error messages.
 * - Integrates Google OAuth sign-in.
 * - Redirects to home on successful sign-in.
 */

function Signin() {
   // State for form data and password visibility
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

   // Redux hooks for dispatching actions and accessing user state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

    // Handles input changes for email and password fields
  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.id]: e.target.value 
    });
  };

  // Handles form submission for sign-in
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill in all fields"));
      toast.error("All fields are required");
      return;
    }

    try {
      // Send sign-in request to backend
      dispatch(signInStart());
      const res = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Add this line
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      // Handle error or success response
      if (!res.ok) {
        dispatch(signInFailure(data.message || "Signin failed"));
        toast.error(data.message || "Signin failed");
      } else {
        dispatch(signInSucess(data));
        toast.success("Signed in successfully!");
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Failed to sign in. Please try again");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Email" 
              id="email" 
              onChange={handleChange} 
              required 
            />
          </div>
           {/* Password input with show/hide toggle */}
           
          <div className="login-input-group">
            <label>Password</label>
            <div className="login-password-input">
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter password" 
                id="password" 
                onChange={handleChange} 
                required 
              />
              <Eye onClick={() => setShowPassword(!showPassword)} className="login-eye-icon" size={20} />
            </div>
          </div>
          {/* Forgot password link */}
          <div className="login-forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          {/* Sign In button with loading spinner */}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          {errorMessage && (
            <Alert className="mt-4" color="failure">
              {errorMessage}
            </Alert>
          )}
          {/* Divider and OAuth sign-in */}
          <div className="login-divider">
            <span>Or</span>
          </div>
          
          <OAuth />

          <p className="login-footer">
            Don't have an account? <Link to="/signup">Sign up now</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signin;
