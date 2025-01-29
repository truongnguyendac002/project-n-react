import { Button, Drawer, Menu, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ShopOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useAppSelector } from "../../redux/reduxHook";
import { IUserProfile } from "../../models/User";
import { useState } from "react";

function Sidebar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const user = useAppSelector<IUserProfile | null>((state) => state.auth.user);
  const handleClick = (link: string) => {
    if (user)
      navigate(link);
    else {
      message.error("You must login first")
    }
  }

  const menuItems = [
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
      onClick: () => { handleClick('daily-quest'); setOpen(false); },
    },
    {
      key: "today-reward",
      icon: <TrophyOutlined />,
      label: "Today Reward",
      className: "hover:text-blue-800",
      onClick: () => { handleClick('today-reward'); setOpen(false); },
    },
    {
      key: "shop",
      icon: <ShopOutlined />,
      label: "Shop",
      className: "hover:text-blue-800",
      onClick: () => { handleClick('shop'); setOpen(false); },
    },
  ];

  return (
    <>
      {/* Nút mở sidebar trên mobile */}
      <Button className="md:hidden fixed top-20 left-4 z-50" type="primary" icon={<MenuOutlined />} onClick={() => setOpen(true)} />

      {/* Sidebar cho desktop */}
      <div className="hidden md:block w-1/6 bg-white max-h-full p-4">
        <Menu mode="vertical" className="bg-transparent border-none text-gray-600" defaultSelectedKeys={["dashboard"]} items={menuItems} />
      </div>

      {/* Sidebar dạng Drawer trên mobile */}
      <Drawer title="Menu" placement="left" closable onClose={() => setOpen(false)} open={open}>
        <Menu mode="inline" className="bg-transparent border-none text-gray-600" defaultSelectedKeys={["dashboard"]} items={menuItems} />
      </Drawer>
    </>
  );


}

export default Sidebar;
