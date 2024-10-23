import { useState } from "react";
import { Button, Input, VStack, Alert, AlertIcon } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // Assuming you're using Firebase Auth

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleResetPassword = async () => {
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset link has been sent to your email.");
      setError(null);
    } catch (error) {
      setError("Error sending password reset email. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        placeholder="Enter your email"
        fontSize={14}
        type="email"
        size="sm"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        w="full"
        colorScheme="blue"
        size="md"
        onClick={handleResetPassword}
      >
        Reset Password
      </Button>

      {/* Display success or error messages */}
      {successMessage && (
        <Alert status="success" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {successMessage}
        </Alert>
      )}
      {error && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {error}
        </Alert>
      )}

      {/* Go Back Button to navigate to login */}
      <Button
        variant="link"
        colorScheme="blue"
        onClick={() => navigate("/auth")} // Navigate to login page
      >
        Go Back to Login
      </Button>
    </VStack>
  );
};

export default ResetPassword;
