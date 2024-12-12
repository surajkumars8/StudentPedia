import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./components/AuthForm/Signup.jsx";
import Phixy from "./components/ChatBot/Phixy.jsx";
import Complaint from "./components/Complaint/Complaint.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import CreatePost from "./components/Sidebar/CreatePost";
import { auth, firestore } from "./firebase/firebase";
import PageLayout from "./Layouts/PageLayout/PageLayout";
import AdminPage from "./Pages/AdminPage/AdminPage";
import AuthPage from "./Pages/AuthPage/Authpage.jsx";
import FacultyInfoPage from "./Pages/FacultyInfoPage";
import ForumsPage from "./Pages/ForumsPage";
import HomePage from "./Pages/HomePage/Homepage";
import LectureVideosPage from "./Pages/LectureVideosPage.jsx";
import LostFoundPage from "./Pages/LostFoundPage";
import MockTestPage from "./Pages/MockTestPage";
import NotesPage from "./Pages/NotesPage";
import PreviousPaperPage from "./Pages/PreviousPaperPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";

function App() {
  const [authUser] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authUser) {
        const userRef = doc(firestore, "users", authUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("User data:", userData); // Log user data
          const adminStatus = userData.isAdmin === true;
          console.log(
            "Admin status for user:",
            authUser.uid,
            "is",
            adminStatus
          );
          setIsAdmin(adminStatus);
        } else {
          console.error("User document does not exist.");
        }
      }
      setIsLoading(false);
    };

    checkAdminStatus();
  }, [authUser]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <PageLayout>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              isAdmin ? (
                <Navigate to="/admin" />
              ) : (
                <Homepage />
              )
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route
          path="/auth"
          element={!authUser ? <AuthPage /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={
            authUser ? (
              isAdmin ? (
                <AdminPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/notespage" element={<NotesPage isAdmin={isAdmin} />} />
        <Route path="/forum" element={<ForumsPage isAdmin={isAdmin} />} />
        <Route path="/phixy" element={<Phixy />} />

        <Route
          path="/faculty"
          element={<FacultyInfoPage isAdmin={isAdmin} />}
        />
        <Route
          path="/lecturevideos"
          element={<LectureVideosPage isAdmin={isAdmin} />}
        />
        <Route path="/lostandfound" element={<LostFoundPage />} />
        <Route path="/mocktest" element={<MockTestPage isAdmin={isAdmin} />} />
        <Route path="/previouspaper" element={<PreviousPaperPage isAdmin={isAdmin}/>} />
        <Route path="/complaint" element={<Complaint />} />
      </Routes>
    </PageLayout>
  );
}

export default App;
