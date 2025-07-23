import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch tasks from Supabase
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTasks(data || []);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (title: string, description?: string) => {
    if (!user) {
      toast.error('Please log in to create tasks');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('chads')
        .insert({
          title,
          description,
          user_id: user.id,
          completed: false
        })
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [data, ...prev]);
      toast.success('Task created successfully');
      return data;
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
      return null;
    }
  };

  // Update a task
  const updateTask = async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) => {
    if (!user) {
      toast.error('Please log in to update tasks');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('chads')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...data } : task
      ));
      
      toast.success('Task updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!user) {
      toast.error('Please log in to delete tasks');
      return false;
    }

    try {
      const { error } = await supabase
        .from('chads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
  };

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return false;

    return await updateTask(id, { completed: !task.completed });
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    refetch: fetchTasks
  };
};