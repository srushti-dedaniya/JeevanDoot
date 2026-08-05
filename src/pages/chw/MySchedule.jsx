import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useNotification } from '../../hooks/useNotification';

const SIDEBAR = {
  items: [
    { label: 'Dashboard', to: '/chw/dashboard', icon: 'dashboard', end: true },
    { label: 'Household Registration', to: '/chw/households', icon: 'home_work' },
    { label: 'Health Survey', to: '/chw/survey', icon: 'fact_check' },
    { label: 'Field Reports', to: '/chw/reports', icon: 'description' },
    { label: 'Community Education', to: '/chw/education', icon: 'school' },
    { label: 'My Schedule', to: '/chw/schedule', icon: 'event' },
  ],
};

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const INITIAL_TASKS = [
  { id: 1, day: 'Mon', time: '10:00', task: 'Follow-up home visit — Meera Sharma', type: 'visit', done: false },
  { id: 2, day: 'Tue', time: '09:00', task: 'Vaccination drive — Palia School', type: 'drive', done: false },
  { id: 3, day: 'Wed', time: '14:00', task: 'New household registration — Devgram', type: 'registration', done: false },
  { id: 4, day: 'Thu', time: '11:00', task: 'Health survey — Amroli cluster', type: 'survey', done: false },
  { id: 5, day: 'Fri', time: '15:00', task: 'Handwashing demo — Kanker East', type: 'education', done: false },
];

const TYPE_STYLES = {
  visit: 'bg-primary-fixed text-on-primary-fixed-variant',
  drive: 'bg-tertiary-fixed-dim text-tertiary',
  registration: 'bg-secondary-container text-on-secondary-container',
  survey: 'bg-primary-container text-on-primary-container',
  education: 'bg-error-container text-on-error-container',
};

export default function MySchedule() {
  const { notify } = useNotification();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedDay, setSelectedDay] = useState('Mon');
  const [newTask, setNewTask] = useState({ time: '10:00', task: '' });

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    notify({ type: 'success', message: 'Task updated' });
  };

  const addTask = () => {
    if (!newTask.task.trim()) return;
    const entry = {
      id: Date.now(),
      day: selectedDay,
      time: newTask.time,
      task: newTask.task,
      type: 'visit',
      done: false,
    };
    setTasks((prev) => [...prev, entry]);
    setNewTask({ time: '10:00', task: '' });
    notify({ type: 'success', message: 'Task added to schedule' });
  };

  const dayTasks = tasks.filter((t) => t.day === selectedDay);

  return (
    <DashboardLayout
      sidebarProps={SIDEBAR}
      headerProps={{ title: 'My Schedule', subtitle: 'Plan your field visits' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Weekly Planner" icon="calendar_month">
            <div className="flex gap-3 mb-6">
              {WEEK.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 py-3 rounded-lg font-headline font-bold transition-all ${
                    selectedDay === day ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-low text-on-surface-variant border border-outline-variant'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            {dayTasks.length === 0 ? (
              <p className="text-center text-on-surface-variant py-10">No tasks scheduled for {selectedDay}.</p>
            ) : (
              <div className="space-y-3">
                {dayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 bg-surface-container-low rounded-lg p-4">
                    <div className="text-center min-w-[70px]">
                      <p className="font-headline font-bold text-primary">{task.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-label-md capitalize ${TYPE_STYLES[task.type] ?? TYPE_STYLES.visit}`}>
                      {task.type}
                    </span>
                    <p className={`flex-1 font-medium ${task.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                      {task.task}
                    </p>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.done ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant hover:border-primary'
                      }`}
                      aria-label="Toggle task"
                    >
                      {task.done && <span className="material-symbols-outlined text-sm">check</span>}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Add Task" icon="add_task">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-md font-semibold text-on-surface ml-1 mb-2">Day</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full h-12 bg-surface-container-low border border-outline-variant rounded-lg px-3"
                  >
                    {WEEK.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-label-md font-semibold text-on-surface ml-1 mb-2">Time</label>
                  <input
                    type="time"
                    value={newTask.time}
                    onChange={(e) => setNewTask((t) => ({ ...t, time: e.target.value }))}
                    className="w-full h-12 px-3 bg-surface-container-low border border-outline-variant rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-label-md font-semibold text-on-surface ml-1 mb-2">Task</label>
                <input
                  value={newTask.task}
                  onChange={(e) => setNewTask((t) => ({ ...t, task: e.target.value }))}
                  placeholder="e.g. Home visit — Raj Kumar"
                  className="w-full h-12 px-4 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button fullWidth onClick={addTask} icon="add_task">Add to Schedule</Button>
            </div>
          </Card>

          <Card title="This Week" icon="insights">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-label-md">Tasks scheduled</span>
                <span className="font-bold text-on-surface">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-label-md">Completed</span>
                <span className="font-bold text-on-surface">{tasks.filter((t) => t.done).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-label-md">Pending</span>
                <span className="font-bold text-on-surface">{tasks.filter((t) => !t.done).length}</span>
              </div>
              <div className="mt-3">
                <Badge variant="success" icon="check_circle">On track this week</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
