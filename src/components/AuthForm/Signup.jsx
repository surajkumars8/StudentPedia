import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Signup = () => {
  const [inputs, setInputs] = useState({
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignup = async () => {
    if (inputs.password !== inputs.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    if (!inputs.email.endsWith('@vbithyd.ac.in')) {
      setFirebaseError('Please use your @vbithyd.ac.in email address');
      return;
    }

    setPasswordsMatch(true);
    setLoading(true);
    setFirebaseError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password
      );

      await sendEmailVerification(userCredential.user);
      setVerificationEmailSent(true);
      
    } catch (error) {
      setFirebaseError(
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please login instead.'
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f9f4] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#c3ecc3] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c3ecc3] rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-20 left-20 w-16 h-16 bg-[#c3ecc3] rounded-full" />
      
      {/* Main content */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="StudentPedia" className="h-8" />
          <span className="text-2xl font-bold ml-2">StudentPedia</span>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 relative z-10">
          <h2 className="text-xl font-semibold mb-6">Create account</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Firstname*
              </label>
              <input
                className="w-full p-3 bg-[#E8E8E8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8e4a8]"
                placeholder="Enter your name"
                value={inputs.firstName}
                onChange={(e) => setInputs({ ...inputs, firstName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                className="w-full p-3 bg-[#E8E8E8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8e4a8]"
                placeholder="Enter your email"
                type="email"
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password!*
              </label>
              <input
                className="w-full p-3 bg-[#E8E8E8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8e4a8]"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password*
              </label>
              <input
                className="w-full p-3 bg-[#E8E8E8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8e4a8]"
                placeholder="Confirm your password"
                type={showPassword ? "text" : "password"}
                value={inputs.confirmPassword}
                onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
              />
            </div>

            {!passwordsMatch && (
              <div className="text-red-600 text-sm">
                Passwords do not match.
              </div>
            )}

            {firebaseError && (
              <div className="text-red-600 text-sm">
                {firebaseError}
              </div>
            )}

            <button
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              disabled={loading}
              onClick={handleSignup}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-black hover:underline text-sm"
              >
                goback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;