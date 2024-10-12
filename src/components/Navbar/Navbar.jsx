import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Use React Router for navigation
// import Toggle from "./ThemeToggle"; // Assuming you have a theme toggle component
import classnames from 'classnames'; // Custom utility for conditional classnames

export const FloatingNav = ({ navItems, className }) => {
  return (
    <motion.div
      initial={{
        opacity: 1,
        y: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.2,
      }}
      className={classnames(
        "flex max-w-fit md:min-w-[70vw] lg:min-w-fit fixed z-[5000] top-10 inset-x-0 mx-auto px-10 py-5 rounded-lg border border-black/.1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4",
        className
      )}
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(17, 25, 40, 0.75)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.125)",
        position: "fixed", // Fix the position on the screen
        top: "10px", // Keep it at the top
        left: "10%",
        // Center horizontally
        transform: "translateX(-50%)", // Adjust for centering
      }}
    >
      {navItems.map((navItem, idx) => (
        <Link
          key={`link-${idx}`}
          to={navItem.link} // React Router's 'to' attribute
          className={classnames(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="text-sm !cursor-pointer">{navItem.name}</span>
        </Link>
      ))}
      {/* <Toggle /> */}
    </motion.div>
  );
};

export default FloatingNav;
