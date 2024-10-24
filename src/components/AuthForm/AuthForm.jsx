import { Box, Image, VStack } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}

      {/* Main content */}
      <Box>
        <VStack spacing={6} align="center">
          <Image src="/public/assets/logo.png" h={8} alt="StudentPedia" />

          {/* Toggle between Login and Signup */}
          {isLogin ? <Login /> : <Signup />}
        </VStack>
      </Box>
    </div>
  );
};

export default AuthForm;
