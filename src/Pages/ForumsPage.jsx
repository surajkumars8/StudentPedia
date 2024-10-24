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
  Image,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import useAuthStore from '../store/authStore';
import { firestore, storage } from '../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ForumPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.isAdmin;

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentForumId, setCurrentForumId] = useState(null);
  const [forumName, setForumName] = useState('');
  const [forumDescription, setForumDescription] = useState('');
  const [forumList, setForumList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsCollection = collection(firestore, 'forums');
        const forumSnapshot = await getDocs(forumsCollection);
        const forumList = forumSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setForumList(forumList);
      } catch (error) {
        console.error('Error fetching forums:', error);
        toast({
          title: 'Error fetching forums',
          description: 'Failed to load forums from Firestore. Check your permissions.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchForums();
  }, []);

  const checkAuth = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser;
  };

  const handleAddForum = async () => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can add forums.',
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
        description: 'You must be logged in to add forums.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: 'Image Required',
        description: 'Please upload an image before adding forum information.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const uniqueFileName = `forums/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, uniqueFileName);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);

      const newForum = {
        forumName,
        forumDescription,
        imageUrl: downloadURL,
      };

      const docRef = await addDoc(collection(firestore, 'forums'), newForum);
      setForumList([...forumList, { id: docRef.id, ...newForum }]);

      toast({
        title: 'Forum Added',
        description: 'Forum has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      console.error('Error adding forum:', error);
      toast({
        title: 'Error',
        description: 'Failed to add forum. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditForum = (forumId) => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can edit forums.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const forumToEdit = forumList.find((forum) => forum.id === forumId);
    if (forumToEdit) {
      setIsEditMode(true);
      setCurrentForumId(forumId);
      setForumName(forumToEdit.forumName);
      setForumDescription(forumToEdit.forumDescription);
      setIsOpen(true);
    }
  };

  const handleDeleteForum = async (forumId, e) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can delete forums.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'forums', forumId));
      const updatedForumList = forumList.filter((forum) => forum.id !== forumId);
      setForumList(updatedForumList);

      toast({
        title: 'Forum Deleted',
        description: 'Forum has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting forum:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete forum. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setForumName('');
    setForumDescription('');
    setImageFile(null);
    setCurrentForumId(null);
  };

  const handleCardClick = (imageUrl) => {
    setPreviewUrl(imageUrl);
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
      width: '100%',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        <Heading as="h1" size="xl" textAlign="center">
          Forums
        </Heading>

        <div style={styles.cardContainer}>
          {forumList.map((forum) => (
            <Card key={forum.id} style={styles.card} onClick={() => handleCardClick(forum.imageUrl)}>
              <CardHeader>
                <Heading size="md">{forum.forumName}</Heading>
                <Text>{forum.forumDescription}</Text>
              </CardHeader>
              <CardBody>
                <Image
                  src={forum.imageUrl}
                  alt={forum.forumName}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </CardBody>
              {isAdmin && (
                <CardFooter style={styles.actionButtons}>
                  <Button size="sm" colorScheme="blue" onClick={(e) => { e.stopPropagation(); handleEditForum(forum.id); }}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={(e) => handleDeleteForum(forum.id, e)}>
                    Delete
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div style={styles.addButton} onClick={() => setIsOpen(true)}>
          +
        </div>
      )}

      <Modal isOpen={isOpen} onClose={resetForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Edit Forum' : 'Add Forum'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Forum Name"
              value={forumName}
              onChange={(e) => setForumName(e.target.value)}
              mb={3}
            />
            <Input
              placeholder="Forum Description"
              value={forumDescription}
              onChange={(e) => setForumDescription(e.target.value)}
              mb={3}
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddForum} isLoading={loading}>
              {isEditMode ? 'Save Changes' : 'Add Forum'}
            </Button>
            <Button onClick={resetForm}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Image src={previewUrl} alt="Forum Image Preview" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ForumPage;
