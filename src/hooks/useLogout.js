import { useSignOut } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { auth } from '../firebase/firebase';
import useAuthStore from '../store/authStore';
import useShowToast from './useShowToast';
import useLogin from './useLogin';

const useLogout = () => {
    const [signOut, isLoggingOut, error] = useSignOut(auth);
    const ShowToast = useShowToast();
    const logoutUser = useAuthStore((state) => state.logout);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleLogout = async () => {
        try {
            await signOut();
            localStorage.removeItem('user-info');
            logoutUser();
            navigate('/auth'); // Redirect to login page after logout
        } catch (error) {
            ShowToast('Error', error.message, 'error');
        }
    };

    return { handleLogout, isLoggingOut, error };
};

export default useLogout;
