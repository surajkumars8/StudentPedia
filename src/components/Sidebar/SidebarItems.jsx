
import ProfilePage from "../../Pages/ProfilePage/ProfilePage";
import Phixy from "../ChatBot/Phixy";
import Complaint from "../Complaint/Complaint";
import FacultyInfo from "./FacultyInfo";
import Forums from "./Forums";

import LectureVideos from "./LectureVideos";
import LostFound from "./LostFound";
import MockTest from "./MockTest";
import Notes from "./Notes";

import PreviousPaper from "./PreviousPaper";
import ProfileLink from "./ProfileLink";


const SidebarItems = () => {
  return (
    <>
      <Notes />
      <PreviousPaper />
      <MockTest />
      <LectureVideos />
      <LostFound />
      <FacultyInfo />
      <ProfileLink/>
      <Forums/>
      <ProfilePage/>
      <Complaint/>
      <Phixy/>

    </>
  );
};

export default SidebarItems;