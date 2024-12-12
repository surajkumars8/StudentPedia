import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text, Input, Box, Flex, Spinner, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { db, storage } from '../firebase/firebase'; // Ensure storage is imported from firebase config
import { collection, addDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

const PreviousPapersPage = ({ isAdmin }) => {
  const [previousPapers, setPreviousPapers] = useState([]);
  const [newPaper, setNewPaper] = useState({ title: '', description: '', file: null });
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // For smooth transitions
  const [isUploading, setIsUploading] = useState(false); // Handle new paper uploads
  const [uploadComplete, setUploadComplete] = useState(false); // To manage upload completion state
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility
  const [selectedPaper, setSelectedPaper] = useState(null); // State to handle the clicked paper for preview

  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control

  useEffect(() => {
    console.log("Is Admin in PreviousPapersPage:", isAdmin);

    const unsubscribe = onSnapshot(collection(db, 'previouspapers'), (snapshot) => {
      const paperList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPreviousPapers(paperList);
      setIsLoading(false); // Mark loading as complete
    }, (error) => {
      console.error("Error fetching previous papers: ", error);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Upload the file to Firebase Storage
  const uploadFileToStorage = async (file) => {
    const uniqueFileName = `previouspapers/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, uniqueFileName);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL; // Return the download URL of the file
  };

  // Add a new previous paper
  const handleAddPaper = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (newPaper.title.trim() && newPaper.description.trim() && newPaper.file) {
      setIsUploading(true);  // Start uploading state

      try {
        // Upload the file to Firebase Storage and get its download URL
        const fileUrl = await uploadFileToStorage(newPaper.file);

        const paperData = {
          title: newPaper.title,
          description: newPaper.description,
          file: fileUrl // Save the file's download URL in Firestore
        };

        await addDoc(collection(db, 'previouspapers'), paperData); // Add the paper with file URL to Firestore
        setNewPaper({ title: '', description: '', file: null });  // Reset the form fields
        setUploadComplete(true); // Mark upload as complete
      } catch (error) {
        console.error("Error adding previous paper: ", error);
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
      setNewPaper({ title: '', description: '', file: null });
      setUploadComplete(false); // Reset the upload completion state
    }
  }, [uploadComplete]);

  // Delete a previous paper (with optimistic UI update)
  const handleDeletePaper = async (id) => {
    setPreviousPapers((prevPapers) => prevPapers.filter(paper => paper.id !== id));  // Optimistically update the UI

    try {
      await deleteDoc(doc(db, 'previouspapers', id));
    } catch (error) {
      console.error("Error deleting previous paper: ", error);
      // Optionally handle errors by refetching
    }
  };

  // Edit a previous paper
  const handleEditPaper = (index) => {
    setIsEditing(index);
    setNewPaper(previousPapers[index]);
  };

  // Save the edited previous paper
  const handleSaveEdit = async (index) => {
    const paperToUpdate = previousPapers[index];
    const updatedPaper = { ...paperToUpdate, ...newPaper };

    try {
      await setDoc(doc(db, 'previouspapers', paperToUpdate.id), updatedPaper);
      setPreviousPapers(previousPapers.map((paper, i) => (i === index ? updatedPaper : paper)));
      setIsEditing(null);
      setNewPaper({ title: '', description: '', file: null });
    } catch (error) {
      console.error("Error updating previous paper: ", error);
    }
  };

  // Open the modal for preview when a card is clicked
  const handleCardClick = (paper) => {
    setSelectedPaper(paper); // Set the clicked paper as selected
    onOpen(); // Open the modal
  };

  // Prevent empty cards by only rendering complete papers
  const isValidPaper = (paper) => paper.title && paper.description && paper.file;

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spinner size="xl" /></div>;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Heading as="h1" size="xl" mb={10} textAlign="left" color="#333">
        Previous Papers
      </Heading>

      {/* Paper Cards */}
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {previousPapers.filter(isValidPaper).map((paper, index) => (
          <Card
            key={paper.id}
            maxW="sm"
            p={4}
            bg="white"
            shadow="md"
            _hover={{ shadow: 'xl' }}
            position="relative"
            onClick={() => handleCardClick(paper)} // Make the card clickable
            cursor="pointer" // Change cursor to pointer for better UX
          >
            <CardHeader>
              {isAdmin && isEditing === index ? (
                <Input
                  value={newPaper.title}
                  onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                  placeholder="Edit title"
                  bg="white"
                  color="#333"
                  border="1px solid #ddd"
                />
              ) : (
                <Heading size="md" color="#333">{paper.title}</Heading>
              )}
            </CardHeader>

            <CardBody>
              {isAdmin && isEditing === index ? (
                <>
                  <Input
                    value={newPaper.description}
                    onChange={(e) => setNewPaper({ ...newPaper, description: e.target.value })}
                    placeholder="Edit description"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                    mb={2}
                  />
                  <Input
                    type="file"
                    onChange={(e) => setNewPaper({ ...newPaper, file: e.target.files[0] })}
                    placeholder="Edit file"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                  />
                </>
              ) : (
                <Text color="#555">{paper.description}</Text>
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
              ) : (
                <Text color="white" width="100px" height={"34px"} bg="#007bff"  _hover={{ bg: '#0056b3' }} textAlign={"center"} borderRadius={"8px"} padding={"3px"} fontSize={"17px"} fontWeight={"medium"}>Download</Text> // Visual cue for clickable card
              )}

              {/* Edit and Delete Buttons (Visible for Admins) */}
              {isAdmin && !isEditing && (
                <Flex
                  position="absolute"
                  top="5px"
                  right="5px"
                  gap="5px"
                >
                  <Button size="xs" colorScheme="blue" onClick={(e) => { e.stopPropagation(); handleEditPaper(index); }}>
                    Edit
                  </Button>
                  <Button size="xs" colorScheme="red" onClick={(e) => { e.stopPropagation(); handleDeletePaper(paper.id); }}>
                    Delete
                  </Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Plus Button to Toggle Add New Paper Form */}
      {isAdmin && (
        <IconButton
          aria-label="Add paper"
          icon={<AddIcon />}
          color="#B9E97D"
          bg="black"
          onClick={() => setIsFormVisible(!isFormVisible)}
          position="fixed"
          bottom="20px"
          right="20px"
          borderRadius="full"
          boxShadow="lg"
          size="lg"
        />
      )}

      {/* Add New Paper Section (Visible for Admins ) */}
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

          {/* Centered Add New Paper Form */}
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
              Add New Paper
            </Heading>
            <Button 
              onClick={() => setIsFormVisible(false)} 
              position="absolute" 
              top="10px" 
              right="10px" 
              size="sm" 
              colorScheme="red"
            >
              Close
            </Button>
            <form onSubmit={handleAddPaper}>
              <Input
                placeholder="Title"
                value={newPaper.title}
                onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Description"
                value={newPaper.description}
                onChange={(e) => setNewPaper({ ...newPaper, description: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                type="file"
                onChange={(e) => setNewPaper({ ...newPaper, file: e.target.files[0] })}
                placeholder="Select file"
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Button colorScheme="blue" type="submit" isLoading={isUploading} width="100%">
                {isUploading ? 'Uploading...' : 'Add Paper'}
              </Button>
            </form>
          </Box>
        </>
      )}

      {/* Modal for file preview */}
      {selectedPaper && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedPaper.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>{selectedPaper.description}</Text>
              {selectedPaper.file && (
                <iframe
                  src={selectedPaper.file}
                  title={selectedPaper.title}
                  style={{ width: '100%', height: '500px', border: 'none' }}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button as="a" href={selectedPaper.file} target="_blank" rel="noopener noreferrer">
                Download File
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default PreviousPapersPage;