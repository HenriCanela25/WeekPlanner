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

    const handleDragEnd = (event) => {
        if (event.canceled) return;

        const { source, target } = event.operation;
        if (!target) return;

        const taskId = source.id;
        const targetDay = target.id;

        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        setTasks(prev => prev.filter(t => t.id !== taskId));

        setPlannedTasks(prev => ({
            ...prev,
            [targetDay]: [...prev[targetDay], task]
        }));
    }

    return (
        <>
            <Header />
            <DragDropProvider onDragEnd={handleDragEnd}>
                <PlannedTasks plannedTasks={plannedTasks} />
                <AddTask tasks={tasks} setTasks={setTasks} />
            </DragDropProvider>
        </>
    );
  
}

export default App;

