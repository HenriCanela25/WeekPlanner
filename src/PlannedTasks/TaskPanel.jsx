import { useState } from "react";
import styles from './TaskPanel.module.css';

const TaskPanel = ({ task, onClose, onUpdate }) => {

    const [description, setDescription] = useState(task.description);   

    const handleSave = () => {
        onUpdate(task.id, description);
        onClose();
    }

    return (
        <div className={styles.panel}>
            <button className={styles.closeBtn} onClick={onClose}>x</button>
            <h3>Edit Task</h3>
            <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button className={styles.saveBtn} onClick={handleSave}>Save</button>
        </div>
    )
}

export default TaskPanel;