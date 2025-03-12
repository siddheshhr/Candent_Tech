import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import './Signup.css';

function Signup() {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1 className="signup-title">Create Your Account</h1>
        
        <div className="signup-name-fields">
          <div className="signup-input-group">
            <label>First Name</label>
            <input type="text" className='signup-input' placeholder="Enter Your First Name" />
          </div>
          <div className="signup-input-group">
            <label>Last Name</label>
            <input type="text" className='signup-input' placeholder="Enter Your Last Name" />
          </div>
        </div>

        <div className="signup-input-group">
          <label>Email Address</label>
          <input type="email" className="signup-input" placeholder="Email or phone number" />
        </div>

        <div className="signup-input-group signup-date-input">
          <label>Date of Birth</label>
          <input type="text" className="signup-input" placeholder="dd/mm/yyyy" />
          <span className="signup-calendar-icon">📅</span>
        </div>

        <div className="signup-password-fields">
          <div className="signup-input-group">
            <label>Password</label>
            <div className="signup-password-input">
              <input type="password" placeholder="Enter password" />
              <Eye className="signup-eye-icon" size={20} />
            </div>
          </div>
          <div className="signup-input-group">
            <label>Confirm Password</label>
            <div className="signup-password-input">
              <input type="password" placeholder="Enter password" />
              <Eye className="signup-eye-icon" size={20} />
            </div>
          </div>
        </div>

        <button className="signup-btn">Create Account</button>
        
        <div className="signup-divider">
          <span>Or</span>
        </div>

        <button className="signup-google-btn">
          <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" alt="Google" />
          Sign up with Google
        </button>

        <p className="signup-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
