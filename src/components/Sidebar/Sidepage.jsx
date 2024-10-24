import { Box, Link, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { BiSolidVideos } from "react-icons/bi";
import { GiTeacher } from "react-icons/gi";
import { GrGroup } from "react-icons/gr";
import { IoNewspaperSharp } from "react-icons/io5";
import { RiMapPinUserFill } from "react-icons/ri";
import { SiTestcafe } from "react-icons/si";
import { TbNotes } from "react-icons/tb";
import { Link as RouterLink, useLocation } from "react-router-dom";

const items = [
  { icon: <TbNotes size={25} />, name: "Notes", route: "/notespage" },
  {
    icon: <IoNewspaperSharp size={25} />,
    name: "PreviousPaper",
    route: "/previouspaper",
  },
  {
    icon: <BiSolidVideos size={25} />,
    name: "LectureVideos",
    route: "/lecturevideos",
  },
  { icon: <SiTestcafe size={25} />, name: "MockTest", route: "/mocktest" },
  { icon: <GiTeacher size={25} />, name: "FacultyInfo", route: "/faculty" },
  {
    icon: <RiMapPinUserFill size={25} />,
    name: "LostFound",
    route: "/lostandfound",
  },
  { icon: <GrGroup size={25} />, name: "Forums", route: "/forum" },
];

const Sidepage = () => {
  const location = useLocation();
  // const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {items.map((item) => {
        const isActive = location.pathname === item.route; // Check if current path matches the item route
        const [isHovered, setIsHovered] = useState(false);

        return (
          <Tooltip
            key={item.name}
            hasArrow
            label={item.name}
            placement="right"
            ml={1}
            openDelay={500}
            display={{ base: "block", md: "none" }}>
            <Link
              display={"flex"}
              to={item.route}
              as={RouterLink}
              alignItems={"center"}
              gap={4}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              transition="background-color 0.1s"
              _hover={{ bg: "transparent", color: "yellow.200" }} // Gray on hover
              bg={
                isActive
                  ? "yellow.300"
                  : isHovered
                  ? "transparent"
                  : "transparent"
              } // Neon yellow when active, black when hovered
              color={isActive ? "black" : "inherit"} // Black text when active
              borderRadius={6}
              p={2}
              w={{ base: 10, md: "full" }}
              justifyContent={{ base: "center", md: "flex-start" }}>
              {item.icon}
              <Box display={{ base: "none", md: "block" }}>{item.name}</Box>
            </Link>
          </Tooltip>
        );
      })}
    </>
  );
};

export default Sidepage;
