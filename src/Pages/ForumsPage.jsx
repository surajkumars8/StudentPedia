import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
  Input,
  Box,
  Flex,
  Spinner,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ForumPage = ({ isAdmin }) => {
  const [forums, setForums] = useState([]);
  const [newForum, setNewForum] = useState({ title: '', content: '', image: null });
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'forums'), (snapshot) => {
      const forumList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setForums(forumList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching forums: ", error);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const uploadImageToStorage = async (file) => {
    const uniqueFileName = `forums/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, uniqueFileName);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleAddForum = async (e) => {
    e.preventDefault();
    if (newForum.title.trim() && newForum.content.trim()) {
      setIsUploading(true);
      try {
        let imageUrl = '';
        if (newForum.image) {
          imageUrl = await uploadImageToStorage(newForum.image);
        }
        const forumData = {
          title: newForum.title,
          content: newForum.content,
          image: imageUrl,
        };
        await addDoc(collection(db, 'forums'), forumData);
        resetForm();
      } catch (error) {
        console.error("Error adding forum: ", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const resetForm = () => {
    setNewForum({ title: '', content: '', image: null });
    setIsFormVisible(false);
  };

  const handleDeleteForum = async (id) => {
    setForums((prevForums) => prevForums.filter(forum => forum.id !== id));
    try {
      await deleteDoc(doc(db, 'forums', id));
    } catch (error) {
      console.error("Error deleting forum: ", error);
    }
  };

  const handleEditForum = (index) => {
    setIsEditing(index);
    setNewForum({ ...forums[index], image: null }); // Keep existing image when editing
  };

  const handleSaveEdit = async (index) => {
    const forumToUpdate = forums[index];
    const updatedForum = { ...forumToUpdate, ...newForum };

    if (newForum.image) {
      const imageUrl = await uploadImageToStorage(newForum.image);
      updatedForum.image = imageUrl; // Update with new image URL if new image exists
    } else {
      updatedForum.image = forumToUpdate.image; // Keep the old image URL
    }

    try {
      await setDoc(doc(db, 'forums', forumToUpdate.id), updatedForum);
      setForums(forums.map((forum, i) => (i === index ? updatedForum : forum)));
      setIsEditing(null);
      resetForm();
    } catch (error) {
      console.error("Error updating forum: ", error);
    }
  };

  const handleCardClick = (forum) => {
    setSelectedForum(forum);
    onOpen();
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spinner size="xl" /></div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Heading as="h1" size="xl" mb={10} textAlign="Left" color="#333">Forums</Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {forums.map((forum, index) => (
          <Card
            key={forum.id}
            maxW="sm"
            p={4}
            bg="white"
            shadow="md"
            _hover={{ shadow: 'xl' }}
            position="relative"
            onClick={() => handleCardClick(forum)}
            cursor="pointer"
          >
            <CardHeader>
              {isAdmin && isEditing === index ? (
                <Input
                  value={newForum.title}
                  onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
                  placeholder="Edit forum title"
                  bg="white"
                  color="#333"
                  border="1px solid #ddd"
                />
              ) : (
                <Heading size="md" color="#333">{forum.title}</Heading>
              )}
            </CardHeader>
            <CardBody>
              {isAdmin && isEditing === index ? (
                <>
                  <Input
                    value={newForum.content}
                    onChange={(e) => setNewForum({ ...newForum, content: e.target.value })}
                    placeholder="Edit content"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                    mb={2}
                  />
                  <Input
                    type="file"
                    onChange={(e) => setNewForum({ ...newForum, image: e.target.files[0] })}
                    placeholder="Edit image"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                  />
                  {forum.image && <img src={forum.image} alt={forum.title} style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} />}
                </>
              ) : (
                <>
                  <Text color="#555" mt={2}>{forum.content}</Text>
                  {forum.image && <img src={forum.image} alt={forum.title} style={{ width: '100%', borderRadius: '8px' }} />}
                </>
              )}
            </CardBody>
            <CardFooter>
              {isAdmin && isEditing === index ? (
                <Button colorScheme="green" onClick={() => handleSaveEdit(index)}>Save</Button>
              ) : null}
              {isAdmin && !isEditing && (
                <Flex position="absolute" top="5px" right="5px" gap="5px">
                  <Button size="xs" colorScheme="blue" onClick={(e) => { e.stopPropagation(); handleEditForum(index); }}>Edit</Button>
                  <Button size="xs" colorScheme="red" onClick={(e) => { e.stopPropagation(); handleDeleteForum(forum.id); }}>Delete</Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      {isAdmin && (
        <>
          <IconButton
            aria-label="Add forum"
            icon={<AddIcon />}
            colorScheme="blue"
            onClick={() => setIsFormVisible(true)}
            position="fixed"
            bottom="20px"
            right="20px"
            borderRadius="full"
            boxShadow="lg"
            size="lg"
          />
          {isFormVisible && (
            <IconButton
              aria-label="Close form"
              icon={<CloseIcon />}
              colorScheme="red"
              onClick={() => resetForm()}
              position="fixed"
              bottom="80px" // Adjusted to ensure visibility above the add button
              right="20px"
              borderRadius="full"
              boxShadow="lg"
              size="lg"
              zIndex="1000" // Ensure it appears above other elements
            />
          )}
        </>
      )}
      {isAdmin && isFormVisible && (
        <>
          <Box
            position="fixed"
            top="0"
            left="0"
            width="100vw"
            height="100vh"
            bg="rgba(0, 0, 0, 0.5)"
            zIndex="999"
          />
          <Box
            position="fixed"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            p={4}
            bg="white"
            borderRadius="8px"
            boxShadow="lg"
            zIndex="1001"
            maxW="400px"
            width="90%"
          >
            <Heading as="h3" size="lg" mb={4} color="#333" textAlign="center">Add New Forum</Heading>
            <form onSubmit={handleAddForum}>
              <Input
                placeholder="Forum Title"
                value={newForum.title}
                onChange={(e) => setNewForum({ ...newForum, title: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Content"
                value={newForum.content}
                onChange={(e) => setNewForum({ ...newForum, content: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                type="file"
                onChange={(e) => setNewForum({ ...newForum, image: e.target.files[0] })}
                placeholder="Select image"
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Button colorScheme="blue" type="submit" isLoading={isUploading} width="100%">
                {isUploading ? 'Uploading...' : 'Add Forum'}
              </Button>
              <Button 
                colorScheme="red" 
                onClick={resetForm} 
                width="100%" 
                mt={2} 
                type="button" // Ensure this button doesn't submit the form
              >
                Close
              </Button>
            </form>
          </Box>
        </>
      )}
      {selectedForum && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedForum.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>{selectedForum.content}</Text>
              {selectedForum.image && <img src={selectedForum.image} alt={selectedForum.title} style={{ width: '100%', borderRadius: '8px' }} />}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default ForumPage;

