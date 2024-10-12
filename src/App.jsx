import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate, Route, Routes } from "react-router-dom";
import PageLayout from "./Layouts/PageLayout/PageLayout.jsx";
import { auth } from "./firebase/firebase";
import Authpage from "./Pages/AuthPage/Authpage";


import AdminPage from "./Pages/AdminPage/AdminPage";
import HomePage from "./Pages/HomePage/Homepage.jsx";
import NotesPage from "./Pages/NotesPage.jsx";
import ForumsPage from "./Pages/ForumsPage.jsx";
import FacultyInfoPage from "./Pages/FacultyInfoPage.jsx";
import LectureVideosPage from "./Pages/LectureVideosPage.jsx";
import LostFoundPage from "./Pages/LostFoundPage.jsx";
import MockTestPage from "./Pages/MockTestPage.jsx";
import PreviousPaperPage from "./Pages/PreviousPaperPage.jsx";
import ProfilePage from "./Pages/ProfilePage/ProfilePage.jsx";


function App() {
  const [authUser] = useAuthState(auth);
  return (
   
   
    <PageLayout>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!authUser ? <Authpage /> : <Navigate to="/" />}
        />
        <Route path="/:username" element={<ProfilePage />} />
         <Route path="/notespage" element={<NotesPage />} />
         <Route path="/forum" element={<ForumsPage />} />
         <Route path="/faculty" element={<FacultyInfoPage />} />
         <Route path="/lecturevideos" element={<LectureVideosPage />} />
         <Route path="/lostandfound" element={<LostFoundPage />} />
         <Route path="/mocktest" element={<MockTestPage />} />
         <Route path="/previouspaper" element={<PreviousPaperPage />} />
         <Route path="/adminpage" element={<AdminPage />} />
      </Routes>
   


     </PageLayout>
  );
}

export default App;