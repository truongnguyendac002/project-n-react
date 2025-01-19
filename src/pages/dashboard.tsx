import { Typography, Card, Button } from "antd";
import { PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { BsFillDice3Fill } from "react-icons/bs";

const { Title, Text } = Typography;

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center py-12 px-12">
            <div className="text-center mb-12">
                <Title level={1} className="text-blue-600">DailyGoal 🔥</Title>
                <Text className="text-lg text-gray-600">Quản lý mục tiêu hàng ngày của bạn !</Text>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card 1: Thêm mục tiêu */}
                <Card className="bg-white shadow-lg rounded-lg p-6" hoverable>
                    <div className="flex items-center justify-center mb-4">
                        <Button shape="circle" icon={<PlusOutlined />} className="bg-blue-500 text-white" size="large" />
                    </div>
                    <Title level={4}>Đặt Mục Tiêu</Title>
                    <Text className="text-gray-600">Cập nhật và theo dõi các mục tiêu mỗi ngày để tiến gần hơn đến thành công!</Text>
                </Card>

                {/* Card 2: Lăn xúc xắc */}
                <Card className="bg-white shadow-lg rounded-lg p-6" hoverable>
                    <div className="flex items-center justify-center mb-4">
                        <Button shape="circle" icon={<BsFillDice3Fill />} className="bg-green-500 text-white" size="large" />
                    </div>
                    <Title level={4}>Lăn Xúc Xắc</Title>
                    <Text className="text-gray-600">Khi hoàn thành mục tiêu, bạn sẽ lăn xúc xắc để nhận thưởng điểm! Điểm này giúp bạn đạt được các phần quà hấp dẫn, do bạn tự đặt ra 🤣</Text>
                </Card>

                {/* Card 3: Mua phần quà */}
                <Card className="bg-white shadow-lg rounded-lg p-6" hoverable>
                    <div className="flex items-center justify-center mb-4">
                        <Button shape="circle" icon={<ShoppingCartOutlined />} className="bg-red-500 text-white" size="large" />
                    </div>
                    <Title level={4}>Mua Phần Quà</Title>
                    <Text className="text-gray-600">Dùng điểm tích lũy để mua những phần quà mà bạn mong muốn!</Text>
                </Card>
            </div>

        </div>
    );
};

export default Dashboard;
