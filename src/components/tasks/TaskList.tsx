import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useTasks, Task } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';

const TaskList = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const { user } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [editTask, setEditTask] = useState({ title: '', description: '' });

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    const success = await addTask(newTask.title, newTask.description);
    if (success) {
      setNewTask({ title: '', description: '' });
      setShowAddForm(false);
    }
  };

  const handleEditTask = async (id: string) => {
    if (!editTask.title.trim()) return;
    
    const success = await updateTask(id, {
      title: editTask.title,
      description: editTask.description
    });
    
    if (success) {
      setEditingTask(null);
      setEditTask({ title: '', description: '' });
    }
  };

  const startEdit = (task: Task) => {
    setEditingTask(task.id);
    setEditTask({ title: task.title, description: task.description || '' });
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTask({ title: '', description: '' });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">Please log in to manage your tasks</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading tasks...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-3">
                <Input
                  placeholder="Task title..."
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
                <Textarea
                  placeholder="Task description (optional)..."
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleAddTask} disabled={!newTask.title.trim()}>
                    <Check className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No tasks yet. Create your first task!</p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg transition-all ${
                    task.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
                  }`}
                >
                  {editingTask === task.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editTask.title}
                        onChange={(e) => setEditTask(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <Textarea
                        value={editTask.description}
                        onChange={(e) => setEditTask(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleEditTask(task.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </h3>
                          <Badge variant={task.completed ? 'secondary' : 'default'}>
                            {task.completed ? 'Completed' : 'Active'}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                            {task.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400">
                          Created: {new Date(task.created_at).toLocaleDateString()} at{' '}
                          {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(task)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskList;