import { motion } from "framer-motion";
import axios from "axios";
import { API_URL } from "../../../config/Contant";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    const {
      email,
      password,
    } = formData;


    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }


    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (res.data?.success) {

        const token = res.data.data.token;
        // console.log(res.data.data.token ,res.data.data.seller )
        toast.success("Login Successful");
        localStorage.setItem("token", token);
        dispatch(loginSuccess({ token, user: res.data.seller }));
        navigate("/products");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <motion.section
      id="register"
      className="min-h-screen py-16 px-6 md:px-20"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="w-60 h-60 bg-green-700 rounded-full opacity-30 filter blur-3xl absolute top-10 left-10"
          animate={{ x: [0, 50, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        />
        <motion.div
          className="w-72 h-72 bg-purple-700 rounded-full opacity-20 filter blur-2xl absolute bottom-20 right-20"
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-center items-center ">
        <motion.form
          onSubmit={handleLogin}
          variants={itemVariants}
          className="p-8 rounded-lg shadow-xl border border-gray-700 backdrop-blur-md space-y-4 w-full max-w-md"
        >
          <h2 className="text-center text-gray-800 text-2xl font-semibold">
            Login
          </h2>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full bg-transparent border-b border-gray-500 py-2 px-1 focus:outline-none focus:border-[#330f79] placeholder-gray-400 text-black"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-transparent border-b border-gray-500 py-2 px-1 focus:outline-none focus:border-[#330f79] placeholder-gray-400 text-black pr-10"
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2">
            <button
              type="submit"
              className="bg-[#330f79] hover:bg-[#260a5e] text-white px-6 py-2 rounded-lg transition"
            >
              Submit
            </button>
           
          </div>
          <p className="text-center text-black">
            Don't have any account?{" "}
            <Link className="text-[#5929ba]" to="/signup">
              SignUp
            </Link>{" "}
          </p>
        </motion.form>
      </div>
    </motion.section>
  );
}
