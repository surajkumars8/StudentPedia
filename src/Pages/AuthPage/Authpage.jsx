import { Box, Container, Flex, Image, VStack } from "@chakra-ui/react";
import AuthForm from "../../components/AuthForm/AuthForm";

const AuthPage = () => {
  return (
    <Flex
      minH={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
      px={4}
      overflow={"hidden"}>
      <Container maxW={"full"} padding={0} h={"100vh"}>
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          gap={10}
          h={"100vh"}>
          {/* Background Image */}

          {/* Auth Form on bottom-right corner */}
          <Box position={"absolute"} bottom={9} right={60} zIndex={1}>
            <VStack spacing={4} align={"stretch"}>
              <AuthForm />
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

export default AuthPage;
