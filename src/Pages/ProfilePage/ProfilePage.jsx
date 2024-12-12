import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { Clock, Mail, Book, Video, FileText, Users, MessageSquare, ClipboardList } from 'lucide-react';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('notes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid; // Fetch by UID
        console.log("Authenticated user UID:", userId);

        // Fetch user data by UID
        const userDocRef = doc(db, 'users', userId);
        const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData({ id: docSnapshot.id, ...docSnapshot.data() });
          } else {
            setError("User not found.");
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setError("Error fetching user data.");
          setLoading(false);
        });

        // Fetch activities
        const activityDocQuery = query(
          collection(db, 'activities'),
          where('userId', '==', userId) // Match userId with authenticated UID
        );
        const unsubscribeActivities = onSnapshot(activityDocQuery, (snapshot) => {
          const newActivities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setActivities(newActivities);
        }, (error) => {
          console.error("Error fetching activities:", error);
          setError("Error fetching activities.");
        });

        // Cleanup
        return () => {
          unsubscribeUser();
          unsubscribeActivities();
        };
      } else {
        setError("No authenticated user found.");
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
  };

  const getUsernameFromEmail = (email) => {
    return email ? email.split('@')[0] : 'Unknown User';
  };

  const ActivityList = ({ activities }) => (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className="bg-white p-4 rounded-md shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{activity.action}</p>
                <p className="text-sm text-gray-500">On: {activity.page}</p>
              </div>
              <div className="flex items-center text-gray-500">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">{formatDate(activity.timestamp)}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No activities found for this category.</p>
      )}
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white mb-6 rounded-md shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold flex items-center">
            <Mail className="w-6 h-6 mr-2" />
            User Profile
          </h2>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-medium">{userData?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600">Username:</p>
            <p className="font-medium">{getUsernameFromEmail(userData?.email)}</p>
          </div>
          <div>
            <p className="text-gray-600">Role:</p>
            <p className="font-medium">{userData?.role || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600">Last Login:</p>
            <p className="font-medium">{formatDate(userData?.lastLogin)}</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-md shadow-md">
        <div className="flex border-b">
          {['notes', 'lectureVideos', 'mockTests', 'facultyInfo', 'forums', 'previousPapers'].map((tab) => (
            <button
              key={tab}
              className={`flex items-center p-4 ${activeTab === tab ? 'bg-gray-100 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'notes' && <Book className="w-4 h-4 mr-2" />}
              {tab === 'lectureVideos' && <Video className="w-4 h-4 mr-2" />}
              {tab === 'mockTests' && <ClipboardList className="w-4 h-4 mr-2" />}
              {tab === 'facultyInfo' && <Users className="w-4 h-4 mr-2" />}
              {tab === 'forums' && <MessageSquare className="w-4 h-4 mr-2" />}
              {tab === 'previousPapers' && <FileText className="w-4 h-4 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-4">
          <ActivityList activities={activities.filter(activity => activity.type === activeTab)} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
