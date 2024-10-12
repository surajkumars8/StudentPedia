import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Image,
  VStack,
  Text,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlinePaperClip, AiOutlineCamera } from "react-icons/ai";

const LostFoundPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: null });
  const toast = useToast();

  // Default username
  const username = "User";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newMessage.trim() && !imageFile && !capturedImage) {
      toast({
        title: "Empty Post",
        description: "Please enter a message or attach an image.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newMessageData = {
      content: newMessage,
      imageUrl: imageFile
        ? URL.createObjectURL(imageFile)
        : capturedImage
        ? capturedImage
        : null,
      userName: username, // Use the hardcoded username
    };

    setMessages((prevMessages) => [...prevMessages, newMessageData]);
    setNewMessage("");
    setImageFile(null);
    setImagePreview(null);
    setCapturedImage(null);
    setIsFormVisible(false);

    toast({
      title: "Message Posted",
      description: "Your message has been posted successfully.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEdit = (index) => {
    const editedMessage = prompt("Enter your edited message:", messages[index].content);
    if (editedMessage !== null && editedMessage.trim() !== "") {
      const updatedMessages = [...messages];
      updatedMessages[index].content = editedMessage;
      setMessages(updatedMessages);

      toast({
        title: "Message Edited",
        description: "Your message has been edited successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = (index) => {
    const updatedMessages = messages.filter((_, i) => i !== index);
    setMessages(updatedMessages);

    toast({
      title: "Message Deleted",
      description: "The message has been deleted.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
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

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        onOpen();
      })
      .catch((err) => {
        console.error("Error accessing camera: ", err);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access to take a photo.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  <video ref={videoRef} width="100%" height="auto" />

  const capturePhoto = () => {
    const context = canvasRef.current.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    const imageDataUrl = canvasRef.current.toDataURL("image/png");
    setCapturedImage(imageDataUrl);
    onClose();
  };

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleImageClick = (imageUrl) => {
    setImageModal({ isOpen: true, imageUrl });
  };

  const closeImageModal = () => {
    setImageModal({ isOpen: false, imageUrl: null });
  };

  return (
    <Flex direction="column" justifyContent="space-between" height="100vh" bg="gray.100">
      <Box bg="teal.500" p={5} textAlign="center">
        <Text fontSize="3xl" fontWeight="bold" color="white">
          Lost & Found Messages
        </Text>
      </Box>

      {/* Messages */}
      <Box flex="1" overflowY="auto" p={5}>
        <VStack spacing={4} align="stretch">
          {messages.length === 0 && (
            <Text textAlign="center" color="gray.500">
              No messages found.
            </Text>
          )}
          {messages.map((message, index) => (
            <Box key={index} p={4} bg="teal.50" borderRadius="md" boxShadow="md" wordBreak="break-word">
              <Text fontSize="md" fontWeight="bold" mb={2}>
                {message.userName} 📢
              </Text>
              {message.imageUrl && (
                <Image
                  src={message.imageUrl}
                  alt="Uploaded"
                  mb={3}
                  boxSize="150px"
                  cursor="pointer"
                  onClick={() => handleImageClick(message.imageUrl)}
                />
              )}
              <Text fontSize="lg">{message.content}</Text>
              <Flex justifyContent="flex-end" mt={2}>
                <IconButton
                  icon={<FaEdit />}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => handleEdit(index)}
                  mr={2}
                />
                <IconButton
                  icon={<FaTrash />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(index)}
                />
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Show/Hide Form Button */}
      <Box p={5} bg="teal.500">
        {!isFormVisible && (
          <Button colorScheme="whiteAlpha" onClick={toggleFormVisibility} width="100%">
            Add New Message
          </Button>
        )}

        {/* New message form */}
        {isFormVisible && (
          <form onSubmit={handleSubmit}>
            <FormControl>
              <Input
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                mb={3}
                bg="white"
              />
              {imagePreview && <Image src={imagePreview} alt="Preview" boxSize="150px" mb={3} />}
              {capturedImage && <Image src={capturedImage} alt="Captured" boxSize="150px" mb={3} />}
              <Flex justifyContent="space-between">
                <label htmlFor="file-upload">
                  <IconButton
                    icon={<AiOutlinePaperClip />}
                    size="lg"
                    aria-label="Attach File"
                    cursor="pointer"
                    as="span"
                  />
                </label>
                <Input
                  type="file"
                  accept="image/*"
                  id="file-upload"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <IconButton
                  icon={<AiOutlineCamera />}
                  size="lg"
                  aria-label="Open Camera"
                  onClick={startCamera}
                />
                <Button colorScheme="teal" type="submit" ml={3}>
                  Post
                </Button>
              </Flex>
            </FormControl>
          </form>
        )}
      </Box>

      {/* Camera Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Capture Photo</ModalHeader>
          <ModalBody>
            <video ref={videoRef} width="100%" height="auto" />
            <canvas ref={canvasRef} style={{ display: "none" }} width="640" height="480"></canvas>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={capturePhoto}>
              Capture
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Image Zoom Modal */}
      <Modal isOpen={imageModal.isOpen} onClose={closeImageModal}>
        <ModalOverlay />
        <ModalContent maxW="90%">
          <ModalHeader>Image Preview</ModalHeader>
          <ModalBody>
            <Image src={imageModal.imageUrl} alt="Full-Size Image" width="100%" height="auto" />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={closeImageModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default LostFoundPage;
