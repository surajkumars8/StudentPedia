import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { TbNotes } from "react-icons/tb";
import { GrGroup } from "react-icons/gr";


const Forums = () => {
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
        to={"/forum"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}>

        <GrGroup size={25}/>
        <Box display={{ base: "none", md: "block" }}>Forums</Box>
      </Link>
    </Tooltip>
  );
};

export default Forums;