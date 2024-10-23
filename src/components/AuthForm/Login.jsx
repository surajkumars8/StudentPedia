import {
  Alert,
  AlertIcon,
  Button,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { LockIcon } from "@chakra-ui/icons"; // Import icons
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Firebase auth

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
      alert("Login successful!"); // Alert on successful login
      navigate("/home"); // Navigate to the home page or dashboard after successful login
    } catch (error) {
      setFirebaseError(error.message); // Capture any Firebase errors
      console.error("Login error:", error); // Log the error for debugging
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        placeholder="Email"
        fontSize={14}
        type="email"
        size={"sm"}
        value={inputs.email}
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
      />

      <Input
        placeholder="Password"
        fontSize={14}
        size={"sm"}
        type="password"
        value={inputs.password}
        onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
      />

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
      >
        Log In
      </Button>

      {/* Forgot Password Button, navigates to reset-password */}
      <Button
        variant="link"
        colorScheme="blue"
        onClick={() => navigate("/reset-password")} // Navigate to reset-password page
      >
        Forgot Password?
      </Button>

      {/* Sign Up Button, navigates to sign-up page */}
      <Button
        variant="link"
        colorScheme="black"
        onClick={() => navigate("/signup")} // Navigate to signup page
      >
        Don't have an account? Sign Up
      </Button>
    </VStack>
  );
};

export default Login;
