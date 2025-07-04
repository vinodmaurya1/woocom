import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/authSlice";
import { useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/Contant";

export default function Header1({ setSidebarOpen }) {
const dispatch = useDispatch()
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const getUser = async () => {
      const token =  localStorage.getItem("token");
      if (!token) return;
  // console.log(token)
      try {
        const res = await axios.get(
          `${API_URL}/auth/get-by-token`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        // console.log("g1", res.data)
        if (res.data.success) {
          // console.log("g2", res.data.data)
          dispatch(setUser(res.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };


    useEffect(() => {
        getUser();
      }, []);

  return (
    <div className="flex items-center bg-gray-50 justify-between px-4 py-4 shadow-md sticky top-0 z-20">
      <div className="lg:hidden">
        <button onClick={() => setSidebarOpen(true)}>
          <FaBars className="text-2xl text-gray-600" />
        </button>
      </div>
      <h2 className="text-xl font-semibold text-gray-700">Dashboard</h2>
      <div className="flex items-center space-x-4">
        <FaBell className="text-xl text-gray-700 cursor-pointer" />
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-medium text-gray-700">{user?.name}</span>
          <span className="text-xs text-gray-700">{user?.email}</span>
        </div>
        <FaUserCircle className="text-3xl text-gray-700" />
      </div>
    </div>
  );
}
