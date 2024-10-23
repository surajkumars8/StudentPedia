import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { auth, firestore } from '../firebase/firebase';
import useAuthStore from '../store/authStore';

const useAdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const setAuthUser = useAuthStore((state) => state.setUser);

    const login = async (inputs) => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, inputs.email, inputs.password);
            const user = userCredential.user;
            const userDoc = await getDoc(doc(firestore, 'users', user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setAuthUser({
                    ...user,
                    isAdmin: userData.isAdmin || false,
                });
            } else {
                throw new Error('User document does not exist');
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (inputs) => {
        setLoading(true);
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, inputs.email, inputs.password);
            const user = userCredential.user;

            // Set user data in Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                uid: user.uid,
                // username: user.username,
                // fullName: user.fullName,
                bio: "",
                profilePicURL: "",
                followers: [],
                following: [],
                posts: [],
                createdAt: Date.now(),
                email: user.email,
                isAdmin: false, // By default, new users are not admins
            });

            setAuthUser({
                ...user,
                isAdmin: false,
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, login, signup };
};

export default useAdminLogin;