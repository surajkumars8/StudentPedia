import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { TbNotes } from "react-icons/tb";
import { RiMapPinUserFill } from "react-icons/ri";

const LostFound = () => {
  return (
    <Tooltip
      hasArrow
      label={"Home"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}>
      <Link
        display={"flex"}
        to={"/lostandfound"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}>

        <RiMapPinUserFill size={25}/>
        <Box display={{ base: "none", md: "block" }}>LostFound</Box>
      </Link>
    </Tooltip>
  );
};

export default LostFound;