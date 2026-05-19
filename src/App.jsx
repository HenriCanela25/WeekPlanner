import {DragDropProvider} from '@dnd-kit/react';
import Header from "./Header/Header.jsx";
import PlannedTasks from "./PlannedTasks/PlannedTasks.jsx";
import AddTask from "./AddTask/AddTask.jsx";
import { useState } from 'react';


function App() {

    const [tasks, setTasks] = useState([]);
    const [plannedTasks, setPlannedTasks] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });

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
            <DragDropProvider onDragEnd={handleDragEnd}>
                <PlannedTasks plannedTasks={plannedTasks} setPlannedTasks={setPlannedTasks} />
                <AddTask tasks={tasks} setTasks={setTasks} />
            </DragDropProvider>
        </>
    );
  
}

export default App;

