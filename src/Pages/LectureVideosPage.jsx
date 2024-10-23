import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text, Input, Box, Flex, Spinner, IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { db } from '../firebase/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';

const LectureVideosPage = ({ isAdmin }) => {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', desc: '', link: '' });
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // For smooth transitions
  const [isUploading, setIsUploading] = useState(false); // Handle new video uploads
  const [uploadComplete, setUploadComplete] = useState(false); // To manage upload completion state
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    console.log("Is Admin in LectureVideosPage:", isAdmin);
    
    const unsubscribe = onSnapshot(collection(db, 'videos'), (snapshot) => {
      const videoList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videoList);
      setIsLoading(false); // Mark loading as complete
    }, (error) => {
      console.error("Error fetching videos: ", error);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Add a new video
  const handleAddVideo = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (newVideo.title.trim() && newVideo.desc.trim() && newVideo.link.trim()) {
      setIsUploading(true);  // Start uploading state

      try {
        await addDoc(collection(db, 'videos'), newVideo);
        setNewVideo({ title: '', desc: '', link: '' });  // Reset the form fields
        setUploadComplete(true); // Mark upload as complete
      } catch (error) {
        console.error("Error adding video: ", error);
      }

      setIsUploading(false); // End uploading state
      setIsFormVisible(false); // Hide the form after adding
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Ensure form is reset after upload
  useEffect(() => {
    if (uploadComplete) {
      setNewVideo({ title: '', desc: '', link: '' });
      setUploadComplete(false); // Reset the upload completion state
    }
  }, [uploadComplete]);

  // Delete a video (with optimistic UI update)
  const handleDeleteVideo = async (id) => {
    setVideos((prevVideos) => prevVideos.filter(video => video.id !== id));  // Optimistically update the UI

    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (error) {
      console.error("Error deleting video: ", error);
      // Optionally handle errors by refetching
    }
  };

  // Edit a video
  const handleEditVideo = (index) => {
    setIsEditing(index);
    setNewVideo(videos[index]);
  };

  // Save the edited video
  const handleSaveEdit = async (index) => {
    const videoToUpdate = videos[index];
    const updatedVideo = { ...videoToUpdate, ...newVideo };

    try {
      await setDoc(doc(db, 'videos', videoToUpdate.id), updatedVideo);
      setVideos(videos.map((video, i) => (i === index ? updatedVideo : video)));
      setIsEditing(null);
      setNewVideo({ title: '', desc: '', link: '' });
    } catch (error) {
      console.error("Error updating video: ", error);
    }
  };

  // Prevent empty cards by only rendering complete videos
  const isValidVideo = (video) => video.title && video.desc && video.link;

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spinner size="xl" /></div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Heading as="h1" size="xl" mb={10} textAlign="center" color="#333">
        Lecture Videos
      </Heading>

      {/* Video Cards */}
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {videos.filter(isValidVideo).map((video, index) => (
          <Card 
            key={video.id} 
            maxW="sm" 
            p={4} 
            bg="white" 
            shadow="md" 
            _hover={{ shadow: 'xl' }} 
            position="relative"
          >
            <CardHeader>
              {isAdmin && isEditing === index ? (
                <Input
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Edit title"
                  bg="white"
                  color="#333"
                  border="1px solid #ddd"
                />
              ) : (
                <Heading size="md" color="#333">{video.title}</Heading>
              )}
            </CardHeader>

            <CardBody>
              {isAdmin && isEditing === index ? (
                <>
                  <Input
                    value={newVideo.desc}
                    onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })}
                    placeholder="Edit description"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                    mb={2}
                  />
                  <Input
                    value={newVideo.link}
                    onChange={(e) => setNewVideo({ ...newVideo, link: e.target.value })}
                    placeholder="Edit video link"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                  />
                </>
              ) : (
                <Text color="#555">{video.desc}</Text>
              )}
            </CardBody>

            <CardFooter>
              {isAdmin && isEditing === index ? (
                <Button colorScheme="green" onClick={() => handleSaveEdit(index)}>
                  Save
                </Button>
              ) : (
                <Button as="a" href={video.link} target="_blank" rel="noopener noreferrer" bg="#007bff" color="white" _hover={{ bg: '#0056b3' }}>
                  Watch Video
                </Button>
              )}

              {/* Edit and Delete Buttons (Visible for Admins) */}
              {isAdmin && !isEditing && (
                <Flex
                  position="absolute"
                  top="5px"
                  right="5px"
                  gap="5px"
                >
                  <Button size="xs" colorScheme="blue" onClick={() => handleEditVideo(index)}>
                    Edit
                  </Button>
                  <Button size="xs" colorScheme="red" onClick={() => handleDeleteVideo(video.id)}>
                    Delete
                  </Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Plus Button to Toggle Add New Video Form */}
      {isAdmin && (
        <IconButton
          aria-label="Add video"
          icon={<AddIcon />}
          colorScheme="blue"
          onClick={() => setIsFormVisible(!isFormVisible)}
          position="fixed"
          bottom="20px"
          right="20px"
          borderRadius="full"
          boxShadow="lg"
          size="lg"
        />
      )}

      {/* Add New Video Section (Visible for Admins) */}
      {isAdmin && isFormVisible && (
        <>
          {/* Background overlay */}
          <Box 
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="rgba(0, 0, 0, 0.5)"
            zIndex="999"
            onClick={() => setIsFormVisible(false)} // Hide the form when clicking outside
          />
          
          {/* Centered Add New Video Form */}
          <Box 
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="white"
            p={8}
            borderRadius="lg"
            shadow="xl"
            zIndex="1000"
            width="400px"
          >
            <Heading as="h3" size="lg" mb={4} color="#333" textAlign="center">
              Add New Video
            </Heading>
            <form onSubmit={handleAddVideo}>
              <Input
                placeholder="Title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Description"
                value={newVideo.desc}
                onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Link"
                value={newVideo.link}
                onChange={(e) => setNewVideo({ ...newVideo, link: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Button colorScheme="blue" type="submit" isLoading={isUploading} width="100%">
                {isUploading ? 'Uploading...' : 'Add Video'}
              </Button>
            </form>
          </Box>
        </>
      )}
    </div>
  );
};

export default LectureVideosPage;
