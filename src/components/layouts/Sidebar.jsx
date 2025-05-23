import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTachometerAlt,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaUsers,
  FaWallet,
  FaMoneyBillWave,
  FaChevronRight,
} from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import { FaChartSimple } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("user_id");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (currentPath.includes("/admin") && !isAdmin) {
      navigate("/user/dashboard");
      toast.error("Unauthorized access");
    }
  }, [location.pathname, navigate, currentPath]);

  // Framer Motion
  const sidebarVariants = {
    open: {
      width: isMobile ? "100%" : "18rem",
      height: isMobile ? "5rem" : "100vh",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3,
      },
    },
    closed: {
      width: isMobile ? "100%" : "5rem",
      height: isMobile ? "5rem" : "100vh",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: 0.3,
      },
    },
  };

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.3,
        delay: 0.1,
      },
    },
    closed: {
      opacity: 0,
      x: -10,
      transitionEnd: { display: "none" },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.2,
      },
    },
  };

  const menuItemVariants = {
    hover: {
      x: 6,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.3,
      },
    },
  };

  const adminMenuItems = [
    { icon: <FaUser />, text: "Profile", path: "profile" },
    {
      icon: <FaTachometerAlt />,
      text: "Dashboard",
      path: "dashboard",
    },
    { icon: <FaUsers />, text: "Manage Users", path: "users" },
    { icon: <FaCog />, text: "Settings", path: "settings" },
  ];

  const userMenuItems = [
    { icon: <FaUser />, text: "Profile", path: "profile" },
    { icon: <FaTachometerAlt />, text: "Dashboard", path: "dashboard" },
    { icon: <FaChartSimple />, text: "Financial Dashboard", path: "charts" },
    {
      icon: <GrTransaction className="text-indigo-600" />,
      text: "Transactions",
      path: "transactions",
    },
    { icon: <FaMoneyBillWave />, text: "Budgets", path: "addbudget" },
    { icon: <FaCog />, text: "Settings", path: "settings" },
  ];

  const getMenuItems = () => {
    if (currentPath.includes("/admin")) {
      return adminMenuItems;
    }
    return userMenuItems;
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    localStorage.removeItem("isAdmin");
    setTimeout(() => {
      toast.success("Logout Successfully");
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <Toaster position="bottom-right" />
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className={`fixed ${
          isMobile ? "bottom-0 left-0 right-0" : "top-0 left-0 h-screen"
        } bg-gradient-to-b from-white to-gray-50 z-50 flex ${
          isMobile ? "flex-row justify-around items-center" : "flex-col"
        } shadow-lg border-r border-gray-100`}
      >
        {!isMobile && (
          <div className="flex justify-end p-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all duration-200"
              aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronRight />
              </motion.div>
            </motion.button>
          </div>
        )}

        {!isMobile && (
          <div className="flex items-center justify-center py-6 mb-4 border-b border-gray-100">
            <motion.div
              className={`flex items-center space-x-3 ${
                !isOpen && "justify-center"
              }`}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-shrink-0 ml-2">
                <FaWallet className="w-8 h-8 text-blue-600" />
              </div>
              <Link to={"/"}>
                <div
                  className={`flex flex-col transition-all duration-300 ${
                    isOpen
                      ? "opacity-100 w-auto "
                      : "opacity-0 w-0 overflow-hidden "
                  }`}
                >
                  <span className="text-xl font-bold text-gray-800">
                    Expense
                  </span>
                  <span className="text-md font-medium text-blue-600">
                    Tracker
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        )}

        <nav className={`${isMobile ? "flex-1" : "mt-2 flex-1 px-3"}`}>
          <ul className={`${isMobile ? "flex justify-around" : "space-y-2"}`}>
            {getMenuItems().map((item, index) => (
              <motion.li
                key={index}
                initial={false}
                variants={menuItemVariants}
                whileHover="hover"
                whileTap="tap"
                className={isMobile ? "flex-1" : ""}
              >
                <Link
                  to={item.path}
                  className={`flex ${
                    isMobile
                      ? "flex-col items-center justify-center"
                      : "items-center"
                  } p-3 rounded-xl mx-1 cursor-pointer transition-all duration-200
            ${
              location.pathname.includes(item.path)
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200"
                : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
            }`}
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <motion.div
                    className={`min-w-[24px] flex items-center justify-center ${
                      location.pathname.includes(item.path)
                        ? "text-white"
                        : "text-blue-600"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {item.icon}
                  </motion.div>
                  {(!isMobile || isOpen) && (
                    <motion.span
                      variants={textVariants}
                      animate={isOpen ? "open" : "closed"}
                      className={`${
                        isMobile ? "text-xs mt-1" : "ml-3 font-medium"
                      } whitespace-nowrap`}
                    >
                      {item.text}
                    </motion.span>
                  )}

                  {!isMobile &&
                    isOpen &&
                    location.pathname.includes(item.path) && (
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-white ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className={`p-3 mt-auto ${!isMobile && "mb-6"}`}>
          <motion.button
            whileHover={{
              backgroundColor: "#F87171",
              color: "white",
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-3 rounded-xl w-full cursor-pointer text-gray-700 hover:text-white transition-all duration-200"
            aria-label="Logout"
            onClick={() => {
              isMobile && setIsOpen(false);
              handleLogout();
            }}
          >
            <div className="min-w-[24px] flex items-center justify-center text-red-500">
              <FaSignOutAlt />
            </div>
            {!isMobile && isOpen && (
              <motion.span
                variants={textVariants}
                animate={isOpen ? "open" : "closed"}
                className="ml-3 whitespace-nowrap font-medium"
              >
                Logout
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div
        className={`
             min-h-screen
    ${isMobile ? "pb-20" : "pt-16 " + (isOpen ? "ml-72" : "ml-20")}
    transition-all duration-300 ease-in-out
    bg-gray-50
        `}
      >
        {/* Show Navbar only on desktop */}
        {!isMobile && <Navbar />}

        {/* Dashboard content */}
        <div className={`p-4 ${isMobile ? "mt-10" : ""}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
