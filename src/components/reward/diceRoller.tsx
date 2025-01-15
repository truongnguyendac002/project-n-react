import React, { useEffect, useState } from "react";
import "../../assets/DiceRoller.css";
import { Modal } from "antd";
import Confetti from "react-confetti";

interface DiceRollerProps {
  isRolling: boolean;
  setIsRolling: (isRolling: boolean) => void;
  totalScore: number;
  setTotalScore: (totalScore: number) => void;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ isRolling, setIsRolling, totalScore, setTotalScore }) => {
  const [diceTransforms, setDiceTransforms] = useState<string[]>([
    "rotateX(0deg) rotateY(0deg)",
    "rotateX(0deg) rotateY(0deg)",
    "rotateX(0deg) rotateY(0deg)",
  ]);
  const [showConfetti, setShowConfetti] = useState(false);


  useEffect(() => {
    const diceTransforming = (newTransforms: string[]): void => {
      newTransforms = diceTransforms.map(() => {
        const randomX = Math.floor(Math.random() * 360);
        const randomY = Math.floor(Math.random() * 360);
        return `rotateX(${randomX}deg) rotateY(${randomY}deg)`;
      });
      setDiceTransforms([...newTransforms]);
    };
    const rollDice = () => {
      setIsRolling(true);
      const newTransforms: string[] = [];
      let newTotal = 0;

      diceTransforming(newTransforms);
      const interval = setInterval(() => {
        diceTransforming(newTransforms);
      }, 1000);
      const results = diceTransforms.map(() => Math.floor(Math.random() * 6) + 1);
      newTotal = results.reduce((acc, value) => acc + value, 0);

      setTimeout(() => {
        clearInterval(interval);
        const finalTransforms = results.map((value) => {
          switch (value) {
            case 1:
              return "rotateX(0deg) rotateY(0deg)";
            case 6:
              return "rotateX(180deg) rotateY(0deg)";
            case 2:
              return "rotateX(-90deg) rotateY(0deg)";
            case 5:
              return "rotateX(90deg) rotateY(0deg)";
            case 3:
              return "rotateX(0deg) rotateY(90deg)";
            case 4:
              return "rotateX(0deg) rotateY(-90deg)";
            default:
              return "";
          }
        });

        setDiceTransforms(finalTransforms);
        setTimeout(() => {
          setShowConfetti(true);
        }, 1500);
      }, 3000); // Dừng sau 2 giây
      setTotalScore(newTotal);
      setIsRolling(false);
    };
    if (isRolling) {
      rollDice();
    }
  }, [diceTransforms, isRolling, setIsRolling, setTotalScore]);

  return (
    <div className="">
      <div className="flex justify-center dice-wrapper">
        {diceTransforms.map((transform, index) => (
          <div
            key={index}
            className={`my-4 mx-6 dice ${isRolling ? "rolling" : ""}`}
            style={{ transform }}
          >
            <div className="face front"></div>
            <div className="face back"></div>
            <div className="face top"></div>
            <div className="face bottom"></div>
            <div className="face right"></div>
            <div className="face left"></div>
          </div>
        ))}
      </div>
      <Modal
        title="🎉 Chúc mừng!"
        open={showConfetti}
        onCancel={() => setShowConfetti(false)}
        footer={null}
        className="text-center"
      >
        <div className="text-lg font-bold mb-4">Bạn đã roll được {totalScore} điểm!</div>
      </Modal>
      {showConfetti &&
        <div className="fixed top-0 left-0 w-full h-full z-50">
          <Confetti
            numberOfPieces={200}
            gravity={0.5}
            initialVelocityX={{ min: -20, max: 20 }}
            initialVelocityY={{ min: -50, max: -10 }}
            confettiSource={{
              x: 0,
              y: window.innerHeight,
              w: window.innerWidth,
              h: 0,
            }}
          />
        </div>
      }
    </div>
  );
};

export default DiceRoller;
