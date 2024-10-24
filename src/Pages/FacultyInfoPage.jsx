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

const FacultyPage = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user && user.isAdmin;

  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFacultyId, setCurrentFacultyId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [facultyList, setFacultyList] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const facultyCollection = collection(firestore, 'faculty');
        const facultySnapshot = await getDocs(facultyCollection);
        const facultyList = facultySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFacultyList(facultyList);
      } catch (error) {
        console.error('Error fetching faculty:', error);
        toast({
          title: 'Error fetching faculty',
          description: 'Failed to load faculty from Firestore. Check your permissions.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchFaculty();
  }, []);

  const checkAuth = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser;
  };

  const handleAddFaculty = async () => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can add faculty.',
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
        description: 'You must be logged in to add faculty.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: 'Image Required',
        description: 'Please upload an image before adding faculty information.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const uniqueFileName = `faculty/${Date.now()}_${imageFile.name}`;
      const storageRef = ref(storage, uniqueFileName);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);

      const newFaculty = {
        name: newName,
        position: newPosition,
        department: newDepartment,
        imageUrl: downloadURL,
      };

      const docRef = await addDoc(collection(firestore, 'faculty'), newFaculty);
      setFacultyList([...facultyList, { id: docRef.id, ...newFaculty }]);

      toast({
        title: 'Faculty Added',
        description: 'Faculty information has been successfully added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      resetForm();
    } catch (error) {
      console.error('Error adding faculty:', error);
      toast({
        title: 'Error',
        description: 'Failed to add faculty. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFaculty = (facultyId) => {
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can edit faculty.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const facultyToEdit = facultyList.find((faculty) => faculty.id === facultyId);
    if (facultyToEdit) {
      setIsEditMode(true);
      setCurrentFacultyId(facultyId);
      setNewName(facultyToEdit.name);
      setNewPosition(facultyToEdit.position);
      setNewDepartment(facultyToEdit.department);
      setIsOpen(true);
    }
  };

  const handleDeleteFaculty = async (facultyId, e) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!isAdmin) {
      toast({
        title: 'Unauthorized',
        description: 'Only admins can delete faculty.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await deleteDoc(doc(firestore, 'faculty', facultyId));
      const updatedFacultyList = facultyList.filter((faculty) => faculty.id !== facultyId);
      setFacultyList(updatedFacultyList);

      toast({
        title: 'Faculty Deleted',
        description: 'Faculty information has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete faculty. Please try again.',
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
    setNewName('');
    setNewPosition('');
    setNewDepartment('');
    setImageFile(null);
    setCurrentFacultyId(null);
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
          Faculty Information
        </Heading>

        <div style={styles.cardContainer}>
          {facultyList.map((faculty) => (
            <Card key={faculty.id} style={styles.card} onClick={() => handleCardClick(faculty.imageUrl)}>
              <CardHeader>
                <Heading size="md">{faculty.name}</Heading>
                <Text>{faculty.position}</Text>
                <Text>{faculty.department}</Text>
              </CardHeader>
              <CardBody>
                <Image
                  src={faculty.imageUrl}
                  alt={faculty.name}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </CardBody>
              {isAdmin && (
                <CardFooter style={styles.actionButtons}>
                  <Button size="sm" colorScheme="blue" onClick={(e) => { e.stopPropagation(); handleEditFaculty(faculty.id); }}>
                    Edit
                  </Button>
                  <Button size="sm" colorScheme="red" onClick={(e) => handleDeleteFaculty(faculty.id, e)}>
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
          <ModalHeader>{isEditMode ? 'Edit Faculty' : 'Add Faculty'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              mb={3}
            />
            <Input
              placeholder="Position"
              value={newPosition}
              onChange={(e) => setNewPosition(e.target.value)}
              mb={3}
            />
            <Input
              placeholder="Department"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              mb={3}
            />
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddFaculty} isLoading={loading}>
              {isEditMode ? 'Save Changes' : 'Add Faculty'}
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
            <Image src={previewUrl} alt="Faculty Image Preview" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default FacultyPage;
