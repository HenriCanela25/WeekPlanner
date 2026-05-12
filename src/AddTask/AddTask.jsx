import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import styles from "./AddTask.module.css";

const Task = ({ id, description }) => {

    const {ref} = useDraggable({id});

    return (
        <li ref={ref} className={styles.task}>
            {description}
        </li>
    )
}


const AddTask = ({ tasks, setTasks }) => {

    const [taskInput, setTaskInput] = useState('');
    const [count, setCount] = useState(1);

    const handleInput = (event) => {
        setTaskInput(event.target.value);
    }

    const addTask = (event) => {

        if (event.key === 'Enter') {

            if (taskInput.trim() !== '') {

                // Create task on array
                const task = event.target.value;
                setTasks([
                    ...tasks,
                    {
                        id: count,
                        description: task
                    }
                ])
                setCount(count + 1);
                setTaskInput('');
            }

        }
    }

    // Create droppable zone ref
    const {ref} = useDroppable({id: 'pending'})

    return (
        <>
            <div className={styles.addTask}>
                <h2 className={styles.taskTitle}>Add Task</h2>
                <input onKeyDown={addTask} className={styles.inputTask} type="text" name="task" placeholder="Add a task" value={taskInput} onChange={handleInput} maxLength={255} />
            </div>
            <div ref={ref} className={styles.pendingTasks}>
                <ul className={styles.listTasks}>
                    {
                        tasks.map((e) => (
                            <Task key={e.id} id={e.id} description={e.description} />
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default AddTask;