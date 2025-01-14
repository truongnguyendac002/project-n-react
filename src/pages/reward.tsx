import { useState } from "react";
import { Table } from "antd";
import { GoldFilled } from '@ant-design/icons';

interface Reward {
  id: number;
  name: string;
  image: string;
  description: string;
  pointsRequired: number;
}

function RewardPage() {
  const [totalCoins] = useState(35); // Sử dụng 35 coin làm ví dụ

  const rewards: Reward[] = [
    {
      id: 1,
      name: "Voucher 10% Off",
      image: "https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg",
      description: "Voucher giảm giá 10% cho tất cả sản phẩm.",
      pointsRequired: 10,
    },
    {
      id: 2,
      name: "Free Coffee",
      image: "https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg",
      description: "Phần thưởng là một cốc cà phê miễn phí.",
      pointsRequired: 30,
    },
    {
      id: 3,
      name: "Gift Card $50",
      image: "https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg",
      description: "Thẻ quà tặng trị giá $50 cho các sản phẩm yêu thích.",
      pointsRequired: 50,
    },
    {
      id: 4,
      name: "Free T-shirt",
      image: "https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg",
      description: "T-shirt miễn phí với logo thương hiệu.",
      pointsRequired: 20,
    },
    {
      id: 5,
      name: "Free Book",
      image: "https://i.fbcd.co/products/original/fluffy-roborovski-super-hero-1-b448e91386045d09fd270aa3c13fd043935533634d750467d5ae1cff17b7749e.jpg",
      description: "Một cuốn sách miễn phí.",
      pointsRequired: 40,
    },
  ];

  const achievedRewards = rewards
    .filter(reward => totalCoins >= reward.pointsRequired)
    .sort((a, b) => a.pointsRequired - b.pointsRequired);

  const rewardAchieved = achievedRewards.length > 0 ? achievedRewards[achievedRewards.length - 1] : null;

  const columns = [
    {
      title: 'Tên phần thưởng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Điểm yêu cầu',
      dataIndex: 'pointsRequired',
      key: 'pointsRequired',
    },
  ];

  return (
    <div className="pl-6 pr-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      {/* Tổng coin đã kiếm được */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold text-gray-700">
          Total coins earned today: <span className="text-blue-600">{totalCoins}</span>
          <GoldFilled className="inline-block text-yellow-500 ml-2" />
        </div>
      </div>

      <div className="flex mb-6 ">
        {/* Ảnh GIF bên trái */}
        <div className="w-1/3 pr-4 ">
          {/* Phần thưởng đã đạt được (nổi bật) */}
          <div className="mb-6 ">
            <div className="bg-white rounded-lg shadow-xl pb-6 pr-4 pl-4 mb-4 border-4 border-yellow-500">
              <h3 className="text-2xl text-center font-semibold text-gray-700">Daily Rewards Achieved</h3>
              <div className="flex flex-col items-center mt-4">
                {rewardAchieved ? (
                  <div className="w-full max-w-xs p-4 bg-yellow-100 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                    <img src={rewardAchieved.image} alt={rewardAchieved.name} className="w-full h-32 object-cover rounded-md" />
                    <h4 className="mt-2 text-lg font-semibold text-gray-800">{rewardAchieved.name}</h4>
                    <p className="text-sm text-gray-600">{rewardAchieved.description}</p>
                    <div className="text-sm text-gray-500">Points Required: {rewardAchieved.pointsRequired}</div>
                  </div>
                ) : (
                  <p className="text-gray-600">No rewards achieved yet.</p>
                )}
              </div>
            </div>
          </div>
          <img
            src="https://media.giphy.com/media/l0ExdMHUDKteztyfe/giphy.gif"
            alt="Capybara Fighting Monsters"
            className="w-full  rounded-lg shadow-lg"
          />
        </div>

        {/* Danh sách phần thưởng */}
        <div className="w-2/3">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Available Rewards</h3>
            <Table
              columns={columns}
              dataSource={rewards}
              rowKey="id"
              pagination={false}
              className="ant-table-rounded"
              scroll={{ y: 360 }} // Cho phép cuộn theo chiều dọc khi cần
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardPage;
