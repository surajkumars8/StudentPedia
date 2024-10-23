import { Avatar, Box, Tooltip, VStack, Text, HStack, Button } from "@chakra-ui/react";
import { Route, Link as RouterLink } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useState, useEffect } from "react";
import UserProfile from "../Profile/UserProfile";

const ProfileLink = () => {
  const authUser = useAuthStore((state) => state.user);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    if (authUser && authUser.uid) {
      // Fetch user details from Firestore or your backend
      // This is a placeholder, you'll need to implement the actual fetching logic
      const fetchUserDetails = async () => {
        // Implement your fetching logic here
        // For example:
        // const response = await fetch(`/api/user/${authUser.uid}`);
        // const data = await response.json();
        // setUserDetails(data);
      };
      fetchUserDetails();
    }
  }, [authUser]);

  const handleViewProfile = () => {
    // Navigate to the user's profile page
    // You'll need to implement the routing logic
    <Route path="/Myprofile" element={<UserProfile />} />
  };

  return (
    <Tooltip
      hasArrow
      label={"Profile"}
      placement="right"
      ml={1}
      openDelay={500}
      display={{ base: "block", md: "none" }}
    >
      <Box
        as={RouterLink}
        to={`/${authUser?.username}`}
        display={"flex"}
        alignItems={"center"}
        gap={4}
        _hover={{ bg: "whiteAlpha.400" }}
        borderRadius={6}
        p={2}
        w={{ base: 10, md: "full" }}
        justifyContent={{ base: "center", md: "flex-start" }}
      >
        <Avatar size={"sm"} src={authUser?.profilePicURL || ""} />
        <Box display={{ base: "none", md: "block" }}>Profile</Box>
      </Box>
    </Tooltip>
  );
};

export default ProfileLink;