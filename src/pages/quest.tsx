import React, { useEffect, useState } from "react";
import { DatePicker, Table, Checkbox, Button, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { GoldFilled } from '@ant-design/icons';
import DiceModal from "../components/reward/diceModal";
import { deleteQuest, fetchQuests } from "../services/questService";
import { DataResponse } from "../payloads/response/dataResponse";
import { IQuest } from "../models/Quest";
import QuestModal from "../components/quest/questModal";
import { useAppSelector } from "../redux/reduxHook";
import { IUserProfile } from "../models/user";
import { useNavigate } from "react-router-dom";

interface QuestColumns {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (record: IQuest) => React.ReactNode;
}

function QuestPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [diceModalVisible, setDiceModalVisible] = useState<boolean>(false);
  const [quests, setQuests] = useState<IQuest[]>([]);

  // Quest cần sửa (nếu có)
  const [editingQuest, setEditingQuest] = useState<IQuest | undefined>(undefined); // Quest cần sửa
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
    console.log(record);
    setDiceModalVisible(true);
  }

  const handleEditQuest = (quest: IQuest) => {
    setEditingQuest(quest);
    setModalVisible(true);
  };

  const handleDeleteQuest = async (quest: IQuest) => {
    try {
      const response = await deleteQuest(quest);
      if (response.respCode === '000') {
        setQuests((prevQuests) => prevQuests.filter((q) => q.key !== quest.key));
        message.success("Delete quest successfully!")
      } else {
        message.error("Delete quest fail!")
      }
    }
    catch  (error) {
      message.error("Delete quest fail!")
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
      const fetchData = async (): Promise<void> => {
        setLoading(true)
        const response: DataResponse<IQuest> = await fetchQuests(selectedDate);
        if (response.respCode === "000") {
          try {
            const quests: IQuest[] = Array.isArray(response.data) ? response.data : [];
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
      }
      finally {
        setLoading(false)
      }
    }
  }, [selectedDate, user]);



  const columns: QuestColumns[] = [
    {
      title: "Hoàn thành",
      key: "completed",
      render: (record: IQuest) => (
        <Checkbox
          checked={record.isDone}
          onChange={() => handleCheckboxChange(record.key)}
        />
      ),
    },
    {
      title: "Mục tiêu",
      dataIndex: "target",
      key: "target",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Điểm",
      dataIndex: "points",
      key: "points",
    },

    {
      title: "Roll Dice",
      key: "roll dice",
      render: (record: IQuest) => (
        <Button onClick={() => handleRollDice(record)}>
          Roll Dice
        </Button>
      ),
    },
    {
      title: "Action",
      key: "edit",
      render: (record: IQuest) => (
        <>
          <Button onClick={() => handleEditQuest(record)} type="link">
            Sửa
          </Button>
          <Button danger onClick={() => handleDeleteQuest(record)} type="link">
            Xoá
          </Button>
        </>

      ),
    },

  ];

  return (
    <div className="pl-6 pr-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full">
      {/* Tổng coin và chọn ngày */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold text-gray-700">
          Total coins: <span className="text-blue-600">{totalCoins}</span>
          <GoldFilled className="inline-block text-yellow-500 ml-2" />
        </div>

        {/* Ô chọn ngày */}
        <DatePicker
          defaultValue={selectedDate} // Sử dụng dayjs thay vì moment
          onChange={changeDate}
          className="w-60"
          format={'DD/MM/YYYY'}
        />
      </div>

      <div className="flex mb-6">
        {/* Ảnh GIF bên trái */}
        <div className="flex-1 pr-4">

          <img
            src="https://media.giphy.com/media/l0ExdMHUDKteztyfe/giphy.gif"
            alt="Capybara Fighting Monsters"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="w-2/3">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Table
              loading={loading}
              columns={columns}
              dataSource={quests}
              pagination={false}
              className="ant-table-rounded w-"
              scroll={{ y: 360 }}
              footer={() => (
                <div className="flex justify-end">
                  <Button type="primary" onClick={() => handleAddNewQuest()}>
                    Thêm mới Quest
                  </Button>
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <DiceModal visible={diceModalVisible} setVisible={setDiceModalVisible} onCancel={() => setDiceModalVisible(false)} />
      {/* Modal để thêm hoặc sửa quest */}
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
