
import CreatePost from "./CreatePost";
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
      <CreatePost/>
      <ProfileLink/>
      <Forums/>
    </>
  );
};

export default SidebarItems;