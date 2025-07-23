
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

const TEMPLATES_KEY = 'rich_media_templates';

export const saveTemplate = (template: Omit<Template, 'id' | 'createdAt'>): Template => {
  const templates = getTemplates();
  const newTemplate: Template = {
    ...template,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  return newTemplate;
};

export const getTemplates = (): Template[] => {
  const templatesJson = localStorage.getItem(TEMPLATES_KEY);
  return templatesJson ? JSON.parse(templatesJson) : [];
};

export const getTemplateById = (id: string): Template | undefined => {
  const templates = getTemplates();
  return templates.find(template => template.id === id);
};

export const updateTemplate = (id: string, updates: Partial<Template>): void => {
  const templates = getTemplates();
  const templateIndex = templates.findIndex(template => template.id === id);
  
  if (templateIndex !== -1) {
    templates[templateIndex] = { ...templates[templateIndex], ...updates };
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }
};

export const deleteTemplate = (id: string): void => {
  const templates = getTemplates();
  const filteredTemplates = templates.filter(template => template.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filteredTemplates));
};
