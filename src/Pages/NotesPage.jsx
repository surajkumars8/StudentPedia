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
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { db, storage } from '../firebase/firebase'; // Ensure storage is imported from firebase config
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage functions

const NotesPage = ({ isAdmin }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    console.log('Is Admin in NotesPage:', isAdmin);

    const unsubscribe = onSnapshot(
      collection(db, 'notes'),
      (snapshot) => {
        const noteList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotes(noteList);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching notes: ', error);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const uploadFileToStorage = async (file) => {
    const uniqueFileName = `notes/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, uniqueFileName);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (newNote.title.trim() && newNote.description.trim() && newNote.file) {
      setIsUploading(true);

      try {
        const fileUrl = await uploadFileToStorage(newNote.file);

        const noteData = {
          title: newNote.title,
          description: newNote.description,
          file: fileUrl,
        };

        await addDoc(collection(db, 'notes'), noteData);
        setNewNote({ title: '', description: '', file: null });
        setUploadComplete(true);
      } catch (error) {
        console.error('Error adding note: ', error);
      }

      setIsUploading(false);
      setIsFormVisible(false);
    } else {
      alert('Please fill in all fields.');
    }
  };

  useEffect(() => {
    if (uploadComplete) {
      setNewNote({ title: '', description: '', file: null });
      setUploadComplete(false);
    }
  }, [uploadComplete]);

  const handleDeleteNote = async (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      console.error('Error deleting note: ', error);
    }
  };

  const handleEditNote = (index) => {
    

    setIsEditing(index);
    setNewNote(notes[index]);
  };
  const handleSaveEdit = async (index, e) => {
    e.stopPropagation(); // Prevent card click event
    const noteToUpdate = notes[index];
    const updatedNote = { ...noteToUpdate, ...newNote };

    try {
      await setDoc(doc(db, 'notes', noteToUpdate.id), updatedNote);
      setNotes(notes.map((note, i) => (i === index ? updatedNote : note)));
      setIsEditing(null);
      setNewNote({ title: '', description: '', file: null });
    } catch (error) {
      console.error('Error updating note: ', error);
    }
  };

  const handleCardClick = (note) => {
    setSelectedNote(note);
    onOpen(); // Open the modal
  };

  const isValidNote = (note) => note.title && note.description && note.file;

  const resetForm = () => {
    setNewNote({ title: '', description: '', file: null });
    setIsFormVisible(false);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <Heading as="h1" size="xl" mb={10} textAlign="left" color="black">
        Notes
      </Heading>

      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {notes.filter(isValidNote).map((note, index) => (
          <Card
            key={note.id}
            maxW="sm"
            p={4}
            bg="white"
            shadow="md"
            _hover={{ shadow: 'xl' }}
            position="relative"
            onClick={() => handleCardClick(note)} // Handle card click
            cursor="pointer"
          >
            <CardHeader>
              {isAdmin && isEditing === index ? (
                <Input
                  value={newNote.title}
                  onChange={(e) => {
                    e.stopPropagation(); // Prevent click event from bubbling up
                    setNewNote({ ...newNote, title: e.target.value });
                  }}
                  placeholder="Edit title"
                  bg="white"
                  color="#333"
                  border="1px solid #ddd"
                />
              ) : (
                <Heading size="md" color="#333">{note.title}</Heading>
              )}
            </CardHeader>

            <CardBody>
              {isAdmin && isEditing === index ? (
                <>
                  <Input
                    value={newNote.description}
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent click event from bubbling up
                      setNewNote({ ...newNote, description: e.target.value });
                    }}
                    placeholder="Edit description"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                    mb={2}
                  />
                  <Input
                    type="file"
                    onChange={(e) => {
                      e.stopPropagation(); // Prevent click event from bubbling up
                      setNewNote({ ...newNote, file: e.target.files[0] });
                    }}
                    placeholder="Edit file"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"

                  />
                </>
              ) : (
                <Text color="#555">{note.description}</Text>
              )}
            </CardBody>

            <CardFooter>
              {isAdmin && isEditing === index ? (
                <Button colorScheme="green" onClick={(e) => handleSaveEdit(index, e)}>
                  Save
                </Button>
              ) : (
                <Text color="white" width="100px" height={"34px"} bg="#007bff"  _hover={{ bg: '#0056b3' }} textAlign={"center"} borderRadius={"8px"} padding={"3px"} fontSize={"17px"} fontWeight={"medium"}>Download</Text>
              )}

              {/* Edit and Delete Buttons (Visible for Admins) */}
              {isAdmin && !isEditing && (
                <Flex position="absolute" top="5px" right="5px" gap="5px">
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleEditNote(index);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click event
                      handleDeleteNote(note.id);
                    }}
                  >
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
          aria-label="Add note"
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
            onClick={resetForm} // Hide the form when clicking outside
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
              Add New Note
            </Heading>
            <form onSubmit={handleAddNote}>
              <Input
                placeholder="Title"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Description"
                value={newNote.description}
                onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                type="file"
                onChange={(e) => setNewNote({ ...newNote, file: e.target.files[0] })}
                placeholder="Select file"
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Flex justify="space-between" align="center">
                <Button colorScheme="blue" type="submit" isLoading={isUploading} width="70%">
                  {isUploading ? 'Uploading...' : 'Add Note'}
                </Button>
                <Button colorScheme="red" onClick={resetForm}>
                  Close
                </Button>
              </Flex>
            </form>
          </Box>
        </>
      )}

      {/* Modal for file preview */}
      {selectedNote && (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedNote.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>{selectedNote.description}</Text>
              {selectedNote.file && (
                <iframe
                  src={selectedNote.file}
                  title={selectedNote.title}
                  style={{ width: '100%', height: '500px', border: 'none' }}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button as="a" href={selectedNote.file} target="_blank" rel="noopener noreferrer">
                Download File
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default NotesPage;
