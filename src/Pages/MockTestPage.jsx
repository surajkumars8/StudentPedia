import React, { useState } from 'react';
import FloatingNav from '../components/Navbar/Navbar';
import { navItems } from '../constants';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  Input,
  Textarea,
  Box,
  useToast,
  ScaleFade,
  Stack,
  SimpleGrid,
  HStack,
} from '@chakra-ui/react';

const MockTestPage = () => {
  const [mockTests, setMockTests] = useState([]);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    link: '',
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const toast = useToast();

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      padding: '20px',
    },
    mainContent: {
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: 1,
    },
    formContainer: {
      marginBottom: '20px',
      width: '100%',
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.link) {
      toast({
        title: 'Error',
        description: 'Subject and link are required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (editingIndex !== null) {
      const updatedMockTests = [...mockTests];
      updatedMockTests[editingIndex] = formData;
      setMockTests(updatedMockTests);
      setEditingIndex(null);
      toast({
        title: 'Mock Test Updated',
        description: 'The mock test has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setMockTests((prevList) => [formData, ...prevList]);
      toast({
        title: 'Mock Test Added',
        description: 'The mock test has been added successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }

    setFormData({
      subject: '',
      description: '',
      link: '',
    });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(mockTests[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedMockTests = mockTests.filter((_, i) => i !== index);
    setMockTests(updatedMockTests);
    toast({
      title: 'Mock Test Deleted',
      description: 'The mock test has been deleted successfully.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <div style={styles.container}>
      <FloatingNav navItems={navItems} />
      <div style={styles.mainContent}>
        <Heading as="h1" size="2xl" color="black" mb={6} fontWeight="bold">
          Mock Test
        </Heading>

        <Button
          colorScheme="teal"
          onClick={() => setShowForm(!showForm)}
          mb={4}
        >
          {showForm ? 'Hide Form' : 'Add Mock Test'}
        </Button>

        {showForm && (
          <Box style={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Input
                  placeholder="Subject Name"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  mb={4}
                  isRequired
                />
                <Textarea
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  mb={4}
                />
                <Input
                  placeholder="Link to Mock Test"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  mb={4}
                  isRequired
                />
                <Button type="submit" colorScheme="teal" width="full">
                  {editingIndex !== null ? 'Update Mock Test' : 'Add Mock Test'}
                </Button>
              </Stack>
            </form>
          </Box>
        )}

        {/* Displaying the cards in a grid with 4 columns */}
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={10} width="100%">
          {mockTests.map((test, index) => (
            <ScaleFade key={index} initialScale={0.9} in={true}>
              <Card
                maxW="sm"
                p={4}
                boxShadow="none"
                border="none"
                bg="white"
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
              >
                <CardHeader>
                  <Heading size='sm'>{test.subject}</Heading>
                </CardHeader>
                <CardBody>
                  {test.description && <Text>{test.description}</Text>}
                </CardBody>
                <CardFooter justifyContent="space-between" flexDirection="column">
                  <Button
                    as="a"
                    href={test.link}
                    target="_blank"
                    colorScheme="teal"
                    width="full"
                    mb={2} // Space between buttons
                  >
                    Access Mock Test
                  </Button>
                  <HStack spacing={2} width="full">
                    <Button onClick={() => handleEdit(index)} colorScheme="blue" size="sm">
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(index)} colorScheme="red" size="sm">
                      Delete
                    </Button>
                  </HStack>
                </CardFooter>
              </Card>
            </ScaleFade>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
};

export default MockTestPage;
