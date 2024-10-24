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

const PreviousPaperPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.isAdmin;

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPaperId, setCurrentPaperId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newRegulation, setNewRegulation] = useState('');
  const [paperList, setPaperList] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const papersCollection = collection(firestore, 'previouspapers');
        const papersSnapshot = await getDocs(papersCollection);
        const papersList = papersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPaperList(papersList);
      } catch (error) {
        console.error('Error fetching previous papers:', error);
        toast({
          title: 'Error fetching previous papers',
          description: 'Failed to load previous papers from Firestore. Check your permissions.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchPapers();
  }, []);

  const checkAuth = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser;
  };

  const handleAddPaper = async () => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can add previous papers.',
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
        description: 'You must be logged in to add previous papers.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!pdfFile) {
      toast({
        title: 'File Required',
        description: 'Please upload a PDF file before adding a previous paper.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const uniqueFileName = `previouspapers/${Date.now()}_${pdfFile.name}`;
      const storageRef = ref(storage, uniqueFileName);
      await uploadBytes(storageRef, pdfFile);
      const downloadURL = await getDownloadURL(storageRef);

      const newPaper = {
        title: newTitle,
         year: newYear,
        regulation: newRegulation,
        pdfUrl: downloadURL,
      };

      const docRef = await addDoc(collection(firestore, 'previouspapers'), newPaper);
      setPaperList([...paperList, { id: docRef.id, ...newPaper }]);

      toast({
        title: 'Previous Paper Added',
        description: 'Your PDF previous paper has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      console.error('Error adding previous paper:', error);
      toast({
        title: 'Error',
        description: 'Failed to add previous paper. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPaper = async (paperId) => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can edit previous papers.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsEditMode(true);
    const paperToEdit = paperList.find((paper) => paper.id === paperId);
    setCurrentPaperId(paperId);
    setNewTitle(paperToEdit.title);
    setNewYear(paperToEdit.year);
    setNewRegulation(paperToEdit.regulation);
    setIsOpen(true);
  };

  const handleUpdatePaper = async () => {
    const updatedPaper = {
      title: newTitle,
      year: newYear,
      regulation: newRegulation,
      pdfUrl: paperList.find((paper) => paper.id === currentPaperId).pdfUrl,
    };

    try {
      await deleteDoc(doc(firestore, 'previouspapers', currentPaperId));

      const docRef = await addDoc(collection(firestore, 'previouspapers'), updatedPaper);
      const updatedPapers = paperList.map((paper) =>
        paper.id === currentPaperId ? { id: docRef.id, ...updatedPaper } : paper
      );
      setPaperList(updatedPapers);

      toast({
        title: 'Previous Paper Updated',
        description: 'Your previous paper has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      console.error('Error updating previous paper:', error);
      toast({
        title: 'Error',
        description: 'Failed to update previous paper. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePaper = async (paperId) => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can delete previous papers.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'previouspapers', paperId));
      const updatedPapers = paperList.filter((paper) => paper.id !== paperId);
      setPaperList(updatedPapers);

      toast({
        title: 'Previous Paper Deleted',
        description: 'Your previous paper has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting previous paper:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete previous paper. Please try again.',
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
    setNewYear('');
    setNewRegulation('');
    setPdfFile(null);
    setCurrentPaperId(null);
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
      width: '56px',
      height: '56px',
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
        <Heading as="h1" size="lg" mb="4">Previous Papers</Heading>
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
          {paperList.map((paper) => (
            <Card 
              key={paper.id} 
              style={styles.card}
              onClick={() => handleCardClick(paper.pdfUrl)} // Clickable area for preview
            >
              <CardHeader>
                <Heading size="md" onClick={(e) => { e.stopPropagation(); handleCardClick(paper.pdfUrl); }}>{paper.title}</Heading>
              </CardHeader>
              <CardBody>
                <Text onClick={(e) => { e.stopPropagation(); handleCardClick(paper.pdfUrl); }}>{paper.year}</Text>
                <Text onClick={(e) => { e.stopPropagation(); handleCardClick(paper.pdfUrl); }}>{paper.regulation}</Text>
              </CardBody>
              <CardFooter style={styles.actionButtons}>
                {isAdmin && (
                  <>
                    <Button style={styles.editButton} onClick={(e) => { e.stopPropagation(); handleEditPaper(paper.id); }}>Edit</Button>
                    <Button style={styles.deleteButton} onClick={(e) => { e.stopPropagation(); handleDeletePaper(paper.id); }}>Delete</Button>
                  </>
                )}
                <Button style={styles.downloadButton} onClick={(e) => { e.stopPropagation(); handleDownload(paper.pdfUrl, paper.title); }}>Download</Button >
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add/Edit Paper Modal */}
        <Modal isOpen={isOpen} onClose={resetForm}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditMode ? 'Edit Paper' : 'Add Paper'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                mb={4}
              />
              <Input
                placeholder="Year"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
                mb={4}
              />
              <Input
                placeholder="Regulation"
                value={newRegulation}
                onChange={(e) => setNewRegulation(e.target.value)}
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
                onClick={isEditMode ? handleUpdatePaper : handleAddPaper}
                isLoading={loading}
                ml={3}
              >
                {isEditMode ? 'Update Paper' : 'Add Paper'}
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

export default PreviousPaperPage;