
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Template } from "@/utils/templateStorage";

interface TemplatePreviewProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
}

const TemplatePreview = ({ template, isOpen, onClose }: TemplatePreviewProps) => {
  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{template.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Media Preview */}
          {template.previewUrl && template.mediaType === 'image' && (
            <div className="w-full rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={template.previewUrl} 
                alt={template.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {template.fileName && template.mediaType !== 'image' && (
            <div className="w-full p-4 bg-gray-100 rounded-lg text-center">
              <div className="text-4xl mb-2">
                {template.mediaType === 'video' ? '🎥' : '📄'}
              </div>
              <p className="text-sm text-gray-600">{template.fileName}</p>
            </div>
          )}
          
          {/* Message Content */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{template.description}</p>
          </div>
          
          {/* Button Preview */}
          {template.buttonText && (
            <div className="flex justify-center">
              <Button variant="outline" disabled>
                {template.buttonText}
              </Button>
            </div>
          )}
          
          {template.buttonUrl && (
            <p className="text-xs text-gray-500 text-center">
              URL: {template.buttonUrl}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;
