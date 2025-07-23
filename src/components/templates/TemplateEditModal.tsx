
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Save } from "lucide-react";
import { Template, updateTemplate } from "@/utils/templateStorage";
import { toast } from "sonner";

interface TemplateEditModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const TemplateEditModal = ({ template, isOpen, onClose, onSave }: TemplateEditModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: template?.title || '',
    description: template?.description || '',
    mediaType: template?.mediaType || 'image',
    buttonText: template?.buttonText || '',
    buttonUrl: template?.buttonUrl || ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(template?.previewUrl || '');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setFormData(prev => ({ ...prev, mediaType: 'image' }));
      } else if (file.type.startsWith('video/')) {
        setFormData(prev => ({ ...prev, mediaType: 'video' }));
        setPreviewUrl('');
      } else {
        setFormData(prev => ({ ...prev, mediaType: 'document' }));
        setPreviewUrl('');
      }
    }
  };

  const handleSave = () => {
    if (!template || !formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const updatedTemplate = {
        ...template,
        title: formData.title,
        description: formData.description,
        mediaType: formData.mediaType as 'image' | 'video' | 'document',
        buttonText: formData.buttonText,
        buttonUrl: formData.buttonUrl,
        previewUrl: previewUrl || template.previewUrl,
        fileName: selectedFile?.name || template.fileName
      };

      updateTemplate(template.id, updatedTemplate);
      toast.success("Template updated successfully!");
      onSave();
      onClose();
    } catch (error) {
      console.error("Error updating template:", error);
      toast.error("Failed to update template");
    }
  };

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter template title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter template description"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="mediaType">Media Type</Label>
            <Select value={formData.mediaType} onValueChange={(value) => handleInputChange('mediaType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Upload New Media (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  {selectedFile ? `Selected: ${selectedFile.name}` : 'Choose a new file to replace current media'}
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
              </div>
            </div>
            
            {(previewUrl || template.previewUrl) && (
              <div className="mt-4">
                <img 
                  src={previewUrl || template.previewUrl} 
                  alt="Preview"
                  className="max-w-xs rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buttonText">Button Text (Optional)</Label>
              <Input
                id="buttonText"
                value={formData.buttonText}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label htmlFor="buttonUrl">Button URL (Optional)</Label>
              <Input
                id="buttonUrl"
                type="url"
                value={formData.buttonUrl}
                onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                placeholder="Enter button URL"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateEditModal;
