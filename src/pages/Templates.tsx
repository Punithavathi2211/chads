
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2, Eye, Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getTemplates, deleteTemplate, Template } from "@/utils/templateStorage";
import TemplatePreview from "@/components/templates/TemplatePreview";
import TemplateEditModal from "@/components/templates/TemplateEditModal";

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editTemplate, setEditTemplate] = useState<Template | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const savedTemplates = getTemplates();
    setTemplates(savedTemplates);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      deleteTemplate(id);
      loadTemplates();
      toast.success("Template deleted successfully");
    }
  };

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleEdit = (template: Template) => {
    setEditTemplate(template);
    setIsEditOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewTemplate(null);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setEditTemplate(null);
  };

  const handleSaveEdit = () => {
    loadTemplates(); // Reload templates after edit
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'document':
        return '📄';
      default:
        return '📁';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rich Media Templates</h1>
              <p className="text-gray-600 mt-2">Manage your saved rich media templates</p>
            </div>
            
            <Button onClick={() => navigate('/rich-media-builder')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Template
            </Button>
          </div>
        </div>

        {templates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates yet</h3>
              <p className="text-gray-600 mb-6">Create your first rich media template to get started</p>
              <Button onClick={() => navigate('/rich-media-builder')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getMediaTypeIcon(template.mediaType)}</span>
                      <div>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {template.mediaType} • {formatDate(template.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {template.previewUrl && template.mediaType === 'image' && (
                    <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={template.previewUrl} 
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {template.fileName && (
                    <div className="text-sm text-gray-600">
                      📎 {template.fileName}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {template.description}
                  </p>
                  
                  {template.buttonText && (
                    <div className="text-sm">
                      <span className="font-medium">Button:</span> {template.buttonText}
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal */}
      <TemplatePreview 
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
      />

      {/* Edit Modal */}
      <TemplateEditModal 
        template={editTemplate}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Templates;
