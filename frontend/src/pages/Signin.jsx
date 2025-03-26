import { Link, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import './Signin.css';
import { useState } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSucess, signInFailure } from '../redux/user/userSlice';
import ima from '../assets/gicon.png';
import OAuth from '../components/OAuth';


function Signin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.id]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill in all fields"));
      return;
    }

    try {
      dispatch(signInStart());
      const res = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        // Dispatch error from backend response
        dispatch(signInFailure(data.message || "Signin failed"));
      } else {
        dispatch(signInSucess(data));
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
                 type={showPassword ? 'text' : 'password'} 
                placeholder="Enter password" 
                id="password" 
                onChange={handleChange} 
                required 
              />
              <Eye onClick={() => setShowPassword(!showPassword)}  className="login-eye-icon" size={20} />
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
