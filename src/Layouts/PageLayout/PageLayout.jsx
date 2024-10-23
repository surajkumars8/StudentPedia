import { Box, Flex, Spinner } from "@chakra-ui/react";

import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation } from "react-router-dom";
import FloatingNav from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import navItems from "../../constants/index";
import { auth } from "../../firebase/firebase";

const PageLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [user, loading] = useAuthState(auth);

  const canRenderSidebar = pathname !== "/auth" && user;
  const canRenderNavbar = user; // Now we render the navbar for all pages when user is authenticated

  const checkingUserIsAuth = !user && loading;
  if (checkingUserIsAuth) return <PageLayoutSpinner />;

  return (
    <Flex>
      {/* Sidebar on the left */}
      {canRenderSidebar && (
        <Box
          w={{ base: "70px", md: "240px" }}
          position="fixed"
          left={0}
          top={0}
          bottom={0}>
          <Sidebar />
        </Box>
      )}

      {/* Main content */}
      <Box
        flex={1}
        ml={canRenderSidebar ? { base: "70px", md: "240px" } : 0}
        w={
          canRenderSidebar
            ? { base: "calc(100% - 70px)", md: "calc(100% - 240px)" }
            : "100%"
        }>
        {children}
      </Box>

      {/* FloatingNav on the right top */}
      {canRenderNavbar && (
        <Box position="fixed" top={4} right={600} zIndex={1000}>
          <FloatingNav navItems={navItems} />
        </Box>
      )}
    </Flex>
  );
};

export default PageLayout;

const PageLayoutSpinner = () => {
  return (
    <Flex
      flexDir="column"
      h="100vh"
      alignItems="center"
      justifyContent="center">
      <Spinner size="xl" />
    </Flex>
  );
};