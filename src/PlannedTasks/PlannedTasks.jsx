import { useDroppable } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { CollisionPriority } from '@dnd-kit/abstract';
import styles from './PlannedTasks.module.css';

const Draggable = ({ task, day, index, deleteTask, completeTask, selectedTask, setSelectedTask }) => {

    const {ref, isDragging} = useSortable({
        id: task.id,
        index,
        type: 'item',
        accept: 'item',
        group: day
    });

    const isSelected = selectedTask?.id === task.id;

    return (
        <li ref={ref} data-dragging={isDragging} className={`${styles.task} ${isSelected ? styles.taskSelected : ''}`} onClick={() => setSelectedTask(task)}>
            <div className={styles.left_part_task}>
                <div className={`${styles.circle} ${task.isDone ? styles.circleDone : ''}`} onClick={(e) => {
                        e.stopPropagation();
                        completeTask(task.id)
                    }}>
                    <svg
                        className={styles.checkIcon}
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="1.5,5 4,7.5 8.5,2.5" />
                    </svg>                    
                </div>
                <span className={task.isDone ? styles.taskDone : ''}>{task.description}</span>
            </div>
            <button disabled={isSelected} 
                    className={styles.deleteBtn} 
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id)
                    }}
            >
                <svg className="hi-trash" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path color="rgb(230, 68, 68)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h3M7 7H5m2 0 .463 12.038a1 1 0 0 0 1 .962h7.075a1 1 0 0 0 .999-.962L17 7m0 0h2m-2 0h-3m-4 0V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-4 0h4"/>
                </svg>  
            </button>            
        </li>
    );
}

const DroppableZone = ({ id, tasks, deleteTask, completeTask, selectedTask, setSelectedTask }) => {

    const {ref, isDropTarget} = useDroppable({
        id,
        type: 'column',
        accept: 'item',
        collisionPriority: CollisionPriority.Low,
    });

    return(
        <div ref={ref} className={`${styles.taskContainer} ${isDropTarget ? styles.active : ''}`}>
            <ul className={styles.taskList}>
            {
                tasks.map((task, index) => (
                    <Draggable key={task.id} day={id} task={task} index={index} deleteTask={deleteTask} completeTask={completeTask} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
                ))
            }
            </ul>
        </div>
    );
}


function PlannedTasks({ plannedTasks, setPlannedTasks, selectedTask, setSelectedTask }) {

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const weekEnds = ['Saturday', 'Sunday'];

    // Delete task function
    const deleteTask = (taskId) => {

        const dropSound = new Audio('../public/sounds/drop-sound.mp3');
        days.map((day) => (

            setPlannedTasks(prev => ({
                ...prev,
                [day]: plannedTasks[day].filter(task => task.id !== taskId)
            }))
        ))
        dropSound.play();
    };

    // Complete task function
    const completeTask = (taskId) => {
        
        setPlannedTasks(prev => {
            const updated = {};

            Object.keys(prev).forEach(day => {
                updated[day] = prev[day].map(task => task.id === taskId ? {...task, isDone: !task.isDone} : task);
            });

            return updated;
        });
    };
    
    return (
        <div className={styles.plannedTasks}>
            {
                days.filter(day => !weekEnds.includes(day)).map(day => (
                    <div key={day} id={day} className={styles.taskDiv}>
                        <h2>{day}</h2>
                        <DroppableZone id={day} tasks={plannedTasks[day]} deleteTask={deleteTask} completeTask={completeTask} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
                    </div>
                ))
            }
            {
                <div className={styles.weekendWrapper}>
                    {weekEnds.map(day => (
                        <div key={day} id={day} className={styles.weekEndTaskDiv}>
                            <h2>{day}</h2>
                            <DroppableZone id={day} tasks={plannedTasks[day]} deleteTask={deleteTask} completeTask={completeTask} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
                        </div>                    
                    ))}
                </div>
            }
        </div>
    );
}

export default PlannedTasks;