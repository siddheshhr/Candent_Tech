import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import './Signup.css';
import { useState } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import ima from '../assets/gicon.png';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';

function Signup() {
  const navigate = useNavigate();
    // State for form fields, error message, and loading spinner
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handles input changes for all form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };
  
  // Handles form submission for sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if any field is empty
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage("All fields are required");
      toast.error("All fields are required");
      return;
    }
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      // Send sign-up request to backend
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      if (data.success === false) {
        setErrorMessage(data.message);
        toast.error(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      if (res.ok) {
        toast.success("Account created successfully!");
        navigate('/signin');
      }
    } catch (err) {
      setErrorMessage(err.message);
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1 className="signup-title">Create Your Account</h1>
        <form className="signup-radio-form" onSubmit={handleSubmit}>
           {/* Name fields */}
          <div className="signup-name-fields">
            <div className="signup-input-group">
              <label>First Name</label>
              <input
                type="text"
                className="signup-input"
                placeholder="Enter Your First Name"
                id="firstName"
                onChange={handleChange}
              />
            </div>
            <div className="signup-input-group">
              <label>Last Name</label>
              <input
                type="text"
                className="signup-input"
                placeholder="Enter Your Last Name"
                id="lastName"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="signup-input-group">
            <label>Email Address</label>
            <input
              type="email"
              className="signup-input"
              placeholder="Email"
              id="email"
              onChange={handleChange}
            />
          </div>
          {/* Phone number input */}
          <div className="signup-input-group">
            <label>Phone Number</label>
            <input
              type="text"
              className="signup-input"
              placeholder="Enter Your Phone Number"
              id="phoneNumber"
              onChange={handleChange}
            />
          </div>
          {/* Password and confirm password fields */}
          <div className="signup-password-fields">
            <div className="signup-input-group">
              <label>Password</label>
              <div className="signup-password-input">
                <input
                  type="password"
                  placeholder="Enter password"
                  id="password"
                  onChange={handleChange}
                />
                <Eye className="signup-eye-icon" size={20} />
              </div>
            </div>
            <div className="signup-input-group">
              <label>Confirm Password</label>
              <div className="signup-password-input">
                <input
                  type="password"
                  placeholder="Confirm password"
                  id="confirmPassword"
                  onChange={handleChange}
                />
                <Eye className="signup-eye-icon" size={20} />
              </div>
            </div>
          </div>

        {/* Sign Up button with loading spinner */}
          <button className="signup-btn font-bold" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>

          {/* Bottom section adjusted to fit on one screen */}
          <div className="signup-divider">
            <span>Or</span>
          </div>
          <OAuth />
          <p className="signup-footer">
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
