import { Avatar, Dropdown, Button } from "antd";
import { LogoutOutlined, EditOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useState } from "react";
import LoginModal from "../auth/loginModal";
import { useAppDispatch, useAppSelector } from "../../redux/reduxHook";
import { IUserProfile } from "../../models/user";
import { removeUserProfile } from "../../redux/slices/authSlice";


const menuItems: MenuProps["items"] = [
    {
        key: "edit",
        icon: <EditOutlined />,
        label: "Sửa thông tin",
    },
    {
        key: "logout",
        icon: <LogoutOutlined />,
        danger: true,
        label: "Đăng xuất",
    },
];

function TopBar() {
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const dispatch = useAppDispatch();
    const user = useAppSelector<IUserProfile | null>((state) => state.auth.user);

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        if (key === "edit") {
            console.log("Sửa thông tin cá nhân");
        } else if (key === "logout") {
            dispatch(removeUserProfile());
        }
    };

    return (
        <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-t-xl">
            <div className="text-2xl font-bold text-gray-700">Sunday, 26th Feb 2023</div>
            <div className="flex items-center gap-4">
                <input
                    type="text"
                    placeholder="Search"
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border-none focus:outline-none shadow-sm"
                />
                { user ? (
                    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]} placement="bottomRight">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Avatar
                                size={40}
                                src={user.profileImg || "https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                                className="object-cover"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </Dropdown>
                ) : (
                    <Button className="py-4" type="primary" onClick={() => setLoginModalVisible(true)}>
                        Login
                    </Button>
                )}
            </div>

            <LoginModal visible={loginModalVisible} setVisible={setLoginModalVisible} onCancel={() => setLoginModalVisible(false)} />
        </div>
    );
}

export default TopBar;
