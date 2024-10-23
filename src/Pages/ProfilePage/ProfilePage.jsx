// import { doc, getDoc } from 'firebase/firestore';
// import { useEffect, useState } from 'react';
// import { db } from '../../firebase/firebase'; // Your Firestore config
// import { useParams } from 'react-router-dom';

// const ProfilePage = () => {
//   const { username } = useParams();
//   const { isLoading, userProfile } = useGetUserProfileByUsername(username);
//   const [userActivities, setUserActivities] = useState([]);
//   const user = useAuthStore((state) => state.user);

//   useEffect(() => {
//     const fetchUserActivities = async () => {
//       if (userProfile) {
//         const userActivityRef = doc(db, 'userActivities', userProfile.id); // Replace userProfile.id with correct user ID reference
//         const activityDoc = await getDoc(userActivityRef);

//         if (activityDoc.exists()) {
//           setUserActivities(activityDoc.data().activities || []); // Fetch and set activities
//         }
//       }
//     };

//     fetchUserActivities();
//   }, [userProfile]);

//   const userNotFound = !isLoading && !userProfile;
//   if (userNotFound) return <UserNotFound />;

//   return (
//     <Container maxW="container.lg" py={5}>
//       <Flex
//         py={10}
//         px={4}
//         pl={{ base: 4, md: 10 }}
//         w={"full"}
//         mx={"auto"}
//         flexDirection={"column"}>
//         {!isLoading && userProfile && <ProfileHeader />}
//         {isLoading && <ProfileHeaderSkeleton />}
//       </Flex>
//       <Flex
//         px={{ base: 2, sm: 4 }}
//         maxW={"full"}
//         mx={"auto"}
//         borderTop={"1px solid"}
//         borderColor={"whiteAlpha.300"}
//         direction={"column"}>
//         <ProfileTabs />
//         <ProfilePosts />
//       </Flex>

//       {/* Display the user's activity log */}
//       <VStack align="start" spacing={4} mt={8}>
//         <Text fontSize="xl" fontWeight="bold">Activity Log</Text>
//         {userActivities.length > 0 ? (
//           userActivities.map((activity, index) => (
//             <Text key={index}>{`${activity.action} on ${activity.page} at ${activity.timestamp}`}</Text>
//           ))
//         ) : (
//           <Text>No recent activities</Text>
//         )}
//       </VStack>
//     </Container>
//   );
// };
// export default ProfilePage;