import {
  Box,
  Button,
  CloseButton,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";
// import { CreatePostLogo } from "../../assets/constants";
import { firestore, storage } from "../../firebase/firebase";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
// import useUserProfileStore from "../../store/userProfileStore";

const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [caption, setCaption] = useState("");
  const [postType, setPostType] = useState(""); // To store selected post type
  const imageRef = useRef(null);
  const pdfRef = useRef(null);
  const { handleImageChange, selectedFile, setSelectedFile } = usePreviewImg();
  const showToast = useShowToast();

  // Retrieve the authenticated user once when the component mounts
  const authUser = useAuthStore((state) => state.user);
  const { isLoading, handleCreatePost } = useCreatePost();

  const handlePostCreation = async () => {
    try {
      if (postType === "notes" && pdfRef.current.files.length > 0) {
        const file = pdfRef.current.files[0];
        const pdfRefStorage = ref(storage, `pdfs/${file.name}`); // Adjust the path as needed
        await uploadBytes(pdfRefStorage, file);
        const downloadURL = await getDownloadURL(pdfRefStorage);

        // Add PDF post creation logic
        const newPost = {
          caption: caption,
          type: postType,
          imageURL: null,
          pdfURL: downloadURL,
          createdAt: Date.now(),
          createdBy: authUser.uid, // Ensure authUser is defined here
        };
        await handleCreatePost(newPost);
      } else {
        await handleCreatePost({
          caption: caption,
          type: postType,
          imageURL: selectedFile,
          pdfURL: null,
          createdAt: Date.now(),
          createdBy: authUser.uid, // Ensure authUser is defined here
        });
      }

      onClose();
      setCaption("");
      setSelectedFile(null);
      setPostType("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <>
      <Tooltip
        hasArrow
        label={"Create"}
        placement="right"
        ml={1}
        openDelay={500}
        display={{ base: "block", md: "none" }}>
        <Flex
          alignItems={"center"}
          gap={4}
          _hover={{ bg: "whiteAlpha.400" }}
          borderRadius={6}
          p={2}
          w={{ base: 10, md: "full" }}
          justifyContent={{ base: "center", md: "flex-start" }}
          onClick={onOpen}>
          {/* <CreatePostLogo /> */}
          <Box display={{ base: "none", md: "block" }}>Create</Box>
        </Flex>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent bg={"black"} border={"1px solid gray"}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Select
              placeholder="Select post type"
              onChange={(e) => setPostType(e.target.value)}>
              <option value="notes">Notes (PDF)</option>
              <option value="mock-test">Mock Test</option>
              <option value="lecture-videos">Lecture Videos</option>
            </Select>

            {postType === "notes" && (
              <Input type="file" ref={pdfRef} accept=".pdf" marginTop={4} />
            )}

            {postType !== "notes" && (
              <>
                <Textarea
                  placeholder="Post caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />

                <Input
                  type="file"
                  hidden
                  ref={imageRef}
                  onChange={handleImageChange}
                />
                <BsFillImageFill
                  onClick={() => imageRef.current.click()}
                  style={{
                    marginTop: "15px",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                  size={16}
                />
                {selectedFile && (
                  <Flex
                    mt={5}
                    w={"full"}
                    position={"relative"}
                    justifyContent={"center"}>
                    <Image src={selectedFile} alt="Selected img" />
                    <CloseButton
                      position={"absolute"}
                      top={2}
                      right={2}
                      onClick={() => {
                        setSelectedFile(null);
                      }}
                    />
                  </Flex>
                )}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;

function useCreatePost() {
  const showToast = useShowToast();
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useAuthStore((state) => state.user); // Ensure this is defined
  const createPost = usePostStore((state) => state.createPost);
  const addPost = useUserProfileStore((state) => state.addPost);
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const { pathname } = useLocation();

  const handleCreatePost = async (newPost) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      const userDocRef = doc(firestore, "users", authUser.uid);

      await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });

      if (userProfile.uid === authUser.uid)
        createPost({ ...newPost, id: postDocRef.id });

      if (pathname !== "/" && userProfile.uid === authUser.uid)
        addPost({ ...newPost, id: postDocRef.id });

      showToast("Success", "Post created successfully", "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCreatePost };
}