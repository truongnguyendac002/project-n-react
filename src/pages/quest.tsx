import React, { ReactNode, useEffect, useState } from "react";
import { DatePicker, Table, Checkbox, Button, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import DiceModal from "../components/dice/diceModal";
import { deleteQuest, fetchQuests } from "../services/questService";
import { DataResponse } from "../payloads/response/dataResponse";
import { IQuest } from "../models/Quest";
import QuestModal from "../components/quest/questModal";
import { useAppSelector } from "../redux/reduxHook";
import { IUserProfile } from "../models/User";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  AimOutlined,
  FileTextOutlined,
  StarOutlined,
  PlayCircleOutlined,
  EllipsisOutlined,
  GoldFilled
} from "@ant-design/icons";

interface QuestColumns {
  title: ReactNode;
  dataIndex?: string;
  key: string;
  render?: (record: IQuest) => React.ReactNode;
}

function QuestPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [diceModalVisible, setDiceModalVisible] = useState<boolean>(false);
  const [quests, setQuests] = useState<IQuest[]>([]);

  const [editingQuest, setEditingQuest] = useState<IQuest | undefined>(undefined);
  const [rollQuest, setRollQuest] = useState<IQuest | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const user = useAppSelector<IUserProfile | null>((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/");
    }
  }, [user, navigate, loading]);

  const totalCoins = quests.reduce(
    (sum, quest) => (quest.isDone ? sum + quest.points : sum),
    0
  );

  const handleCheckboxChange = (key: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) =>
        quest.key === key ? { ...quest, completed: !quest.isDone } : quest
      )
    );
  };

  const handleRollDice = (record: IQuest) => {
    setRollQuest(record);
    setDiceModalVisible(true);
  };

  const handleEditQuest = (quest: IQuest) => {
    setEditingQuest(quest);
    setModalVisible(true);
  };

  const handleDeleteQuest = async (quest: IQuest) => {
    try {
      const response = await deleteQuest(quest);
      if (response.respCode === "000") {
        setQuests((prevQuests) => prevQuests.filter((q) => q.key !== quest.key));
        message.success("Delete quest successfully!");
      } else {
        message.error("Delete quest fail!");
      }
    } catch (error) {
      message.error("Delete quest fail!");
      console.log("Failed to delete quest" + error);
    }
  };

  const handleAddNewQuest = () => {
    setEditingQuest(undefined);
    setModalVisible(true);
  };

  const handleSaveQuest = (quest: IQuest) => {
    if (editingQuest) {
      setQuests((prevQuests) =>
        prevQuests.map((q) => (q.key === quest.key ? quest : q))
      );
    } else {
      setQuests((prevQuests) => [...prevQuests, quest]);
    }
    setModalVisible(false);
  };

  const changeDate = (date: Dayjs | null) => {
    setSelectedDate(date ? date : selectedDate);
  };

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        const response: DataResponse<IQuest> = await fetchQuests(selectedDate);
        if (response.respCode === "000") {
          try {
            const quests: IQuest[] = Array.isArray(response.data)
              ? response.data
              : [];
            setQuests(quests);
          } catch (error) {
            console.error("Error parsing quests data", error);
          }
        } else {
          console.log("Failed to fetch quests");
        }
      };
      try {
        fetchData();
      } catch (error) {
        console.log("Failed to fetch quests" + error);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedDate, diceModalVisible, user]);

  const sortedQuests = [...quests].sort((a, b) => {
    if (a.isDone === b.isDone) return 0;
    return a.isDone ? 1 : -1;
  });

  const columns: QuestColumns[] = [
    {
      title: <div className="flex justify-center"><CheckCircleOutlined className="text-lg" /></div>,
      key: "completed",
      render: (record: IQuest) => (
        <Checkbox
          checked={record.isDone}
          onChange={() => handleCheckboxChange(record.key)}
        />
      ),
    },
    {
      title: <div className="flex justify-center"><AimOutlined className="text-lg" /></div>,
      dataIndex: "target",
      key: "target",
    },
    {
      title: <div className="flex justify-center"><FileTextOutlined className="text-lg" /></div>,
      dataIndex: "description",
      key: "description",
    },
    {
      title: <div className="flex justify-center"><StarOutlined className="text-lg" /></div>,
      dataIndex: "points",
      key: "points",
    },
    {
      title: <div className="flex justify-center"><PlayCircleOutlined className="text-lg" /></div>,
      key: "roll dice",
      render: (record: IQuest) => (
        <Button
          disabled={record.isDone}
          onClick={() => handleRollDice(record)}
          type="primary"
          className="w-full sm:w-auto"
        >
          Roll Dice
        </Button>
      ),
    },
    {
      title: <div className="flex justify-center"><EllipsisOutlined className="text-lg" /></div>,
      key: "edit",
      render: (record: IQuest) => (
        <div className="flex justify-center space-x-2">
          <Button onClick={() => handleEditQuest(record)} type="link" className="text-blue-600">
            Sửa
          </Button>
          {!record.isDone && (
            <Button danger onClick={() => handleDeleteQuest(record)} type="link" className="text-red-600">
              Xoá
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  return (
    <div className="px-4 md:px-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="text-lg font-bold text-gray-700 flex items-center gap-2">
          Daily coins: <span className="text-blue-600">{totalCoins}</span>
          <GoldFilled className="text-yellow-500" />
        </div>
        <DatePicker
          defaultValue={selectedDate}
          onChange={changeDate}
          className="w-full md:w-60"
          format={"DD/MM/YYYY"}
        />
      </div>
  
      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hình ảnh */}
        <div className="md:col-span-1 flex justify-center">
          <img
            src="https://media.giphy.com/media/l0ExdMHUDKteztyfe/giphy.gif"
            alt="Capybara Fighting Monsters"
            className="w-full max-w-sm md:max-w-full rounded-lg shadow-lg"
          />
        </div>
  
        {/* Bảng danh sách quest */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-4 md:pr-4">
            <Table
              loading={loading}
              columns={columns}
              dataSource={sortedQuests}
              pagination={false}
              className="ant-table-rounded"
              scroll={{ y: 360 }}
              footer={() => (
                <div className="flex justify-end">
                  <Button type="primary" onClick={handleAddNewQuest}>
                    Thêm mới Quest
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>
  
      {/* Modals */}
      <DiceModal
        quest={rollQuest}
        visible={diceModalVisible}
        setVisible={setDiceModalVisible}
        onCancel={() => setDiceModalVisible(false)}
      />
      <QuestModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSave={handleSaveQuest}
        editingQuest={editingQuest}
        selectedDate={selectedDate}
      />
    </div>
  );
  
}

export default QuestPage;
