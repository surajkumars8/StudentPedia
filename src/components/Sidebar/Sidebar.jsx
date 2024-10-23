import {
  Box,
  Button,
  Flex,
  Link,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { BsFillImageFill } from "react-icons/bs";  // For the Create button icon
import useLogout from "../../hooks/useLogout";
import SidebarItems from "./SidebarItems";
import CreatePost from "./CreatePost";  // Import the CreatePost component

const Sidebar = () => {
  const { handleLogout, isLoggingOut } = useLogout();
  const { isOpen: isAboutOpen, onOpen: onAboutOpen, onClose: onAboutClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

  return (
    <Box
      height={"100vh"}
      borderRight={"1px solid "}
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
          {/* Add your logo or brand image here */}
        </Link>

        <Flex direction={"column"} gap={5} cursor={"pointer"}>
          <SidebarItems />
        </Flex>

        {/* Create Button */}
        {/* <Tooltip
          hasArrow
          label={"Create"}
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
            onClick={onCreateOpen}>
            <BsFillImageFill size={24} />
            <Box display={{ base: "none", md: "block" }}>Create</Box>
          </Flex>
        </Tooltip> */}

        {/* About Button */}

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
