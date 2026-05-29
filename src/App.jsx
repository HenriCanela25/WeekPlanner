import {DragDropProvider} from '@dnd-kit/react';
import Header from "./Header/Header.jsx";
import PlannedTasks from "./PlannedTasks/PlannedTasks.jsx";
import AddTask from "./AddTask/AddTask.jsx";
import TaskPanel from "./PlannedTasks/TaskPanel.jsx";
import { useEffect, useState } from 'react';
import styles from './App.module.css';


function App() {

    const [tasks, setTasks] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('tasks'));

        return saved ? saved : [];
    });

    const [plannedTasks, setPlannedTasks] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('plannedTasks'));

        return saved ? saved : {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
            Saturday: [],
            Sunday: []
        };
    });

    // Update planned tasks variable everytime it changes
    useEffect(() => {
        localStorage.setItem('plannedTasks', JSON.stringify(plannedTasks));
    }, [plannedTasks]);

    // Update pending tasks variable everytime it changes
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);    

    const findTaskInPlannedTasks = (taskId) => {
        for (const day of Object.keys(plannedTasks)) {
            const task = plannedTasks[day].find(t => t.id === taskId);
            
            if (task) {
                task.isDone = false; 
                return task;
            } 
        }
        return null;
    }

    const [selectedTask, setSelectedTask] = useState(null);

    const updateTask = (taskId, newDescription) => {

        // Update on planned tasks
        setPlannedTasks(prev => {

            const updated = {};

            Object.keys(prev).forEach(day => {
                updated[day] = prev[day].map(task => task.id === taskId ? {...task, description: newDescription} : task);
            })

            return updated;
        });

        // Update on pending tasks
        setTasks(prev => prev.map(task => task.id === taskId ? {...task, description: newDescription} : task));
    }

    const handleDragEnd = (event) => {
        if (event.canceled) return;

        const { source, target } = event.operation;
        if (!target) return;

        const taskId = source.id;
        const targetDay = target.id;

        const task = tasks.find(t => t.id === taskId);

        // Move task
        if (task && targetDay !== 'pending') { // Case 1: When task is in pending section
            setTasks(prev => prev.filter(t => t.id !== taskId));
            
            setPlannedTasks(prev => ({
                ...prev,
                [targetDay]: [...prev[targetDay], task]
            }));

        } else if (targetDay === 'pending' && task) { // Case 2: When task is in pending section and the user drop it in the same

            return;

        } else if (targetDay === 'pending' && !task) { // Case 3: When task is in a day and the user drop it in pending section

            setPlannedTasks(prev => {
                const task = findTaskInPlannedTasks(taskId);

                const updated = {};
                Object.keys(prev).forEach(day => {
                    updated[day] = prev[day].filter(task => task.id !== taskId);
                });

                setTasks([...tasks, task]);

                return updated;
            });

        } else { // Case 4: When task is in a day and the user drop it in another day 
            
            setPlannedTasks(prev => {

                const task = findTaskInPlannedTasks(taskId);

                const updated = {};
                Object.keys(prev).forEach(day => {
                    updated[day] = prev[day].filter(task => task.id !== taskId);
                });

                updated[targetDay] = [...updated[targetDay], task];

                return updated;
            });   
            
        }
    }

    return (
        <>
            <Header />
            <div className={selectedTask ? styles.contentShifted : styles.content}>
                <DragDropProvider onDragEnd={handleDragEnd}>
                    <PlannedTasks plannedTasks={plannedTasks} setPlannedTasks={setPlannedTasks} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
                    <AddTask tasks={tasks} setTasks={setTasks} selectedTask={selectedTask} setSelectedTask={setSelectedTask} />
                </DragDropProvider>
            </div>
            { selectedTask && ( // Side panel for task update
                <TaskPanel key={selectedTask.id} task={selectedTask} onClose={() => setSelectedTask(null)} onUpdate={updateTask} />
            )}
        </>
    );
  
}

export default App;

