import { Button, message, Modal } from "antd";
import { useEffect, useState } from "react";
import DiceRoller from "./diceRoller";
import { rollDice } from "../../services/diceRollService";
import { IQuest } from "../../models/Quest";

interface DiceModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onCancel: () => void;
    quest?: IQuest;
}

const DiceModal: React.FC<DiceModalProps> = ({ quest, visible, setVisible, onCancel }) => {
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [totalScore, setTotalScore] = useState<number | null>(null);
    const [rollCompleted, setRollCompleted] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    useEffect(() => {
        setButtonDisabled(false);
        setRollCompleted(false);
    }, [quest]);

    useEffect(() => {
        const roll = async () => {
            try {
                if (!quest) {
                    message.error("Quest is not found");
                    return
                }
                if (totalScore === null) {
                    message.error("Please roll the dice first!");
                    return;
                }
                const response = await rollDice(quest, totalScore);
                if (response.respCode !== '000') {
                    message.error(response.respDesc);
                }
                setVisible(true);
            }
            catch (error) {
                message.error("Failed to roll dice" + error);
            }
        }
        if (rollCompleted)
            roll();
    }, [rollCompleted]);

    const handleRollDice = () => {
        setIsRolling(true);
        setButtonDisabled(true);
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
                    <DiceRoller isRolling={isRolling} setIsRolling={setIsRolling}
                        setTotalScore={setTotalScore} totalScore={totalScore} setRollCompleted={setRollCompleted}
                    />
                    <Button onClick={handleRollDice} disabled={buttonDisabled}>Roll</Button>
                </div>

            </Modal>
        </>
    );
};

export default DiceModal;
