import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header1 from "../components/Header1";
import { API_URL } from "../../config/Contant";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/dashboard`);
      setData(res.data?.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cards = [
    {
      label: "Users",
      value: data?.userCount,
      color: "from-blue-400 to-blue-600",
    },
    {
      label: "Total Salary(₹)",
      value: Math.round(data?.totalSalary.totalAmount),
      color: "from-green-400 to-green-600",
    },
    {
      label: "Total Return(₹)",
      value: Math.round(data?.totalReturn.totalAmount),
      color: "from-purple-400 to-purple-600",
    },
    {
      label: "Total Revenue(₹)",
      value: Math.round(data?.totalBuyPackage.totalAmount),
      color: "from-yellow-400 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col w-full">
        <Header1 setSidebarOpen={setSidebarOpen} />

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-xl shadow-lg`}
              >
                <div className="text-sm font-semibold">{card.label}</div>
                <div className="text-2xl font-bold mt-1">
                  {card.value ?? "-"}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content Area */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md mt-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Activity
            </h2>
            <div className="text-gray-500 italic">
              [Recent activity log or table goes here]
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
