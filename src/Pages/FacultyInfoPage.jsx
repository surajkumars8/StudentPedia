import React, { useState } from 'react';
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
import FloatingNav from '../components/Navbar/Navbar';
import { navItems } from '../constants';

const FacultyInfopage = () => {
  const [facultyData, setFacultyData] = useState({
    name: '',
    contactNumber: '',
    additionalInfo: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [facultyList, setFacultyList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!facultyData.name || !facultyData.contactNumber) {
      toast({
        title: 'Error',
        description: "Name and contact number are required.",
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newFacultyMember = {
      ...facultyData,
      imageFile,
      imagePreview,
    };

    // Add new faculty member to the top of the list
    setFacultyList((prevList) => [newFacultyMember, ...prevList]);
    toast({
      title: 'Faculty Information Submitted',
      description: "The faculty information has been submitted successfully.",
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    // Reset form after submission
    setFacultyData({
      name: '',
      contactNumber: '',
      additionalInfo: '',
    });
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false); // Hide form after submission
  };

  return (
    <div>
      <FloatingNav navItems={navItems} />
      <Box
        width="100%"
        height="100vh" // Set to 100vh for full screen height
        bg="black"
        borderRadius="10px"
        boxShadow="lg"
        p={5}
        mt={0}
        mx="auto"
        overflowY="auto" // Allow scrolling for content overflow
      >
        <Heading as="h2" textAlign="center" mb={4}>
          Faculty Information
        </Heading>
        <Button
          colorScheme="teal"
          onClick={() => setShowForm(!showForm)}
          mb={4}
        >
          {showForm ? 'Hide Form' : 'Add Faculty Information'}
        </Button>

        {showForm && (
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
              Submit
            </Button>
          </form>
        )}

        <SimpleGrid columns={1} spacing={4} mt={5}>
          {facultyList.map((faculty, index) => (
            <ScaleFade key={index} initialScale={0.9} in={true}>
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

export default FacultyInfopage;
