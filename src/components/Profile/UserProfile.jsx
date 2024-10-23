import React, { useState, useEffect } from 'react';
import { VStack, Text, HStack, Button, Box, Avatar } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import useUserProfileStore from "../../store/userProfileStore";

const UserProfile = () => {
  const { username } = useParams();
  const authUser = useAuthStore((state) => state.user);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`/api/user/${username}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (username) {
      fetchUserDetails();
    }
  }, [username]);

  const handleViewNotes = () => {
    navigate(`/user/${username}/notes`);
  };

  const handleViewPreviousPapers = () => {
    navigate(`/user/${username}/previous-papers`);
  };

  const handleViewMockTests = () => {
    navigate(`/user/${username}/mock-tests`);
  };

  const handleViewLectureVideos = () => {
    navigate(`/user/${username}/lecture-videos`);
  };

  const handleViewFacultyInfo = () => {
    navigate(`/user/${username}/faculty-info`);
  };

  return (
    <VStack align="stretch" spacing={4} p={4}>
      <Text fontSize="2xl" fontWeight="bold">
        {userDetails.name || "User Profile"}
      </Text>
      <HStack spacing={4}>
        <Avatar size="xl" src={userDetails.profilePicURL || ""} />
        <VStack align="flex-start">
          <Text fontSize="lg" fontWeight="bold">
            {userDetails.username || username || "Username"}
          </Text>
          <Text>{userDetails.email || "Email"}</Text>
        </VStack>
      </HStack>
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          User Activities
        </Text>
        <Button onClick={handleViewNotes} mb={2}>
          View Notes ({userDetails.notesCount || 0})
        </Button>
        <Button onClick={handleViewPreviousPapers} mb={2}>
          View Previous Papers ({userDetails.previousPapersCount || 0})
        </Button>
        <Button onClick={handleViewMockTests} mb={2}>
          View Mock Tests ({userDetails.mockTestsCount || 0})
        </Button>
        <Button onClick={handleViewLectureVideos} mb={2}>
          View Lecture Videos ({userDetails.lectureVideosCount || 0})
        </Button>
        <Button onClick={handleViewFacultyInfo}>
          View Faculty Info ({userDetails.facultyInfoCount || 0})
        </Button>
      </Box>
    </VStack>
  );
};

export default UserProfile;
