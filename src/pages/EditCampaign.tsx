import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload, FileText, Plus, X, Image } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { getCampaignById, updateCampaign, Contact } from "@/utils/campaignStorage";
import { checkAdCompliance } from "@/utils/complianceChecker";

const EditCampaign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    message: '',
    mediaUrl: '',
    buttonText: '',
    buttonUrl: ''
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  useEffect(() => {
    if (id) {
      const campaign = getCampaignById(id);
      if (campaign) {
        setFormData({
          name: campaign.name,
          platform: campaign.platform,
          message: campaign.message,
          mediaUrl: campaign.mediaUrl || '',
          buttonText: campaign.buttonText || '',
          buttonUrl: campaign.buttonUrl || ''
        });
        setContacts(campaign.contacts || []);
        
        // Set image preview if mediaUrl exists
        if (campaign.mediaUrl) {
          setImagePreviewUrl(campaign.mediaUrl);
        }
        
        setLoading(false);
      } else {
        toast.error("Campaign not found");
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setUploadedImage(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setImagePreviewUrl(url);
    
    // Update mediaUrl in campaign data
    setFormData(prev => ({ ...prev, mediaUrl: url }));

    toast.success('Image uploaded successfully');
    console.log("Uploaded image:", file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImagePreviewUrl('');
    setFormData(prev => ({ ...prev, mediaUrl: '' }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    toast.info("Image removed");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setCsvFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const parsedContacts = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim());
          const contact: Contact = { name: '', phone: '', email: '' };
          headers.forEach((header, index) => {
            if (header.toLowerCase().includes('name')) {
              contact.name = values[index] || '';
            } else if (header.toLowerCase().includes('phone')) {
              contact.phone = values[index] || '';
            } else if (header.toLowerCase().includes('email')) {
              contact.email = values[index] || '';
            }
          });
          return contact;
        }).filter(contact => contact.email || contact.phone);
        
        setContacts(parsedContacts);
        toast.success(`Successfully uploaded ${parsedContacts.length} contacts`);
      };
      reader.readAsText(file);
    } else {
      toast.error("Please upload a valid CSV file");
    }
  };

  const handleAddContact = () => {
    if (newContact.name && (newContact.email || newContact.phone)) {
      setContacts(prev => [...prev, newContact]);
      setNewContact({ name: '', phone: '', email: '' });
      toast.success("Contact added successfully");
    } else {
      toast.error("Please fill in name and at least one contact method");
    }
  };

  const handleRemoveContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const handleNewContactChange = (field: string, value: string) => {
    setNewContact(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    if (!formData.name || !formData.platform || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (contacts.length === 0) {
      toast.error("Please add at least one contact");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check compliance
      const complianceResult = await checkAdCompliance(formData.message, formData.platform);
      
      const updates = {
        name: formData.name,
        platform: formData.platform,
        message: formData.message,
        mediaUrl: formData.mediaUrl,
        buttonText: formData.buttonText,
        buttonUrl: formData.buttonUrl,
        contacts: contacts,
        status: complianceResult.isCompliant ? 'Active' as const : 'Rejected' as const,
        complianceStatus: complianceResult.isCompliant ? 'Approved' : 'Rejected',
        rejectionReason: complianceResult.isCompliant ? undefined : complianceResult.rejectionReason,
        targetAudience: `${contacts.length} contacts`
      };

      updateCampaign(id!, updates);
      
      if (complianceResult.isCompliant) {
        toast.success("Campaign updated successfully!");
      } else {
        toast.error(`Campaign rejected: ${complianceResult.rejectionReason}`);
      }
      
      navigate(`/campaign/${id}`);
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/campaign/${id}`)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaign
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
          <p className="text-gray-600 mt-2">Update your campaign settings and content</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Update your campaign settings and message content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform *</Label>
                  <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="messenger">Facebook Messenger</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message Content *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Enter your message content..."
                  rows={6}
                />
              </div>

              {/* Ad Image Upload Section */}
              <div>
                <Label>Ad Image (Optional)</Label>
                <div className="mt-2">
                  {uploadedImage || imagePreviewUrl ? (
                    <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded">
                            <Image className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-green-800">
                              {uploadedImage ? uploadedImage.name : 'Current Image'}
                            </p>
                            {uploadedImage && (
                              <p className="text-sm text-green-600">
                                {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleRemoveImage}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {imagePreviewUrl && (
                        <div className="mt-3">
                          <img 
                            src={imagePreviewUrl} 
                            alt="Ad preview" 
                            className="max-w-full h-32 object-contain rounded border"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload an image for your ad
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Max file size: 10MB. Supports JPG, PNG, GIF
                      </p>
                      <input
                        type="file"
                        ref={imageInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="buttonText">Button Text (Optional)</Label>
                  <Input
                    id="buttonText"
                    placeholder="Enter button text"
                    value={formData.buttonText}
                    onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="buttonUrl">Button URL (Optional)</Label>
                  <Input
                    id="buttonUrl"
                    type="url"
                    placeholder="Enter button URL"
                    value={formData.buttonUrl}
                    onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Update your contact list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Upload CSV File</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {csvFile ? `Selected: ${csvFile.name}` : 'Upload new CSV file with contact details'}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      CSV format: name,email,phone (headers required)
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".csv"
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose CSV File
                    </Button>
                  </div>
                </div>
              </div>

              {/* Manual contact entry */}
              <div className="border-t pt-6">
                <Label className="text-base font-medium">Add Contacts Manually</Label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <Input
                    placeholder="Name"
                    value={newContact.name}
                    onChange={(e) => handleNewContactChange('name', e.target.value)}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => handleNewContactChange('email', e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={newContact.phone}
                    onChange={(e) => handleNewContactChange('phone', e.target.value)}
                  />
                  <Button type="button" onClick={handleAddContact}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Contact list */}
              {contacts.length > 0 && (
                <div>
                  <Label className="text-base font-medium">Contacts ({contacts.length})</Label>
                  <div className="max-h-60 overflow-y-auto border rounded-lg mt-2">
                    {contacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-600">
                            {contact.email && <span>{contact.email}</span>}
                            {contact.email && contact.phone && <span> • </span>}
                            {contact.phone && <span>{contact.phone}</span>}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => navigate(`/campaign/${id}`)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSubmitting}>
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditCampaign;
