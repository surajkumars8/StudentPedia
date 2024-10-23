import {
  Alert,
  AlertIcon,
  Button,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AddIcon, LockIcon } from "@chakra-ui/icons"; // Import icons
import useAdminLogin from "../../hooks/useAdminLogin"; // Custom hook for login/signup logic

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(null); // State for email validation error
  const [isSignUp, setIsSignUp] = useState(false); // Track whether in sign-up mode
  const { loading, error, login, signup } = useAdminLogin();

  const handleAuth = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@vbithyd\.ac\.in$/;

    // Check if email matches the required domain
    if (!emailRegex.test(inputs.email)) {
      setEmailError("Please use a valid vbithyd.ac.in email address.");
      return; // Prevent further execution if email is invalid
    } else {
      setEmailError(null); // Clear the error if the email is valid
    }

    if (isSignUp) {
      signup(inputs); // Trigger signup if in sign-up mode
    } else {
      login(inputs); // Trigger login if not in sign-up mode
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

      {/* Show server-side error if it exists */}
      {error && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {error.message}
        </Alert>
      )}

      {/* Conditionally render Log In button if not in sign-up mode */}
      {!isSignUp && (
        <Button
          w={"full"}
          colorScheme="green"
          size={"md"}
          fontSize={16}
          isLoading={loading && !isSignUp} // Show loading if login is in progress
          onClick={() => {
            setIsSignUp(false); // Ensure login mode is active
            handleAuth(); // Handle login
          }}
          leftIcon={<LockIcon />} // Lock icon for login
        >
          Log In
        </Button>
      )}

      {/* Conditionally render Sign Up button if in sign-up mode */}
      {isSignUp && (
        <Button
          w={"full"}
          colorScheme="green"
          size={"md"}
          fontSize={16}
          isLoading={loading && isSignUp} // Show loading if signup is in progress
          onClick={() => handleAuth()} // Handle sign up
          leftIcon={<AddIcon />} // Add icon for sign-up
        >
          Sign Up
        </Button>
      )}

      {/* Switch between Log In and Sign Up mode */}
      {!isSignUp ? (
        <Button
          variant="link"
          colorScheme="black"
          onClick={() => setIsSignUp(true)} // Switch to sign-up mode
        >
          Don't have an account? Sign Up
        </Button>
      ) : (
        <Button
          variant="link"
          colorScheme="teal"
          onClick={() => setIsSignUp(false)} // Switch back to log-in mode
        >
          Already have an account? Log In
        </Button>
      )}
    </VStack>
  );
};

export default Login;
