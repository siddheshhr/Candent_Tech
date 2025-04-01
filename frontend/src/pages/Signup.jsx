import { Link, useNavigate } from 'react-router-dom';
import { Eye, Phone } from 'lucide-react';
import './Signup.css';
import { useState } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import OAuth from '../components/OAuth';
import { toast } from 'react-toastify';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.contactNumber ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErrorMessage("All fields are required");
      toast.error("All fields are required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber,
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-3">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-4 my-2">
        <h1 className="text-2xl font-bold text-center mb-3">Create Your Account</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
                placeholder="Enter Your First Name"
                id="firstName"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
                placeholder="Enter Your Last Name"
                id="lastName"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
              placeholder="Enter Your Email Address"
              id="email"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Number</label>
            <div className="flex">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-l border border-r-0 border-gray-300">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <input
                type="tel"
                className="flex-1 p-2 bg-gray-50 border border-gray-300 rounded-r"
                placeholder="Enter Your Phone Number"
                id="contactNumber"
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter your phone number with country code, Ex: +91 1234567890</p>
            {/* <p className="text-xs text-gray-500 mt-1">Ex: +91 1234567890</p> */}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
                  placeholder="Enter password"
                  id="password"
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded"
                  placeholder="Confirm password"
                  id="confirmPassword"
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-2" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Eye className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <button 
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition duration-200" 
            type="submit" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" />
                <span className="ml-2">Creating Account...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          {errorMessage && (
            <Alert className="mt-2 py-1" color="failure">
              {errorMessage}
            </Alert>
          )}

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <OAuth />
          
          <p className="text-center text-sm text-gray-600">
            Already have an account? <Link to="/signin" className="text-blue-600 hover:underline font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;