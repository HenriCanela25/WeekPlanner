import { useDraggable, useDroppable } from '@dnd-kit/react';
import styles from './PlannedTasks.module.css';

const Draggable = ({ task }) => {

    const {ref} = useDraggable({id: task.id});

    return (
        <li ref={ref} className={styles.task}>{task.description}</li>
    );
}

const DroppableZone = ({ id, tasks }) => {

    const {ref} = useDroppable({id});

    return(
        <div ref={ref} className={styles.taskContainer}>
            <ul className={styles.taskList}>
            {
                tasks.map(task => (
                    <Draggable key={task.id} task={task} />
                ))
            }
            </ul>
        </div>
    );
}


function PlannedTasks({ plannedTasks }) {

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
        <div className={styles.plannedTasks}>
            {
                days.map(day => (
                    <div key={day} id={day} className={styles.taskDiv}>
                        <h2>{day}</h2>
                        <DroppableZone id={day} tasks={plannedTasks[day]} />
                    </div>
                ))
            }     
        </div>
    );
}

export default PlannedTasks;