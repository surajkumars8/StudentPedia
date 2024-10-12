import React, { useState } from 'react'; 
import FloatingNav from '../components/Navbar/Navbar';
import { navItems } from '../constants'; 
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text, Input, Box, Flex } from '@chakra-ui/react';

const LectureVideosPage = () => {
  const [videos, setVideos] = useState([
    { title: 'Video 1', desc: 'Description for video 1', link: 'https://example.com/video1' },
    { title: 'Video 2', desc: 'Description for video 2', link: 'https://example.com/video2' },
  ]); // Initial video data
  const [newVideo, setNewVideo] = useState({ title: '', desc: '', link: '' });
  const [isEditing, setIsEditing] = useState(null); // Track which card is being edited

  // Add new video
  const handleAddVideo = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Check if all fields are filled
    if (newVideo.title.trim() && newVideo.desc.trim() && newVideo.link.trim()) {
      setVideos([...videos, newVideo]); // Add the new video to the list
      setNewVideo({ title: '', desc: '', link: '' }); // Clear the input fields
    } else {
      alert('Please fill in all fields.'); // Simple validation alert
    }
  };

  // Delete video
  const handleDeleteVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
  };

  // Edit video
  const handleEditVideo = (index) => {
    setIsEditing(index);
    setNewVideo(videos[index]);
  };

  // Save edited video
  const handleSaveEdit = (index) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = newVideo;
    setVideos(updatedVideos);
    setIsEditing(null);
    setNewVideo({ title: '', desc: '', link: '' });
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <FloatingNav navItems={navItems} />

      <Heading as="h1" size="xl" mb={10} textAlign="center" color="#333">
        Lecture Videos
      </Heading>

      {/* Video Cards */}
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {videos.map((video, index) => (
          <Card
            key={index}
            maxW="sm"
            p={4}
            bg="white"
            shadow="md"
            _hover={{ shadow: 'xl' }}
            position="relative"
            _group={{ // Group hover effect for internal elements
              _hover: { 
                '.action-buttons': { opacity: 1 }, // Show buttons on hover
              }
            }}
          >
            <CardHeader>
              {isEditing === index ? (
                <Input
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Edit title"
                  bg="white"
                  color="#333" // Dark font color for input field
                  border="1px solid #ddd"
                />
              ) : (
                <Heading size="md" color="#333">{video.title}</Heading> // Dark font color for heading
              )}
            </CardHeader>

            <CardBody>
              {isEditing === index ? (
                <Input
                  value={newVideo.desc}
                  onChange={(e) => setNewVideo({ ...newVideo, desc: e.target.value })}
                  placeholder="Edit description"
                  bg="white"
                  color="#333" // Dark font color for input field
                  border="1px solid #ddd"
                />
              ) : (
                <Text color="#555">{video.desc}</Text> // Darker font color for description
              )}
            </CardBody>

            <CardFooter>
              {isEditing === index ? (
                <Button colorScheme="green" onClick={() => handleSaveEdit(index)}>
                  Save
                </Button>
              ) : (
                <Button as="a" href={video.link} target="_blank" rel="noopener noreferrer" bg="#007bff" color="white" _hover={{ bg: '#0056b3' }}>
                  Watch Video
                </Button>
              )}

              <Flex
                className="action-buttons"
                position="absolute"
                top="5px"
                right="5px"
                gap="5px"
                display="flex"
                opacity={0} // Initially hidden
                transition="opacity 0.2s ease-in-out"
              >
                <Button size="xs" colorScheme="blue" onClick={() => handleEditVideo(index)}>
                  Edit
                </Button>
                <Button size="xs" colorScheme="red" onClick={() => handleDeleteVideo(index)}>
                  Delete
                </Button>
              </Flex>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Add New Video Form */}
      <Box mt={10} bg="white" p={5} borderRadius="lg" shadow="md">
        <Heading as="h3" size="lg" mb={4} color="#333">
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
          <Button colorScheme="blue" type="submit">
            Add Video
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default LectureVideosPage;
