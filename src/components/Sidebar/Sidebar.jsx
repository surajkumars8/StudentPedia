import {
    Box,
    Button,
    Flex,
    Link,
    Tooltip,
    useDisclosure,
  } from "@chakra-ui/react";
  import { Link as RouterLink } from "react-router-dom";
//   import { InstagramLogo, InstagramMobileLogo } from "../../assets/constants";
  
  import { BiLogOut } from "react-icons/bi";
  import { IoMdInformationCircleOutline } from "react-icons/io";
  import useLogout from "../../hooks/useLogout";
//   import AboutPage from "../../pages/AboutPage/AboutPage";
  import SidebarItems from "./SidebarItems";
  
  const Sidebar = () => {
    const { handleLogout, isLoggingOut } = useLogout();
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <Box
        height={"100vh"}
        borderRight={"1px solid"}
        borderColor={"whiteAlpha.300"}
        py={8}
        position={"sticky"}
        top={0}
        left={0}
        px={{ base: 2, md: 4 }}>
        <Flex direction={"column"} gap={10} w="full" height={"full"}>
          <Link
            to={"/"}
            as={RouterLink}
            pl={2}
            display={{ base: "none", md: "block" }}
            cursor="pointer">
            {/* <InstagramLogo /> */}
          </Link>
          <Link
            to={"/"}
            as={RouterLink}
            p={2}
            display={{ base: "block", md: "none" }}
            borderRadius={6}
            _hover={{
              bg: "whiteAlpha.200",
            }}
            w={10}
            cursor="pointer">
            {/* <InstagramMobileLogo /> */}
          </Link>
          <Flex direction={"column"} gap={5} cursor={"pointer"}>
            <SidebarItems />
          </Flex>
  
          {/* About */}
          <Tooltip
            hasArrow
            label={"About"}
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}>
            <Flex
              alignItems={"center"}
              gap={4}
              _hover={{ bg: "whiteAlpha.400" }}
              borderRadius={6}
              p={2}
              w={{ base: 10, md: "full" }}
              justifyContent={{ base: "center", md: "flex-start" }}
              onClick={onOpen}>
              {/* <ReelsLogo /> */} <IoMdInformationCircleOutline />
              <Box display={{ base: "none", md: "block" }}>
                About{isOpen && <AboutPage isOpen={isOpen} onClose={onClose} />}
              </Box>
            </Flex>
          </Tooltip>
  
          {/* LOGOUT */}
          <Tooltip
            hasArrow
            label={"Logout"}
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}>
            <Flex
              onClick={handleLogout}
              alignItems={"center"}
              gap={4}
              _hover={{ bg: "whiteAlpha.400" }}
              borderRadius={6}
              p={2}
              w={{ base: 10, md: "full" }}
              mt={"auto"}
              justifyContent={{ base: "center", md: "flex-start" }}>
              <BiLogOut size={25} />
              <Button
                display={{ base: "none", md: "block" }}
                variant={"ghost"}
                _hover={{ bg: "transparent" }}
                isLoading={isLoggingOut}>
                Logout
              </Button>
            </Flex>
          </Tooltip>
        </Flex>
      </Box>
    );
  };
  
  export default Sidebar;