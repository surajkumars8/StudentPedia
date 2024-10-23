import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Input,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {db} from "../firebase/firebase";

const MockTestPage = ({ isAdmin }) => {
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({ title: "", desc: "", link: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // For smooth transitions
  const [isUploading, setIsUploading] = useState(false); // Handle new test uploads
  const [uploadComplete, setUploadComplete] = useState(false); // To manage upload completion state
  const [isFormVisible, setIsFormVisible] = useState(false); // Toggle form visibility

  useEffect(() => {
    console.log("Is Admin in LectureTestsPage:", isAdmin);

    const unsubscribe = onSnapshot(
      collection(db, "tests"), // Changed from "videos" to "tests"
      (snapshot) => {
        const testList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTests(testList);
        setIsLoading(false); // Mark loading as complete
      },
      (error) => {
        console.error("Error fetching tests: ", error);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Add a new test
  const handleAddTest = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (newTest.title.trim() && newTest.desc.trim() && newTest.link.trim()) {
      setIsUploading(true); // Start uploading state

      try {
        await addDoc(collection(db, "tests"), newTest); // Changed from "videos" to "tests"
        setNewTest({ title: "", desc: "", link: "" }); // Reset the form fields
        setUploadComplete(true); // Mark upload as complete
      } catch (error) {
        console.error("Error adding test: ", error);
      }

      setIsUploading(false); // End uploading state
      setIsFormVisible(false); // Hide the form after adding
    } else {
      alert("Please fill in all fields.");
    }
  };

  // Ensure form is reset after upload
  useEffect(() => {
    if (uploadComplete) {
      setNewTest({ title: "", desc: "", link: "" });
      setUploadComplete(false); // Reset the upload completion state
    }
  }, [uploadComplete]);

  // Delete a test (with optimistic UI update)
  const handleDeleteTest = async (id) => {
    setTests((prevTests) => prevTests.filter((test) => test.id !== id)); // Optimistically update the UI

    try {
      await deleteDoc(doc(db, "tests", id)); // Changed from "videos" to "tests"
    } catch (error) {
      console.error("Error deleting test: ", error);
      // Optionally handle errors by refetching
    }
  };

  // Edit a test
  const handleEditTest = (index) => {
    setIsEditing(index);
    setNewTest(tests[index]);
  };

  // Save the edited test
  const handleSaveEdit = async (index) => {
    const testToUpdate = tests[index];
    const updatedTest = { ...testToUpdate, ...newTest };

    try {
      await setDoc(doc(db, "tests", testToUpdate.id), updatedTest); // Changed from "videos" to "tests"
      setTests(tests.map((test, i) => (i === index ? updatedTest : test)));
      setIsEditing(null);
      setNewTest({ title: "", desc: "", link: "" });
    } catch (error) {
      console.error("Error updating test: ", error);
    }
  };

  // Prevent empty cards by only rendering complete tests
  const isValidTest = (test) => test.title && test.desc && test.link;

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f7f7f7",
        minHeight: "100vh",
      }}>
      <Heading as="h1" size="xl" mb={10} textAlign="center" color="#333">
        Lecture Tests
      </Heading>

      {/* Test Cards */}
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {tests.filter(isValidTest).map((test, index) => (
          <Card
            key={test.id}
            maxW="sm"
            p={4}
            bg="white"
            shadow="md"
            _hover={{ shadow: "xl" }}
            position="relative">
            <CardHeader>
              {isAdmin && isEditing === index ? (
                <Input
                  value={newTest.title}
                  onChange={(e) =>
                    setNewTest({ ...newTest, title: e.target.value })
                  }
                  placeholder="Edit title"
                  bg="white"
                  color="#333"
                  border="1px solid #ddd"
                />
              ) : (
                <Heading size="md" color="#333">
                  {test.title}
                </Heading>
              )}
            </CardHeader>

            <CardBody>
              {isAdmin && isEditing === index ? (
                <>
                  <Input
                    value={newTest.desc}
                    onChange={(e) =>
                      setNewTest({ ...newTest, desc: e.target.value })
                    }
                    placeholder="Edit description"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                    mb={2}
                  />
                  <Input
                    value={newTest.link}
                    onChange={(e) =>
                      setNewTest({ ...newTest, link: e.target.value })
                    }
                    placeholder="Edit test link"
                    bg="white"
                    color="#333"
                    border="1px solid #ddd"
                  />
                </>
              ) : (
                <Text color="#555">{test.desc}</Text>
              )}
            </CardBody>

            <CardFooter>
              {isAdmin && isEditing === index ? (
                <Button
                  colorScheme="green"
                  onClick={() => handleSaveEdit(index)}>
                  Save
                </Button>
              ) : (
                <Button
                  as="a"
                  href={test.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  bg="#007bff"
                  color="white"
                  _hover={{ bg: "#0056b3" }}>
                  Take Test
                </Button>
              )}

              {/* Edit and Delete Buttons (Visible for Admins) */}
              {isAdmin && !isEditing && (
                <Flex position="absolute" top="5px" right="5px" gap="5px">
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={() => handleEditTest(index)}>
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDeleteTest(test.id)}>
                    Delete
                  </Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Plus Button to Toggle Add New Test Form */}
      {isAdmin && (
        <IconButton
          aria-label="Add test"
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

      {/* Add New Test Section (Visible for Admins) */}
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

          {/* Centered Add New Test Form */}
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
            width="400px">
            <Heading as="h3" size="lg" mb={4} color="#333" textAlign="center">
              Add New Test
            </Heading>
            <form onSubmit={handleAddTest}>
              <Input
                placeholder="Title"
                value={newTest.title}
                onChange={(e) =>
                  setNewTest({ ...newTest, title: e.target.value })
                }
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Description"
                value={newTest.desc}
                onChange={(e) =>
                  setNewTest({ ...newTest, desc: e.target.value })
                }
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Input
                placeholder="Link"
                value={newTest.link}
                onChange={(e) =>
                  setNewTest({ ...newTest, link: e.target.value })
                }
                mb={2}
                bg="white"
                color="#333"
                border="1px solid #ddd"
              />
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isUploading}
                width="100%">
                {isUploading ? "Uploading..." : "Add Test"}
              </Button>
            </form>
          </Box>
        </>
      )}
    </div>
  );
};

export default MockTestPage;