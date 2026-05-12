import { useDraggable, useDroppable } from '@dnd-kit/react';
import styles from './PlannedTasks.module.css';

const Draggable = ({ task, deleteTask }) => {

    const {ref} = useDraggable({id: task.id});

    return (
        <li ref={ref} className={styles.task}>
            <span>{task.description}</span>
            <button className={styles.deleteBtn} onClick={() => deleteTask(task.id)}>
                <svg className="hi-trash" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path color="rgb(230, 68, 68)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h3M7 7H5m2 0 .463 12.038a1 1 0 0 0 1 .962h7.075a1 1 0 0 0 .999-.962L17 7m0 0h2m-2 0h-3m-4 0V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-4 0h4"/>
                </svg>  
            </button>            
        </li>
    );
}

const DroppableZone = ({ id, tasks, deleteTask }) => {

    const {ref} = useDroppable({id});

    return(
        <div ref={ref} className={styles.taskContainer}>
            <ul className={styles.taskList}>
            {
                tasks.map(task => (
                    <Draggable key={task.id} task={task} deleteTask={deleteTask} />
                ))
            }
            </ul>
        </div>
    );
}


function PlannedTasks({ plannedTasks, setPlannedTasks }) {

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Delete function
    const deleteTask = (taskId) => {

        const dropSound = new Audio('../public/sounds/drop-sound.mp3');
        days.map((day) => (

            setPlannedTasks(prev => ({
                ...prev,
                [day]: plannedTasks[day].filter(task => task.id !== taskId)
            }))
        ))
        dropSound.play();
    }    
    
    return (
        <div className={styles.plannedTasks}>
            {
                days.map(day => (
                    <div key={day} id={day} className={styles.taskDiv}>
                        <h2>{day}</h2>
                        <DroppableZone id={day} tasks={plannedTasks[day]} deleteTask={deleteTask} />
                    </div>
                ))
            }     
        </div>
    );
}

export default PlannedTasks;