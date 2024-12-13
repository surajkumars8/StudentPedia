import { Box, Image, VStack } from "@chakra-ui/react";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */
      <img src="/public/assets/bg.png" alt="hi" className="absolute top-0 left-0 w-full h-full object-cover opacity-50" />
      }

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
