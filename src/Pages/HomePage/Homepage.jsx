import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStickyNote, faFileAlt, faClipboardCheck, faVideo, faBoxOpen, faChalkboardTeacher, faComments, faSignOutAlt, faHome, faCommentDots, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import LectureVideosPage from '../LectureVideosPage';

const Homepage = () => {
  
   
    const styles = {
        container: {
            display: 'flex',
            height: '100vh',
            fontFamily: 'Arial, sans-serif',
        },
        
       
        mainContent: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: '20px',
        },
        imagePlaceholder: {
            width: '80%',
            height: '300px',
            backgroundColor: '#e0e0e0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '18px',
            color: '#666',
            borderRadius: '10px',
        },
       
    };

    return (
      
        <div style={styles.container}>


            
            <div style={styles.mainContent}>
               {/* <NotesPage/>
               <LectureVideosPage/> */}
               
                
            </div>
            
        </div>
    );
};

export default Homepage;
