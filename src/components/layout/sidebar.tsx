import { Menu, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../redux/reduxHook";
import { IUserProfile } from "../../models/User";

function Sidebar() {
  const navigate = useNavigate();
  const user = useAppSelector<IUserProfile | null>((state) => state.auth.user);
  const hanldeClick = (link: string) => {
    if (user)
      navigate(link);
    else {
      message.error("You must login first")
    }
  }
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
            label: "Daily Quest",
            className: "hover:text-blue-800",
            onClick: ()=> {hanldeClick('daily-quest')}
          },
          {
            key: "today-reward",
            icon: <TrophyOutlined />,
            label: "Today Reward",
            className: "hover:text-blue-800",
            onClick: ()=> {hanldeClick('today-reward')}

          },
          {
            key: "shop",
            icon: <ShopOutlined />,
            label: 'Shop',
            className: "hover:text-blue-800",
            onClick: ()=> {hanldeClick('shop')}
          },
        ]}
      />
    </div>
  );
}

export default Sidebar;
