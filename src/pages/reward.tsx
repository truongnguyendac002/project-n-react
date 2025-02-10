import { Button, Card, Image, message, Table } from "antd";
import { GoldFilled,EditOutlined, DeleteOutlined, 
  // PictureOutlined, FileTextOutlined, PushpinOutlined 
} from '@ant-design/icons';
import { useAppSelector } from "../redux/reduxHook";
import { IUserProfile } from "../models/User";
import { IReward } from "../models/DailyReward";
import { useEffect, useState } from "react";
import { deleteReward, getRewards } from "../services/rewardService";
import { DataResponse } from "../payloads/response/dataResponse";
import RewardModal from "../components/reward/dailyRewardModal";
import { getTotalPointsAtDate } from "../services/diceRollService";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";


function RewardPage() {
  const user = useAppSelector<IUserProfile | null>((state) => state.auth.user);
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingArchive, setLoadingArchive] = useState<boolean>(true);
  const [rewardAchieved, setRewardAchieved] = useState<IReward | null>(null);
  const [rewardModalVisible, setRewardModalVisible] = useState<boolean>(false);
  const [editingReward, setEditingReward] = useState<IReward | null>(null);
  const [totalPointsToday, setTotalPointsToday] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, navigate, loading]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const response: DataResponse<IReward[] | string> = await getRewards();
        if (response.respCode === '000') {
          setRewards(response.data as IReward[]);
        }
        else {
          message.error(response.data as string);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchRewards();
    }
  }, [user]);

  useEffect(() => {
    const achievedRewards = rewards
      .filter(reward => totalPointsToday >= reward.minPoint)
      .sort((a, b) => a.minPoint - b.minPoint);
    setRewardAchieved(achievedRewards.length > 0 ? achievedRewards[achievedRewards.length - 1] : null);
  }, [rewards, totalPointsToday]);

  useEffect(() => {
    const fetchTotalPointsToday = async () => {
      setLoadingArchive(true);
      const response = await getTotalPointsAtDate(dayjs());
      if (response.respCode === '000') {
        setTotalPointsToday(response.data);
      }
      else
        message.error(response.respDesc as string);
    };
    if (user) {
      try {
        fetchTotalPointsToday();
      } catch (error) {
        console.error(error)
      }
      finally {
        setLoadingArchive(false);
      }
    }
  }, [user]);

  const columns = [
    {
      title: "Image",
      key: 'imageUrl',
      render: (record: IReward) => (
        <Image 
          src={record.imageUrl ? record.imageUrl : 'https://img.freepik.com/free-vector/flat-football-cup-illustration_23-2150025071.jpg'} 
          alt={record.name} 
          className="w-16 h-16 object-cover rounded-md mx-auto" 
        />
      ),
    },
    {
      title: "Reward",
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: "Description",
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: "Points Required",
      dataIndex: 'minPoint',
      key: 'minPoint',
    },
    {
      title: "Action",
      key: 'action',
      render: (record: IReward) => (
        <div className=" text-center ">
          <Button type="link" onClick={() => handleEditReward(record)} className="text-blue-600 hover:text-blue-800">
            <EditOutlined />
          </Button>
          <Button danger type="link" onClick={() => handleDeleteReward(record)} className="text-red-600 hover:text-red-800">
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];
  
  const handleAddNewReward = () => {
    setEditingReward(null);
    setRewardModalVisible(true);
  }

  const handleEditReward = (reward: IReward) => {
    setEditingReward(reward);
    setRewardModalVisible(true);
  }

  const handleDeleteReward = async (reward: IReward) => {
    try {
      const respone = await deleteReward(reward);
      if (respone.respCode === '000') {
        const newRewards = rewards.filter(r => r.id !== reward.id);
        setRewards(newRewards);
      } else {
        message.error(respone.data as string);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  const handleSaveReward = (reward: IReward) => {
    if (editingReward) {
      setRewards(rewards.map(r => r.id === reward.id ? reward : r));
    } else {
      setRewards([...rewards, reward]);
    }
    setRewardModalVisible(false);
  }


  const handleCancelRewardModal = (reward: IReward) => {
    if (editingReward) {
      setRewards(rewards.map(r => r.id === reward.id ? reward : r));
    }
    setRewardModalVisible(false);
  }

  return (
    <div className="p-6 bg-white min-h-full">
      {/* Tổng coin đã kiếm được */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold text-gray-700">
          Daily coins: <span className="text-blue-600">{totalPointsToday}</span>
          <GoldFilled className="inline-block text-yellow-500 ml-2" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row mb-6 gap-6">
        {/* Bên trái */}
        <div className="lg:w-1/3 w-full">
          <Card bordered={false} loading={loadingArchive} className="rounded-lg shadow-lg">
            {/* Phần thưởng đã đạt được (nổi bật) */}
            <div className="mb-6">
              <h3 className="text-2xl text-center font-semibold text-gray-700">Daily Rewards Achieved</h3>
              <div className="flex flex-col items-center mt-4">
                {rewardAchieved ? (
                  <div className="w-full max-w-xs p-4 bg-yellow-100 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                    <Image src={
                      rewardAchieved.imageUrl
                        ? rewardAchieved.imageUrl
                        : 'https://img.freepik.com/free-vector/flat-football-cup-illustration_23-2150025071.jpg'
                    } alt={rewardAchieved.name} className="w-full h-32 object-cover rounded-md" />
                    <h4 className="mt-2 text-lg font-semibold text-gray-800">{rewardAchieved.name}</h4>
                    <p className="text-sm text-gray-600">{rewardAchieved.description}</p>
                    <div className="text-sm text-gray-500">Points Required: {rewardAchieved.minPoint}</div>
                  </div>
                ) : (
                  <p className="text-gray-600">No rewards achieved yet.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Danh sách phần thưởng */}
        <div className="lg:w-2/3 w-full">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Available Rewards</h3>
            <Table
              loading={loading}
              columns={columns}
              dataSource={rewards}
              rowKey="id"
              pagination={false}
              className="ant-table-rounded"
              scroll={{ y: 334 }}
              footer={() => (
                <div className="flex justify-end">
                  <Button type="primary" onClick={() => handleAddNewReward()}>
                    Thêm mới Reward
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <RewardModal visible={rewardModalVisible} onCancel={handleCancelRewardModal} onSave={handleSaveReward} editingReward={editingReward} setEditingReward={setEditingReward} />
    </div>
  );
}

export default RewardPage;
