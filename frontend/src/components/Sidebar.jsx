import { motion } from "framer-motion";
import { FaHome, FaUsers, FaChartLine , FaTimes , FaSignOutAlt } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { GiReceiveMoney } from "react-icons/gi";
import { MdPayments, MdSettings, MdOutlineSwapHoriz, MdOutlineHistory } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

const navItems = [
  { name: "Products", icon: <FaUsers />, path: "/products" },
];


export default function Sidebar({ sidebarOpen, setSidebarOpen }) {

    const dispatch =  useDispatch()
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/");
      };


  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64  shadow-lg p-6 bg-gray-50 transition-transform duration-300 lg:translate-x-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:inset-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <NavLink to={"/"}>
            <h3>Woo-Commerce</h3>
          </NavLink>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <FaTimes className="text-xl text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={`${item.path}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#5017c3] hover:text-gray-100 transition-colors duration-200 ${
                  isActive
                    ? "bg-[#330f79] text-gray-100 font-semibold"
                    : "text-gray-700"
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="text-xl">{item.icon}</div>
                <span>{item.name}</span>
              </motion.div>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="pt-10 border-t mt-10">
          <div className="flex items-center gap-3 px-3 py-2 text-red-500 cursor-pointer hover:bg-red-50 rounded-lg" onClick={handleLogout}>
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
