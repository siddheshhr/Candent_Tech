import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import './Signin.css';
import { useState } from 'react';
import { Alert, Spinner } from 'flowbite-react';

function Signin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.id]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Signin failed");
        setLoading(false);
        return;
      }
      // On successful sign in, you can store the token if needed and navigate.
      console.log(data);
      setLoading(false);
      navigate('/dashboard');  // Update the route as per your app
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error. Please try again");
      setLoading(false);
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

          <div className="login-input-group">
            <label>Password</label>
            <div className="login-password-input">
              <input 
                type="password" 
                placeholder="Enter password" 
                id="password" 
                onChange={handleChange} 
                required 
              />
              <Eye className="login-eye-icon" size={20} />
            </div>
          </div>

          <div className="login-forgot-password">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

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

          <div className="login-divider">
            <span>Or</span>
          </div>

          <button className="login-google-btn" type="button">
            <img 
              src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" 
              alt="Google" 
            />
            Or sign in with Google
          </button>

          <p className="login-footer">
            Don't have an account? <Link to="/signup">Sign up now</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signin;
