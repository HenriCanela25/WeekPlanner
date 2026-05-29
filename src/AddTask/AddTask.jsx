import { useEffect, useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/react";
import styles from "./AddTask.module.css";

const Task = ({ task, deleteTask, selectedTask, setSelectedTask }) => {

    const {ref} = useDraggable({id: task.id});

    const isSelected = selectedTask?.id === task.id;

    return (
        <li ref={ref} className={`${styles.task} ${isSelected ? styles.taskSelected : ''}`} onClick={() => setSelectedTask(task)}>
            <span>{task.description}</span>
            <button disabled={isSelected} className={styles.deleteBtn} onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id)
                }}>
                <svg className="hi-trash" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path color="rgb(230, 68, 68)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h3M7 7H5m2 0 .463 12.038a1 1 0 0 0 1 .962h7.075a1 1 0 0 0 .999-.962L17 7m0 0h2m-2 0h-3m-4 0V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-4 0h4"/>
                </svg>
            </button>       
        </li>
    )
}


const AddTask = ({ tasks, setTasks, selectedTask, setSelectedTask }) => {

    const [taskInput, setTaskInput] = useState('');
    
    const [count, setCount] = useState(() => {
        const saved = parseInt(localStorage.getItem('count'));
        return saved ? saved : 1;
    });

    // Save count in local storage when it change
    useEffect(() => {
        localStorage.setItem('count', count);
    }, [count]);
    

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
                        description: task,
                        isDone: false
                    }
                ])
                setCount(count + 1);
                setTaskInput('');
            }

        }
    }

    // Delete function
    const deleteTask = (taskId) => {

        const dropSound = new Audio('../public/sounds/drop-sound.mp3');
        setTasks(prev => prev.filter(t => t.id !== taskId));
        dropSound.play();
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
                            <Task key={e.id} task={e} deleteTask={deleteTask} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default AddTask;