import { Alert, AlertIcon, Button, Input, VStack } from "@chakra-ui/react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-f4f9f4">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-green-200 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-100 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-20 left-20 w-16 h-16 bg-green-300 rounded-full" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="StudentPedia" className="h-8" />
          <span className="text-2xl font-bold ml-2">StudentPedia</span>
        </div>

        {/* Reset Password Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 relative z-10">
          <h2 className="text-xl font-semibold mb-6">Reset Password</h2>

          <VStack spacing={4} align="stretch">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <Input
                className="w-full p-3 bg-[#E8E8E8] rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8e4a8]"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Reset Button */}
            <Button
              w={"full"}
              colorScheme="green"
              size={"md"}
              fontSize={16}
              onClick={handleResetPassword}
              className="bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors">
              Send Reset Link
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

            {/* Go Back to Login Button */}
            <Button
              variant="link"
              colorScheme="blue"
              onClick={() => navigate("/auth")}>
              Go Back to Login
            </Button>
          </VStack>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
