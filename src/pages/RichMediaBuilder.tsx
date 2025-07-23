import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Image, Video, FileText, Save, X, Sparkles } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useTemplates } from "@/hooks/useTemplates";
import { generateAdContent } from "@/utils/aiAdGenerator";

const RichMediaBuilder = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveTemplate } = useTemplates();
  const [mediaData, setMediaData] = useState({
    title: '',
    description: '',
    mediaType: 'image',
    buttonText: '',
    buttonUrl: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setMediaData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateContent = async () => {
    if (!mediaData.title) {
      toast.error("Please enter a title first");
      return;
    }

    setIsGeneratingContent(true);
    try {
      const result = await generateAdContent(
        mediaData.title, 
        mediaData.description || "Create engaging rich media content", 
        "whatsapp"
      );
      
      // Extract title and description from generated content
      const lines = result.message.split('\n').filter(line => line.trim());
      if (lines.length >= 2) {
        setMediaData(prev => ({
          ...prev,
          description: lines.slice(1).join('\n').replace(/[📱💬📨📧🌟✨🎯💫🚀✅]/g, '').trim()
        }));
      }
      
      toast.success("AI-generated content applied!");
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type based on selected media type
    const isValidType = (() => {
      switch (mediaData.mediaType) {
        case 'image':
          return file.type.startsWith('image/');
        case 'video':
          return file.type.startsWith('video/');
        case 'document':
          return file.type === 'application/pdf' || file.type.startsWith('application/') || file.type.startsWith('text/');
        default:
          return false;
      }
    })();

    if (!isValidType) {
      toast.error(`Please upload a valid ${mediaData.mediaType} file`);
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadedFile(file);
    
    // Create preview URL for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl('');
    }

    toast.success(`${mediaData.mediaType} uploaded successfully`);
    console.log("Uploaded file:", file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.info("File removed");
  };

  const handleSaveTemplate = async () => {
    if (!mediaData.title || !mediaData.description) {
      toast.error("Please fill in title and description");
      return;
    }
    
    try {
      const savedTemplate = await saveTemplate({
        title: mediaData.title,
        description: mediaData.description,
        mediaType: mediaData.mediaType as 'image' | 'video' | 'document',
        buttonText: mediaData.buttonText,
        buttonUrl: mediaData.buttonUrl,
        previewUrl: previewUrl,
        fileName: uploadedFile?.name
      });
      
      console.log("Template saved:", savedTemplate);
      
      // Reset form
      setMediaData({
        title: '',
        description: '',
        mediaType: 'image',
        buttonText: '',
        buttonUrl: ''
      });
      setUploadedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl('');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Redirect to templates page
      navigate('/templates');
    } catch (error) {
      console.error("Failed to save template:", error);
    }
  };

  const getAcceptedFileTypes = () => {
    switch (mediaData.mediaType) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'document':
        return '.pdf,.doc,.docx,.txt,.rtf';
      default:
        return '*/*';
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
          <h1 className="text-3xl font-bold text-gray-900">Rich Media Builder</h1>
          <p className="text-gray-600 mt-2">Create engaging multimedia content for your campaigns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Media Configuration</CardTitle>
              <CardDescription>Set up your rich media content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="title">Title</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateContent}
                    disabled={isGeneratingContent}
                  >
                    {isGeneratingContent ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Generate
                      </>
                    )}
                  </Button>
                </div>
                <Input
                  id="title"
                  value={mediaData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter media title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={mediaData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter media description"
                  rows={4}
                />
              </div>

              <div>
                <Label>Media Type</Label>
                <div className="flex space-x-4 mt-2">
                  <Button
                    variant={mediaData.mediaType === 'image' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('mediaType', 'image')}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Image
                  </Button>
                  <Button
                    variant={mediaData.mediaType === 'video' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('mediaType', 'video')}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <Button
                    variant={mediaData.mediaType === 'document' ? 'default' : 'outline'}
                    onClick={() => handleInputChange('mediaType', 'document')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Document
                  </Button>
                </div>
              </div>

              <div>
                <Label>Upload Media</Label>
                <div className="mt-2">
                  {uploadedFile ? (
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded">
                            {mediaData.mediaType === 'image' && <Image className="h-4 w-4 text-green-600" />}
                            {mediaData.mediaType === 'video' && <Video className="h-4 w-4 text-green-600" />}
                            {mediaData.mediaType === 'document' && <FileText className="h-4 w-4 text-green-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-green-800">{uploadedFile.name}</p>
                            <p className="text-sm text-green-600">
                              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload your {mediaData.mediaType} file
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Max file size: 10MB
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept={getAcceptedFileTypes()}
                        className="hidden"
                      />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buttonText">Button Text</Label>
                  <Input
                    id="buttonText"
                    value={mediaData.buttonText}
                    onChange={(e) => handleInputChange('buttonText', e.target.value)}
                    placeholder="Call to action text"
                  />
                </div>
                <div>
                  <Label htmlFor="buttonUrl">Button URL</Label>
                  <Input
                    id="buttonUrl"
                    value={mediaData.buttonUrl}
                    onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <Button onClick={handleSaveTemplate} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>See how your rich media will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center overflow-hidden">
                  {previewUrl && mediaData.mediaType === 'image' ? (
                    <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  ) : previewUrl && mediaData.mediaType === 'video' ? (
                    <video src={previewUrl} controls className="max-w-full max-h-full" />
                  ) : uploadedFile && mediaData.mediaType === 'document' ? (
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{uploadedFile.name}</p>
                    </div>
                  ) : (
                    <span className="text-gray-500">Media Preview</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {mediaData.title || "Your title here"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {mediaData.description || "Your description will appear here"}
                </p>
                {mediaData.buttonText && (
                  <Button className="w-full">
                    {mediaData.buttonText}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RichMediaBuilder;