// import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
// import { useState } from "react";
// import { firestore, storage } from "../firebase/firebase";
// import useAuthStore from "../store/authStore";
// import useShowToast from "./useShowToast";

// const useCreatePost = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const showToast = useShowToast();
//     const authUser = useAuthStore((state) => state.user);

//     const handleCreatePost = async (selectedFile, caption, fileType) => {
//         if (isLoading) return;
//         setIsLoading(true);

//         try {
//             // User authentication check
//             if (!authUser) {
//                 throw new Error("You must be logged in to create a post");
//             }
//             if (!authUser.isAdmin) {
//                 throw new Error("Only admins can create posts");
//             }

//             const newPost = {
//                 caption: caption,
//                 likes: [],
//                 comments: [],
//                 createdAt: Date.now(),
//                 createdBy: authUser.uid,
//                 fileType: fileType // Add fileType to post document
//             };

//             // Add new post to Firestore
//             const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

//             // File upload
//             if (selectedFile) {
//                 const fileRef = ref(storage, `posts/${postDocRef.id}`);
//                 let downloadURL;

//                 if (fileType === "image") {
//                     await uploadString(fileRef, selectedFile, "data_url");
//                 } else if (fileType === "pdf") {
//                     // For PDFs, we use uploadBytes directly since it's already a File object
//                     const uploadTask = await uploadBytes(fileRef, selectedFile);
//                     console.log("PDF uploaded successfully:", uploadTask);
//                 } else {
//                     throw new Error("Invalid file type");
//                 }

//                 downloadURL = await getDownloadURL(fileRef);

//                 // Update post with file URL
//                 await updateDoc(postDocRef, {
//                     fileURL: downloadURL
//                 });

//                 // Add post reference to admin user's posts array
//                 const userDocRef = doc(firestore, "users", authUser.uid);
//                 await updateDoc(userDocRef, {
//                     posts: arrayUnion(postDocRef.id)
//                 });
//             }

//             showToast("Success", "Post created successfully", "success");
//             return postDocRef.id; // Return post ID for reference
//         } catch (error) {
//             console.error("Error in handleCreatePost:", error);
//             showToast("Error", error.message, "error");
//             throw error;
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return { isLoading, handleCreatePost };
// };

// export default useCreatePost;



import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, uploadString } from "firebase/storage";
import { useState } from "react";
import { firestore, storage } from "../firebase/firebase";
import useAuthStore from "../store/authStore";
import useShowToast from "./useShowToast";

const useCreatePost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const showToast = useShowToast();
    const authUser = useAuthStore((state) => state.user);

    const handleCreatePost = async (selectedFile, caption, fileType) => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            // Enhanced authentication check
            if (!authUser?.uid) {
                throw new Error("You must be logged in to create a post");
            }

            // Verify admin status from Firestore
            const userDoc = await getDoc(doc(firestore, "users", authUser.uid));
            if (!userDoc.exists() || !userDoc.data().isAdmin) {
                throw new Error("Only admins can create posts");
            }

            // Create the post document first
            const newPost = {
                caption: caption,
                likes: [],
                comments: [],
                createdAt: Date.now(),
                createdBy: authUser.uid,
                fileType: fileType,
                status: 'pending' // Add initial status
            };

            // Add new post to Firestore
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

            // Handle file upload
            if (selectedFile) {
                try {
                    const fileRef = ref(storage, `posts/${postDocRef.id}`);
                    let downloadURL;

                    if (fileType === "image") {
                        await uploadString(fileRef, selectedFile, "data_url");
                    } else if (fileType === "pdf") {
                        await uploadBytes(fileRef, selectedFile);
                    } else {
                        throw new Error("Invalid file type");
                    }

                    downloadURL = await getDownloadURL(fileRef);

                    // Update post with file URL and status
                    await updateDoc(postDocRef, {
                        fileURL: downloadURL,
                        status: 'complete'
                    });

                    // Update user's posts array
                    await updateDoc(doc(firestore, "users", authUser.uid), {
                        posts: arrayUnion(postDocRef.id)
                    });

                    showToast("Success", "Post created successfully", "success");
                    return postDocRef.id;
                } catch (uploadError) {
                    console.error("Upload error:", uploadError);
                    // If upload fails, update post status or delete it
                    await updateDoc(postDocRef, { status: 'failed' });
                    throw new Error(`File upload failed: ${uploadError.message}`);
                }
            }
        } catch (error) {
            console.error("Error in handleCreatePost:", error);
            showToast("Error", error.message, "error");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleCreatePost };
};

export default useCreatePost;