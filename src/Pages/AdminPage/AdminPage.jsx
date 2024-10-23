// import { Flex } from "@chakra-ui/react";
import CreatePost from "../../components/Sidebar/CreatePost";

const AdminPage = () => {
  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "#F2F4EF",
      }}>
      {/* Main content */}

      {/* Circular icon */}
      {/* <div
        style={{
          position: "absolute",
          bottom: "30px", // Adjust as needed
          right: "30px", // Adjust as needed
          width: "46px", // Adjust size for the icon
          height: "46px", // Adjust size for the icon
          backgroundColor: "black",
          color: "white", // Choose your color
          borderRadius: "50%", // Makes it circular
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          cursor: "pointer",
        }}>
        <CreatePost />
      </div> */}
    </div>
  );
};

export default AdminPage;