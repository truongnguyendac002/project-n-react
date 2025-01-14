import { Menu } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ShopOutlined,
} from "@ant-design/icons";

function Sidebar() {
  return (
    <div className="pt-4 mt-2 w-1/6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-lg rounded-b-xl">
      <Menu
        mode="vertical"
        className="bg-transparent border-none text-gray-600"
        defaultSelectedKeys={["dashboard"]}
        items={[
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/">Dashboard</Link>,
            className: "text-lg font-semibold hover:text-blue-800",
          },
          {
            key: "daily-quest",
            icon: <CalendarOutlined />,
            label: <Link to="/daily-quest">Daily Quest</Link>,
            className: "hover:text-blue-800",
          },
          {
            key: "today-reward",
            icon: <TrophyOutlined />,
            label: <Link to="/today-reward">Today Reward</Link>,
            className: "hover:text-blue-800",
          },
          {
            key: "shop",
            icon: <ShopOutlined />,
            label: <Link to="/shop">Shop</Link>,
            className: "hover:text-blue-800",
          },
        ]}
      />
    </div>
  );
}

export default Sidebar;
