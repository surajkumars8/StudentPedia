import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useToast,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import useAuthStore from '../store/authStore';
import { firestore, storage } from '../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const NotesPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.isAdmin;

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [noteList, setNoteList] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesCollection = collection(firestore, 'notes');
        const notesSnapshot = await getDocs(notesCollection);
        const notesList = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNoteList(notesList);
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: 'Error fetching notes',
          description: 'Failed to load notes from Firestore. Check your permissions.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchNotes();
  }, []);

  const checkAuth = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser;
  };

  const handleAddNote = async () => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can add notes.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const currentUser = checkAuth();
    if (!currentUser) {
      toast({
        title: 'Unauthorized',
        description: 'You must be logged in to add notes.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!pdfFile) {
      toast({
        title: 'File Required',
        description: 'Please upload a PDF file before adding a note.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const uniqueFileName = `notes/${Date.now()}_${pdfFile.name}`;
      const storageRef = ref(storage, uniqueFileName);
      await uploadBytes(storageRef, pdfFile);
      const downloadURL = await getDownloadURL(storageRef);

      const newNote = {
        title: newTitle,
        regulation: newDescription,
        pdfUrl: downloadURL,
      };

      const docRef = await addDoc(collection(firestore, 'notes'), newNote);
      setNoteList([...noteList, { id: docRef.id, ...newNote }]);

      toast({
        title: 'Note Added',
        description: 'Your PDF note has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Error',
        description: 'Failed to add note. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = async (noteId) => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can edit notes.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsEditMode(true);
    const noteToEdit = noteList.find((note) => note.id === noteId);
    setCurrentNoteId(noteId);
    setNewTitle(noteToEdit.title);
    setNewDescription(noteToEdit.regulation);
    setIsOpen(true);
  };

  const handleUpdateNote = async () => {
    const updatedNote = {
      title: newTitle,
      regulation: newDescription,
      pdfUrl: noteList.find((note) => note.id === currentNoteId).pdfUrl,
    };

    try {
      await deleteDoc(doc(firestore, 'notes', currentNoteId));

      const docRef = await addDoc(collection(firestore, 'notes'), updatedNote);
      const updatedNotes = noteList.map(note =>
        note.id === currentNoteId ? { id: docRef.id, ...updatedNote } : note
      );
      setNoteList(updatedNotes);

      toast({
        title: 'Note Updated',
        description: 'Your note has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to update note. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can delete notes.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'notes', noteId));
      const updatedNotes = noteList.filter(note => note.id !== noteId);
      setNoteList(updatedNotes);

      toast({
        title: 'Note Deleted',
        description: 'Your note has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const resetForm = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setNewTitle('');
    setNewDescription('');
    setPdfFile(null);
    setCurrentNoteId(null);
  };

  const handleCardClick = (url) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      width: '100%', // Ensure the container takes the full width
    },
    mainContent: {
      width: '100%',
      maxWidth: '1200px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      marginTop: '20px',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '20px',
      width: '100%',
    },
    card: {
      position: 'relative',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      background: '#fff',
      padding: '16px',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
    },
    addButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#007bff',
      color: 'white',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    addButtonHover: {
      transform: 'scale(1.1)',
    },
    editButton: {
      backgroundColor: '#ffc107',
      color: 'black',
      padding: '10px 20px',
      borderRadius: '5px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'padding 0.2s',
      '&:hover': {
        backgroundColor: '#e0a800',
        padding: '12px 22px',
      },
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'padding 0.2s',
      '&:hover': {
        backgroundColor: '#c82333',
        padding: '12px 22px',
      },
    },
    downloadButton: {
      backgroundColor: '#28a745',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      textAlign: 'center',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#218838',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <Heading as="h1" size="lg" mb="4">Notes Page</Heading>
        {isAdmin && (
          <Button 
            style={styles.addButton} 
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => (styles.addButton.transform = styles.addButtonHover.transform)}
            onMouseLeave={() => (styles.addButton.transform = '')}
          >
            +
          </Button>
        )}
        <div style={styles.cardContainer}>
          {noteList.map((note) => (
            <Card 
              key={note.id} 
              style={styles.card}
              onClick={() => handleCardClick(note.pdfUrl)} // Clickable area for preview
            >
              <CardHeader>
                <Heading size="md" onClick={(e) => { e.stopPropagation(); handleCardClick(note.pdfUrl); }}>{note.title}</Heading>
              </CardHeader>
              <CardBody>
                <Text onClick={(e) => { e.stopPropagation(); handleCardClick(note.pdfUrl); }}>{note.regulation}</Text>
              </CardBody>
              <CardFooter style={styles.actionButtons}>
                {isAdmin && (
                  <>
                    <Button style={styles.editButton} onClick={(e) => { e.stopPropagation(); handleEditNote(note.id); }}>Edit</Button>
                    <Button style={styles.deleteButton} onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}>Delete</Button>
                  </>
                )}
                <Button style={styles.downloadButton} onClick={(e) => { e.stopPropagation(); handleDownload(note.pdfUrl, note.title); }}>Download</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add/Edit Note Modal */}
        <Modal isOpen={isOpen} onClose={resetForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditMode ? 'Edit Note' : 'Add Note'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                mb={4}
              />
              <Input
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                mb={4}
              />
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={resetForm}>Cancel</Button>
              <Button
                colorScheme="blue"
                onClick={isEditMode ? handleUpdateNote : handleAddNote}
                isLoading={loading}
                ml={3}
              >
                {isEditMode ? 'Update Note' : 'Add Note'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Preview Modal */}
        <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <iframe
                src={previewUrl}
                width="100%"
                height="500px"
                title="PDF Preview"
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default NotesPage;
