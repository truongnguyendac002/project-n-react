import React, { useState } from "react";
import { DatePicker, Table, Checkbox, Button } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { GoldFilled } from '@ant-design/icons';
import DiceModal from "../components/reward/diceModal";

interface Quest {
  key: string;
  index: number;
  target: string;
  description: string;
  completed: boolean;
  points: number;
}

interface QuestColumns {
  title: string;
  dataIndex?: string;
  key: string;
  render?: (_: unknown, record: Quest) => React.ReactNode;
}

function QuestPage() {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [diceModalVisible, setDiceModalVisible] = useState<boolean>(false);
  const [quests, setQuests] = useState<Quest[]>([
    {
      key: "1",
      index: 1,
      target: "Thu thập 10 quả táo",
      description: "Đi đến khu rừng phía bắc và thu thập táo.",
      completed: false,
      points: 10,
    },
    {
      key: "2",
      index: 2,
      target: "Đánh bại 5 quái vật nhỏ",
      description: "Tiêu diệt quái vật trong khu vực đồng cỏ.",
      completed: false,
      points: 15,
    },

  ]);

  const totalCoins = quests.reduce(
    (sum, quest) => (quest.completed ? sum + quest.points : sum),
    0
  );

  const handleCheckboxChange = (key: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) =>
        quest.key === key ? { ...quest, completed: !quest.completed } : quest
      )
    );
  };

  const handleRollDice = (record: Quest) => {
    console.log(record);
    setDiceModalVisible(true);
  }

  const changeDate = (date: Dayjs | null) => {
    setSelectedDate(date ? date : selectedDate);
  };

  const columns: QuestColumns[] = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
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
      title: "Hoàn thành",
      key: "completed",
      render: (_, record: Quest) => (
        <Checkbox
          checked={record.completed}
          onChange={() => handleCheckboxChange(record.key)}
        />
      ),
    },
    {
      title: "Roll Dice",
      key: "roll dice",
      render: (_, record: Quest) => (
        <Button
          onClick={() => { handleRollDice(record) }}
        >
          Roll Dice
        </Button>
      )
    }
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
        <div className="w-1/3 pr-4">

          <img
            src="https://media.giphy.com/media/l0ExdMHUDKteztyfe/giphy.gif"
            alt="Capybara Fighting Monsters"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <Table
              columns={columns}
              dataSource={quests}
              pagination={false}
              className="ant-table-rounded"
              scroll={{ y: 360 }}
            />
          </div>
        </div>
      </div>

      <DiceModal visible={diceModalVisible} setVisible={setDiceModalVisible} onCancel={() => setDiceModalVisible(false)} />
    </div>
  );
}

export default QuestPage;
