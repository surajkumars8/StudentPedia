import { Box, Container, Flex, VStack } from "@chakra-ui/react";
import Login from "../../components/AuthForm/Login"; // Import only the Login form

const AuthPage = () => {
  return (
    <Flex
      minH={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      px={4}
      overflow={"hidden"}
      bgColor={"#f4f9f4"} // Match background color from the login page
      position={"relative"}>
      <Container maxW={"full"} padding={0} h={"100vh"} position={"relative"}>
        {/* Background Decorations */}
        <Box
          position={"absolute"}
          top={0}
          right={0}
          w={"48"}
          h={"48"}
          bg={"#c3ecc3"}
          rounded={"full"}
          transform={"translate(50%, -50%)"}
          zIndex={0}
        />
        <Box
          position={"absolute"}
          bottom={0}
          left={0}
          w={"64"}
          h={"64"}
          // bg={"#c3ecc3"}
          rounded={"full"}
          transform={"translate(-50%, 50%)"}
          zIndex={0}
        />
        <Box
          position={"absolute"}
          top={20}
          left={20}
          w={"16"}
          h={"16"}
          bg={"#c3ecc3"}
          rounded={"full"}
          zIndex={0}
        />

        {/* Centered Login Form */}
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          h={"100vh"}
          zIndex={1}>
          <Box
            width={"full"}
            maxW={"md"}
            bg={"white"}
            p={8}
            borderRadius={8}
            boxShadow={"lg"}>
            <VStack spacing={4} align={"stretch"}>
              <Login /> {/* Render the Login form only */}
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

export default AuthPage;
