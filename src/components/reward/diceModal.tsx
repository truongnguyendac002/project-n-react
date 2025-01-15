import {  Button, Modal } from "antd";
import { useState } from "react";
import DiceRoller from "./diceRoller";

interface DiceModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onCancel: () => void;
}

const DiceModal: React.FC<DiceModalProps> = ({ visible, setVisible, onCancel }) => {
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [totalScore, setTotalScore] = useState<number>(0);

    const handleRollDice = () => {
        setIsRolling(true);
        setVisible(true);
    }

    return (
        <>
            <Modal
                title={"Roll the dice"}
                open={visible}
                onCancel={onCancel}
                footer={null}
            >
                <div className="my-4">
                <DiceRoller isRolling={isRolling} setIsRolling={setIsRolling} totalScore={totalScore} setTotalScore={setTotalScore} />

                </div>
                <Button
                    onClick={() => { handleRollDice() }}
                    disabled={isRolling}
                >
                    Roll Dice
                </Button>
            </Modal>
        </>
    );
};

export default DiceModal;
