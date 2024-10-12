import { Box, Link, Tooltip } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { TbNotes } from "react-icons/tb";
import { IoNewspaperSharp } from "react-icons/io5";

const PreviousPaper = () => {
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
        to={"/previouspaper"}
        as={RouterLink}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}>

        <IoNewspaperSharp size={25}/>
        <Box display={{ base: "none", md: "block" }}>PreviousPaper</Box>
      </Link>
    </Tooltip>
  );
};

export default PreviousPaper;