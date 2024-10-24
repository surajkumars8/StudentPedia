import { ChatIcon } from "@chakra-ui/icons";
import { Box, Button, Input, VStack } from "@chakra-ui/react"; // Chakra UI for styling
import { useEffect, useRef, useState } from "react";

const Phixy = () => {
  const [messages, setMessages] = useState([
    { sender: "Phixy", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef(null); // For auto-scrolling to the latest message

  // Function to handle message submission
  const handleSendMessage = () => {
    if (input.trim()) {
      // Add the user's message to the chat
      setMessages([...messages, { sender: "User", text: input }]);

      // Simulate Phixy's response (You can replace this with an API call)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "Phixy", text: "I'm here to help you!" },
        ]);
      }, 1000);

      // Clear the input field
      setInput("");
    }
  };

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Box
        className="shadow-lg rounded-lg"
        bg="white"
        p={5}
        maxW="8xl"
        w="full"
        h="full"
        minH="600px"
        display="flex"
        flexDirection="column">
        <Box className="flex items-center justify-center mb-6">
          <ChatIcon boxSize={8} color="teal.500" />
          <h1 className="text-2xl font-bold ml-2">Phixy </h1>
        </Box>

        {/* Chat Window */}
        <VStack
          className="flex-grow bg-gray-200 rounded-md p-4 overflow-auto"
          spacing={4}
          align="start">
          {messages.map((message, index) => (
            <Box
              key={index}
              alignSelf={message.sender === "Phixy" ? "start" : "end"}
              bg={message.sender === "Phixy" ? "green.100" : "blue.100"}
              color="gray.800"
              p={3}
              borderRadius="md"
              maxW="80%">
              <strong>{message.sender}:</strong> {message.text}
            </Box>
          ))}
          {/* Dummy div for auto-scroll */}
          <div ref={messageEndRef} />
        </VStack>

        {/* Message Input */}
        <Box mt={4} display="flex" alignItems="center">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            colorScheme="teal"
            ml={3}
            onClick={handleSendMessage}
            isDisabled={!input.trim()}>
            Send
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Phixy;
