import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Input, 
  Button, 
  Text, 
  VStack, 
  HStack, 
  Avatar, 
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ChatIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Send } from 'lucide-react'; // Import Send icon from Lucide React
import axios from "axios";

// Typing animation
const typingAnimation = keyframes`
  0%, 100% { opacity: 0.5 }
  50% { opacity: 1 }
`;

const Phixy = () => {
  const [messages, setMessages] = useState([
    { sender: "Phixy", text: "Hello! I'm Phixy, your intelligent AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const messageEndRef = useRef(null);

  // Enhanced color theming
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const chatBgColor = useColorModeValue("white", "gray.800");
  const messageBgColor = useColorModeValue("gray.100", "gray.700");
  const accentColor = useColorModeValue("teal.500", "teal.300");

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage = { sender: "User", text: input };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const apiConfig = {
          method: "POST",
          url: "https://chat-gpt26.p.rapidapi.com/",
          headers: {
            "x-rapidapi-key": "21d7a66cc2msh5ee8228d309a1dbp106066jsne89e0888b76f",
            "x-rapidapi-host": "chat-gpt26.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          data: {
            model: "gpt-3.5-turbo",
            messages: [
              ...messages.map((msg) => ({
                role: msg.sender === "Phixy" ? "assistant" : "user",
                content: msg.text,
              })),
              { role: "user", content: input },
            ],
          },
        };

        const response = await axios.request(apiConfig);
        const aiResponse = response.data.choices[0]?.message?.content || "I'm not sure how to respond to that.";

        setMessages(prev => [
          ...prev,
          { sender: "Phixy", text: aiResponse }
        ]);
      } catch (error) {
        console.error("Error communicating with AI:", error);
        setMessages(prev => [
          ...prev,
          { 
            sender: "Phixy", 
            text: "I'm experiencing some technical difficulties. Please try again later." 
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Flex 
      height="100vh" 
      bg={bgColor} 
      alignItems="center" 
      justifyContent="center"
      p={4}
    >
      <Box
        width="100%" 
        maxWidth="1000px" 
        height="95vh"
        bg={chatBgColor}
        borderRadius="2xl"
        boxShadow="2xl"
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        {/* Header with Theme Toggle */}
        <Flex 
          alignItems="center" 
          justifyContent="space-between"
          bg={accentColor}
          color="white"
          p={4}
        >
          <HStack spacing={3}>
            <ChatIcon boxSize={6} />
            <Text fontWeight="bold" fontSize="xl">Phixy AI</Text>
          </HStack>
          <Button 
            onClick={toggleColorMode} 
            variant="ghost" 
            color="white"
            _hover={{ bg: "whiteAlpha.200" }}
          >
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </Flex>

        {/* Chat Messages Area */}
        <VStack 
          flex={1} 
          p={4} 
          spacing={4} 
          overflowY="auto" 
          bg={messageBgColor}
        >
          {messages.map((message, index) => (
            <HStack
              key={index}
              alignSelf={message.sender === "Phixy" ? "flex-start" : "flex-end"}
              maxW="90%"
              w="full"
              spacing={3}
            >
              {message.sender === "Phixy" && (
                <Avatar 
                  name="Phixy" 
                  bg={accentColor}
                  color="white" 
                  size="sm" 
                />
              )}
              <Box
                bg={message.sender === "Phixy" ? "green.100" : "blue.100"}
                color="gray.800"
                p={3}
                borderRadius="lg"
                maxW="80%"
                boxShadow="sm"
              >
                <Text fontWeight="bold" fontSize="xs" mb={1} color="gray.600">
                  {message.sender}
                </Text>
                <Text>{message.text}</Text>
              </Box>
              {message.sender === "User" && (
                <Avatar 
                  name="User" 
                  bg="blue.500" 
                  color="white" 
                  size="sm" 
                />
              )}
            </HStack>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <HStack alignSelf="flex-start" maxW="90%">
              <Avatar 
                name="Phixy" 
                bg={accentColor}
                color="white" 
                size="sm" 
              />
              <Flex 
                bg="green.100" 
                p={3} 
                borderRadius="lg"
                alignItems="center"
              >
                <Text 
                  color="gray.600" 
                  fontStyle="italic"
                  animation={`${typingAnimation} 1.4s infinite`}
                >
                  Phixy is typing...
                </Text>
              </Flex>
            </HStack>
          )}
          
          <div ref={messageEndRef} />
        </VStack>

        {/* Message Input Area */}
        <Flex 
          p={4} 
          bg={chatBgColor}
          borderTop="1px"
          borderColor={useColorModeValue("gray.200", "gray.600")}
        >
          <Input
            flex={1}
            mr={3}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            bg={messageBgColor}
            borderColor={useColorModeValue("gray.300", "gray.600")}
            _focus={{
              borderColor: accentColor,
              boxShadow: `0 0 0 1px ${accentColor}`
            }}
          />
          <Button
            colorScheme="teal"
            onClick={handleSendMessage}
            isDisabled={!input.trim() || isLoading}
            leftIcon={<Send size={20} />} // Using Send icon from Lucide React
          >
            Send
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Phixy;
