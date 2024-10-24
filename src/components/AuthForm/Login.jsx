import { LockIcon } from "@chakra-ui/icons"; // Import icons
import { Alert, AlertIcon, Button, Input, VStack } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Firebase auth
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState(null); // State for email validation error
  const [firebaseError, setFirebaseError] = useState(null); // State for firebase login error
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate for routing
  const auth = getAuth(); // Get the Firebase auth instance

  const handleLogin = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@vbithyd\.ac\.in$/;

    // Check if email matches the required domain
    if (!emailRegex.test(inputs.email)) {
      setEmailError("Please use a valid vbithyd.ac.in email address.");
      return; // Prevent further execution if email is invalid
    } else {
      setEmailError(null); // Clear the error if the email is valid
    }

    setLoading(true); // Set loading state to true
    setFirebaseError(null); // Clear any previous Firebase errors

    try {
      // Attempt to sign in the user with Firebase
      await signInWithEmailAndPassword(auth, inputs.email, inputs.password);
      // alert("Login successful!"); // Alert on successful login
      navigate("/home"); // Navigate to the home page or dashboard after successful login
    } catch (error) {
      setFirebaseError(error.message); // Capture any Firebase errors
      console.error("Login error:", error); // Log the error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-100vh flex items-center justify-center  relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48  rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-20 left-20 w-16 h-16  rounded-full" />

      {/* Main content */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img
            src="/public/assets/logo.png"
            alt="StudentPedia"
            className="h-8"
          />
          <span className="text-2xl font-bold ml-2">StudentPedia</span>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 relative z-10">
          <h2 className="text-xl font-semibold mb-6">Login</h2>

          <VStack spacing={4} align="stretch">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <Input
                className="w-full p-3 bg-[#E8E8E8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8e4a8]"
                placeholder="Enter your email"
                type="email"
                value={inputs.email}
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <Input
                className="w-full p-3 bg-[#E8E8E8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8e4a8]"
                placeholder="Enter your password"
                type="password"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
              />
            </div>

            {/* Show email validation error if it exists */}
            {emailError && (
              <Alert status="error" fontSize={13} p={2} borderRadius={4}>
                <AlertIcon fontSize={12} />
                {emailError}
              </Alert>
            )}

            {/* Show Firebase error if it exists */}
            {firebaseError && (
              <Alert status="error" fontSize={13} p={2} borderRadius={4}>
                <AlertIcon fontSize={12} />
                {firebaseError}
              </Alert>
            )}

            {/* Login Button */}
            <Button
              w={"full"}
              colorScheme="green"
              size={"md"}
              fontSize={16}
              isLoading={loading}
              onClick={handleLogin}
              leftIcon={<LockIcon />}
              className="bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors">
              Log In
            </Button>

            {/* Forgot Password Button */}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/reset-password")}>
              Forgot Password?
            </Button>

            {/* Sign Up Button */}
            <Button
              variant="link"
              colorScheme="black"
              onClick={() => navigate("/signup")}>
              Don't have an account? Sign Up
            </Button>
          </VStack>
        </div>
      </div>
    </div>
  );
};

export default Login;
