import { Button } from "flowbite-react";
import ima from "../assets/gicon.png";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import React from "react";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSucess } from "../redux/user/userSlice"; // Fixed typo in import
import { useNavigate } from "react-router-dom";

function OAuth() {
    const navigate = useNavigate();
    const auth = getAuth(app);
    const dispatch = useDispatch();
    
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const result = await signInWithPopup(auth, provider);
            
            const response = await fetch('http://localhost:3000/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    googlePhotoUrl: result.user.photoURL
                }),
            });

            const data = await response.json(); // Fixed variable name (res -> response)
            
            if (response.ok) {
                dispatch(signInSucess(data)); // Fixed typo in action name
                navigate('/dashboard');
            } else {
                console.error('Backend error:', data.message);
            }
        } catch (err) {
            console.error('Google sign-in failed:', err);
        }
    };

    return (
        <button 
        className="signup-google-btn font-medium transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:ring-2 hover:ring-blue-500" 
        type="button" 
        onClick={handleGoogleSignIn}
      >
        <img src={ima} alt="Google" className="inline-block mr-2" style={{ width: '20px', height: '20px' }} />
        Continue with Google
      </button>
      
    );
}

export default OAuth;