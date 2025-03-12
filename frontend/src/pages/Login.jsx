import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-form">
        {/* Title */}
        <h1 className="login-title">Welcome Back</h1>

        {/* Email Input */}
        <div className="login-input-group">
          <label>Email Address</label>
          <input type="email" placeholder="Email" required />
        </div>

        {/* Password Input */}
        <div className="login-input-group">
          <label>Password</label>
          <div className="login-password-input">
            <input type="password" placeholder="Enter password" required />
            <Eye className="login-eye-icon" size={20} />
          </div>
        </div>

        {/* Forgot Password */}
        <div className="login-forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        {/* Sign In Button */}
        <button className="login-btn">Sign in</button>

        {/* Divider */}
        <div className="login-divider">
          <span>Or</span>
        </div>

        {/* Google Sign In */}
        <button className="login-google-btn">
          <img 
            src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
            alt="Google" 
          />
          Or sign in with Google
        </button>

        {/* Footer (Sign Up Link) */}
        <p className="login-footer">
          Don't have an account? <Link to="/signup">Sign up now</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
