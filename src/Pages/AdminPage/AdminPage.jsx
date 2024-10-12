import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome
import FloatingNav from '../../components/Navbar/Navbar';
import { navItems } from '../../constants';
// import './App.css'; // Import Tailwind CSS

const AdminPage = () => {
  
  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <FloatingNav navItems={navItems} />
      {/* Top Section with a placeholder for the image */}
      <div className="w-full max-w-xs mt-4">
        <div className="bg-gray-300 h-40 w-full mb-4"></div>
        <h2 className="text-orange-500 font-bold mb-4">Resources</h2>

        {/* Resource Cards - Two in a Row */}
        <div className="grid grid-cols-2 gap-4">
          <ResourceItem 
            icon="fas fa-sticky-note" 
            label="Notes" 
            updateText="update notes" 
            bgColor="bg-blue-500" 
            link="/notes"
          />
          <ResourceItem 
            icon="fas fa-file-alt" 
            label="Previous papers" 
            updateText="Update papers" 
            bgColor="bg-blue-300" 
            link="/notes"
          />
          <ResourceItem 
            icon="fas fa-edit" 
            label="Mock Test" 
            updateText="update Tests" 
            bgColor="bg-red-100" 
            link="/notes"
          />
          <ResourceItem 
            icon="fas fa-video" 
            label="Lecture Videos" 
            updateText="update Videos" 
            bgColor="bg-red-300" 
            link="/notes"
          />
          <ResourceItem 
            icon="fas fa-box-open" 
            label="Lost and Found" 
            updateText="update Msg" 
            bgColor="bg-yellow-500" link="/notes"
          />
          <ResourceItem 
            icon="fas fa-chalkboard-teacher" 
            label="Faculty Info" 
            updateText="update Info" 
            bgColor="bg-red-600" 
            link="/notes"
          />
          <ResourceItem 
            icon="fas fa-users" 
            label="Forums" 
            updateText="update Info" 
            bgColor="bg-red-800" 
            link="/notes"
          />
          <ResourceItem 
            icon="fas fa-users" 
            label="Add more" 
            updateText="update Info" 
            bgColor="bg-red-800" 
            link="/notes"
          />
        </div>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// ResourceItem Component
const ResourceItem = ({ icon, label, updateText, bgColor }) => {
  return (
    <div className={`flex flex-col justify-between ${bgColor} text-white p-4 rounded-lg h-24`}>
      <div className="flex items-center">
        <i className={`${icon} mr-2 text-xl`}></i>
        <span className="font-bold">{label}</span>
      </div>
      <span className="text-xs">{updateText}</span>
    </div>
  );
};

// Footer Component
const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t">
    
    </div>
  );
};

// FooterItem Component
const FooterItem = ({ icon, label }) => {
  return (
    <div className="flex flex-col items-center text-orange-500">
      <i className={icon}></i>
      <span className="text-xs">{label}</span>
    </div>
  );
};

export default AdminPage;
