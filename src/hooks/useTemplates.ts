import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Template {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'document';
  buttonText: string;
  buttonUrl: string;
  createdAt: string;
  previewUrl?: string;
  fileName?: string;
}

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTemplates = (data || []).map(template => ({
        id: template.id,
        title: template.title,
        description: template.description || '',
        mediaType: template.media_type as Template['mediaType'],
        buttonText: template.button_text,
        buttonUrl: template.button_url,
        createdAt: template.created_at,
        previewUrl: template.preview_url,
        fileName: template.file_name,
      }));

      setTemplates(formattedTemplates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (templateData: Omit<Template, 'id' | 'createdAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('templates')
        .insert([{
          user_id: user.id,
          title: templateData.title,
          description: templateData.description,
          media_type: templateData.mediaType,
          button_text: templateData.buttonText,
          button_url: templateData.buttonUrl,
          preview_url: templateData.previewUrl,
          file_name: templateData.fileName,
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchTemplates();
      
      toast({
        title: "Success",
        description: "Template saved successfully",
      });

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        mediaType: data.media_type as Template['mediaType'],
        buttonText: data.button_text,
        buttonUrl: data.button_url,
        createdAt: data.created_at,
        previewUrl: data.preview_url,
        fileName: data.file_name,
      };
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTemplate = async (id: string, updates: Partial<Template>) => {
    try {
      const { error } = await supabase
        .from('templates')
        .update({
          title: updates.title,
          description: updates.description,
          media_type: updates.mediaType,
          button_text: updates.buttonText,
          button_url: updates.buttonUrl,
          preview_url: updates.previewUrl,
          file_name: updates.fileName,
        })
        .eq('id', id);

      if (error) throw error;

      await fetchTemplates();
      
      toast({
        title: "Success",
        description: "Template updated successfully",
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchTemplates();
      
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getTemplateById = (id: string): Template | undefined => {
    return templates.find(template => template.id === id);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplateById,
    refetch: fetchTemplates,
  };
};