import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text, Input, Box, Flex, Spinner, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { db, storage } from '../firebase/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const FacultyPage = ({ isAdmin }) => {
  const [faculty, setFaculty] = useState([]);
  const [newFaculty, setNewFaculty] = useState({ name: '', description: '', photo: null });
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'faculty'), (snapshot) => {
      const facultyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFaculty(facultyList);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching faculty: ", error);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const uploadFileToStorage = async (file) => {
    const uniqueFileName = `faculty/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, uniqueFileName);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleAddFaculty = async (e) => {
    e.preventDefault();

    if (newFaculty.name.trim() && newFaculty.description.trim() && newFaculty.photo) {
      setIsUploading(true);

      try {
        const photoUrl = await uploadFileToStorage(newFaculty.photo);

        const facultyData = {
          name: newFaculty.name,
          description: newFaculty.description,
          photo: photoUrl,
        };

        await addDoc(collection(db, 'faculty'), facultyData);
        setNewFaculty({ name: '', description: '', photo: null });
        setUploadComplete(true);
      } catch (error) {
        console.error("Error adding faculty: ", error);
      }

      setIsUploading(false);
      setIsFormVisible(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  useEffect(() => {
    if (uploadComplete) {
      setNewFaculty({ name: '', description: '', photo: null });
      setUploadComplete(false);
    }
  }, [uploadComplete]);

  const handleDeleteFaculty = async (id) => {
    setFaculty((prevFaculty) => prevFaculty.filter(fac => fac.id !== id));

    try {
      await deleteDoc(doc(db, 'faculty', id));
    } catch (error) {
      console.error("Error deleting faculty: ", error);
    }
  };

  const handleEditFaculty = (index) => {
    setIsEditing(index);
    setNewFaculty(faculty[index]);
  };

  const handleSaveEdit = async (index) => {
    const facultyToUpdate = faculty[index];
    const updatedFaculty = { ...facultyToUpdate, ...newFaculty };

    try {
      await setDoc(doc(db, 'faculty', facultyToUpdate.id), updatedFaculty);
      setFaculty(faculty.map((fac, i) => (i === index ? updatedFaculty : fac)));
      setIsEditing(null);
      setNewFaculty({ name: '', description: '', photo: null });
    } catch (error) {
      console.error("Error updating faculty: ", error);
    }
  };

  const handleCardClick = (fac) => {
    setSelectedFaculty(fac);
    onOpen();
  };

  const isValidFaculty = (fac) => fac.name && fac.description && fac.photo;

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spinner size="xl" /></div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Heading as="h1" size="xl" mb={10} textAlign="left" color="#333">
        Faculty
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {faculty.filter(isValidFaculty).map((fac, index) => (
          <Card
            key={fac.id}
            maxW="sm"
            p={4}
            bg="white"
            shadow="md"
            _hover={{ shadow: 'xl' }}
            position="relative"
            onClick={() => handleCardClick(fac)}
            cursor="pointer"
          >
            <CardHeader>
              {isAdmin && isEditing === index ? (
                <Input
                  value={newFaculty.name}
                  onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                  placeholder="Edit faculty name"
                  bg="white"
                  color="#333"
                  border="1px solid #ddd"
                />
              ) : (
                <Heading size="md" color="#333">{fac.name}</Heading>
              )}
            </CardHeader>

            <CardBody>
              {isAdmin && isEditing === index ? (
                <>
                  <Input
                    value={newFaculty.description}
                    onChange={(e) => setNewFaculty({ ...newFaculty, description: e.target.value })}
                    placeholder="Edit description"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                    mb={2}
                  />
                  <Input
                    type="file"
                    onChange={(e) => setNewFaculty({ ...newFaculty, photo: e.target.files[0] })}
                    placeholder="Edit photo"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                  />
                </>
              ) : (
                <>
                  <img src={fac.photo} alt={fac.name} style={{ width: '100%', borderRadius: '8px' }} />
                  <Text color="#555" mt={2}>{fac.description}</Text>
                </>
              )}
            </CardBody>

            <CardFooter>
              {isAdmin && isEditing === index ? (
                <Button 
                colorScheme="green" 
                onClick={(e) => { 
                  e.stopPropagation();  // Prevents modal from opening
                  handleSaveEdit(index); 
                }}
              >
                Save
              </Button>
              ) : null}

              {isAdmin && !isEditing && (
                <Flex position="absolute" top="5px" right="5px" gap="5px">
                  <Button size="xs" colorScheme="blue" onClick={(e) => { e.stopPropagation(); handleEditFaculty(index); }}>
                    Edit
                  </Button>
                  <Button size="xs" colorScheme="red" onClick={(e) => { e.stopPropagation(); handleDeleteFaculty(fac.id); }}>
                    Delete
                  </Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {isAdmin && (
        <IconButton
          aria-label="Add faculty"
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
            onClick={() => setIsFormVisible(false)}
          />

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
              Add New Faculty
            </Heading>
            <form onSubmit={handleAddFaculty}>
              <Input
                placeholder="Faculty Name"
                value={newFaculty.name}
                onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Description"
                value={newFaculty.description}
                onChange={(e) => setNewFaculty({ ...newFaculty, description: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                type="file"
                onChange={(e) => setNewFaculty({ ...newFaculty, photo: e.target.files[0] })}
                placeholder="Select photo"
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Button colorScheme="blue" type="submit" isLoading={isUploading} width="100%">
                {isUploading ? 'Uploading...' : 'Add Faculty'}
              </Button>
            </form>
          </Box>
        </>
      )}

      {selectedFaculty && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedFaculty.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>{selectedFaculty.description}</Text>
              <img src={selectedFaculty.photo} alt={selectedFaculty.name} style={{ width: '100%', borderRadius: '8px' }} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              {/* <Button as="a" href={selectedFaculty.photo} target="_blank" rel="noopener noreferrer">
                Download Photo
              </Button> */}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default FacultyPage;
