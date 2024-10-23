import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const Signup = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailError, setEmailError] = useState(null);
  const [firebaseError, setFirebaseError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize useNavigate
  const auth = getAuth();

  // Function to send OTP to the user's email
  const handleSendOTP = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@vbithyd\.ac\.in$/;
    if (!emailRegex.test(inputs.email)) {
      setEmailError("Please use a valid vbithyd.ac.in email address.");
      return;
    }

    // Simulate sending OTP. In a real app, you would implement actual OTP sending logic.
    setOtpSent(true);
    setEmailError(null);
    alert("OTP sent to your email. Please check your inbox.");
  };

  // Function to verify the OTP entered by the user
  const handleVerifyOTP = () => {
    // In a real application, replace this with actual OTP verification logic.
    if (inputs.otp === "123456") { // Simulated OTP for demonstration
      setOtpVerified(true);
      alert("Email verified successfully!");
    } else {
      alert("Invalid OTP, please try again.");
    }
  };

  // Function to handle user signup
  const handleSignup = async () => {
    if (inputs.password !== inputs.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setPasswordsMatch(true);
    setLoading(true);

    try {
      // Create a new user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        inputs.email,
        inputs.password
      );
      console.log("User created:", userCredential.user);

      // Send email verification
      await sendEmailVerification(userCredential.user);
      alert("Signup successful! Please check your email for verification link.");

      // Redirect to login page
      navigate("/login"); // Adjust the path based on your routing setup

    } catch (error) {
      setFirebaseError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Input
        placeholder="Full Name"
        fontSize={14}
        type="text"
        size={"sm"}
        value={inputs.fullName}
        onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
      />

      <Input
        placeholder="Username"
        fontSize={14}
        type="text"
        size={"sm"}
        value={inputs.username}
        onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
      />

      <Input
        placeholder="Email (@vbithyd.ac.in)"
        fontSize={14}
        type="email"
        size={"sm"}
        value={inputs.email}
        onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
        isDisabled={otpSent}
      />

      {!otpSent && (
        <Button
          size="sm"
          colorScheme="blue"
          fontSize={14}
          onClick={handleSendOTP}
        >
          Send OTP
        </Button>
      )}

      {otpSent && !otpVerified && (
        <>
          <Input
            placeholder="Enter OTP"
            fontSize={14}
            type="text"
            size={"sm"}
            value={inputs.otp}
            onChange={(e) => setInputs({ ...inputs, otp: e.target.value })}
          />
          <Button
            size="sm"
            colorScheme="blue"
            fontSize={14}
            onClick={handleVerifyOTP}
          >
            Verify OTP
          </Button>
        </>
      )}

      {otpVerified && (
        <>
          <Text fontSize="sm" color="green.500">
            Email verified successfully!
          </Text>
          <InputGroup>
            <Input
              placeholder="Password"
              fontSize={14}
              type={showPassword ? "text" : "password"}
              value={inputs.password}
              size={"sm"}
              onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
            />
            <InputRightElement h="full">
              <Button
                variant={"ghost"}
                size={"sm"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <ViewIcon /> : <ViewOffIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>

          <InputGroup>
            <Input
              placeholder="Confirm Password"
              fontSize={14}
              type={showPassword ? "text" : "password"}
              value={inputs.confirmPassword}
              size={"sm"}
              onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
            />
          </InputGroup>

          {!passwordsMatch && (
            <Alert status="error" fontSize={13} p={2} borderRadius={4}>
              <AlertIcon fontSize={12} />
              Passwords do not match.
            </Alert>
          )}

          <Button
            w={"full"}
            colorScheme="blue"
            size={"sm"}
            fontSize={14}
            isLoading={loading}
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </>
      )}

      {emailError && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {emailError}
        </Alert>
      )}

      {firebaseError && (
        <Alert status="error" fontSize={13} p={2} borderRadius={4}>
          <AlertIcon fontSize={12} />
          {firebaseError}
        </Alert>
      )}
    </VStack>
  );
};

export default Signup;
