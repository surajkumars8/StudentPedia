import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Ensure the path is correct
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  Image,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  ScaleFade,
} from '@chakra-ui/react';

const FacultyInfoPage = () => {
  const [facultyData, setFacultyData] = useState({
    id: '',
    name: '',
    contactNumber: '',
    additionalInfo: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchFaculty = async () => {
      const facultyCollection = collection(db, 'faculty');
      const facultySnapshot = await getDocs(facultyCollection);
      const facultyDataList = facultySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFacultyList(facultyDataList);
    };

    const checkAdminRole = async () => {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setIsAdmin(userData.role === 'admin'); // Set admin status
          }
        }
      });
    };

    fetchFaculty();
    checkAdminRole();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAdmin) {
      toast({
        title: 'Error',
        description: 'You do not have permission to perform this action.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!facultyData.name || !facultyData.contactNumber) {
      toast({
        title: 'Error',
        description: 'Name and contact number are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (editing) {
        await updateDoc(doc(db, 'faculty', facultyData.id), {
          name: facultyData.name,
          contactNumber: facultyData.contactNumber,
          additionalInfo: facultyData.additionalInfo,
          timestamp: serverTimestamp(),
        });

        toast({
          title: 'Faculty Information Updated',
          description: 'The faculty information has been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await addDoc(collection(db, 'faculty'), {
          name: facultyData.name,
          contactNumber: facultyData.contactNumber,
          additionalInfo: facultyData.additionalInfo,
          timestamp: serverTimestamp(),
        });

        toast({
          title: 'Faculty Information Submitted',
          description: 'The faculty information has been submitted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      setFacultyData({
        id: '',
        name: '',
        contactNumber: '',
        additionalInfo: '',
      });
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      setEditing(false);

      // Refresh faculty list
      const facultyCollection = collection(db, 'faculty');
      const facultySnapshot = await getDocs(facultyCollection);
      const facultyDataList = facultySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFacultyList(facultyDataList);
    } catch (error) {
      console.error('Error adding/updating document: ', error);
      toast({
        title: 'Error',
        description: 'There was an error submitting the faculty information.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast({
        title: 'Error',
        description: 'You do not have permission to perform this action.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await deleteDoc(doc(db, 'faculty', id));
      setFacultyList((prevList) => prevList.filter((faculty) => faculty.id !== id));
      toast({
        title: 'Faculty Information Deleted',
        description: 'The faculty information has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast({
        title: 'Error',
        description: 'There was an error deleting the faculty information.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (faculty) => {
    setFacultyData({
      id: faculty.id,
      name: faculty.name,
      contactNumber: faculty.contactNumber,
      additionalInfo: faculty.additionalInfo,
    });
    setImagePreview(faculty.imagePreview);
    setShowForm(true);
    setEditing(true);
  };

  return (
    <div>
      <Box
        width="100%"
        height="100vh"
        bg="black"
        borderRadius="10px"
        boxShadow="lg"
        p={5}
        mt={0}
        mx="auto"
        overflowY="auto"
      >
        <Heading as="h2" textAlign="center" mb={4}>
          Faculty Information
        </Heading>

        {isAdmin && (
          <Button
            colorScheme="teal"
            onClick={() => setShowForm(!showForm)}
            mb={4}
          >
            {showForm ? 'Hide Form' : 'Add Faculty Information'}
          </Button>
        )}

        {isAdmin && showForm && (
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                name="name"
                value={facultyData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Contact Number</FormLabel>
              <Input
                type="text"
                name="contactNumber"
                value={facultyData.contactNumber}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Additional Information</FormLabel>
              <Textarea
                name="additionalInfo"
                value={facultyData.additionalInfo}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Upload Photo</FormLabel>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {imagePreview && (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  boxSize="150px"
                  objectFit="cover"
                  mt={2}
                  borderRadius="5px"
                />
              )}
            </FormControl>
            <Button type="submit" colorScheme="teal" width="full">
              {editing ? 'Update Faculty' : 'Submit'}
            </Button>
          </form>
        )}

        <SimpleGrid columns={1} spacing={4} mt={5}>
          {facultyList.map((faculty) => (
            <ScaleFade key={faculty.id} initialScale={0.9} in={true}>
              <Card variant="outline" mb={4} boxShadow="md" borderRadius="md">
                <CardBody>
                  <Flex align="center">
                    {faculty.imagePreview && (
                      <Image
                        src={faculty.imagePreview}
                        alt={faculty.name}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="full"
                        mr={4}
                      />
                    )}
                    <Box>
                      <Text fontWeight="bold" fontSize="lg">{faculty.name}</Text>
                      <Text fontSize="sm">{faculty.contactNumber}</Text>
                      {faculty.additionalInfo && (
                        <Text fontSize="sm" mt={1}>{faculty.additionalInfo}</Text>
                      )}
                    </Box>
                    {isAdmin && (
                      <Flex ml="auto">
                        <Button
                          colorScheme="blue"
                          onClick={() => handleEdit(faculty)}
                          mr={2}
                        >
                          Edit
                        </Button>
                        <Button
                          colorScheme="red"
                          onClick={() => handleDelete(faculty.id)}
                        >
                          Delete
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </CardBody>
              </Card>
            </ScaleFade>
          ))}
        </SimpleGrid>
      </Box>
    </div>
  );
};

export default FacultyInfoPage;
