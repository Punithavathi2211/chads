import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, X, Upload, FileText, Sparkles, Image, Send } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { saveCampaign, Contact } from "@/utils/campaignStorage";
import { checkAdCompliance } from "@/utils/complianceChecker";
import { getTemplates, Template } from "@/utils/templateStorage";
import { generateAdContent } from "@/utils/aiAdGenerator";
import { sendCampaignToContacts, validateContact } from "@/utils/messagingService";

const NewCampaign = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [campaignData, setCampaignData] = useState({
    name: '',
    platform: 'whatsapp',
    message: '',
    mediaUrl: '',
    buttonText: '',
    buttonUrl: ''
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [isGeneratingAd, setIsGeneratingAd] = useState(false);
  const [sendImmediately, setSendImmediately] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const savedTemplates = getTemplates();
    setTemplates(savedTemplates);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setCampaignData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId && templateId !== 'none') {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setCampaignData(prev => ({
          ...prev,
          message: template.description,
          mediaUrl: template.previewUrl || '',
          buttonText: template.buttonText,
          buttonUrl: template.buttonUrl
        }));
        
        // Set the image preview if template has an image
        if (template.previewUrl) {
          setImagePreviewUrl(template.previewUrl);
        }
        
        toast.success("Template applied successfully");
      }
    }
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
    setCampaignData(prev => ({ ...prev, mediaUrl: url }));

    toast.success('Image uploaded successfully');
    console.log("Uploaded image:", file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl('');
    }
    setCampaignData(prev => ({ ...prev, mediaUrl: '' }));
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
    toast.info("Image removed");
  };

  const handleGenerateAd = async () => {
    if (!campaignData.name) {
      toast.error("Please enter a campaign name first");
      return;
    }

    setIsGeneratingAd(true);
    try {
      const result = await generateAdContent(
        campaignData.name, 
        campaignData.message || "Create an engaging campaign", 
        campaignData.platform
      );
      
      setCampaignData(prev => ({
        ...prev,
        message: result.message
      }));
      
      toast.success("AI-generated ad content applied!");
    } catch (error) {
      toast.error("Failed to generate ad content");
    } finally {
      setIsGeneratingAd(false);
    }
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

  const sendCampaignMessages = async (campaign: any) => {
    setIsSending(true);
    setSendingProgress({ current: 0, total: contacts.length });
    
    try {
      console.log('🔍 Checking contacts for validation:', contacts);
      
      // Validate contacts for the selected platform
      const validContacts = contacts.filter(contact => {
        const isValid = validateContact(contact, campaignData.platform);
        console.log(`📋 Contact validation for ${contact.name}:`, {
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          platform: campaignData.platform,
          isValid: isValid
        });
        return isValid;
      });
      
      console.log(`📊 Contact validation results: ${validContacts.length}/${contacts.length} valid contacts`);
      
      if (validContacts.length === 0) {
        console.error('❌ No valid contacts found for platform:', campaignData.platform);
        toast.error(`No valid contacts found for ${campaignData.platform}. Please check contact information.`);
        return;
      }
      
      if (validContacts.length < contacts.length) {
        const skippedCount = contacts.length - validContacts.length;
        const missingField = campaignData.platform === 'whatsapp' || campaignData.platform === 'sms' ? 'phone numbers' : 'email addresses';
        console.warn(`⚠️ ${skippedCount} contacts skipped due to missing ${missingField}`);
        toast.warning(`${skippedCount} contacts skipped due to missing ${missingField}`);
      }
      
      console.log(`🚀 Starting to send campaign "${campaign.name}" to ${validContacts.length} contacts via ${campaignData.platform}`);
      
      toast.info(`📤 Sending messages to ${validContacts.length} contacts...`);
      
      // Send campaign with progress tracking
      const sendResult = await sendCampaignToContacts(campaign, validContacts);
      
      // Update campaign with send statistics
      const updatedStats = {
        sent: sendResult.totalSent,
        delivered: sendResult.successful,
        opened: Math.floor(sendResult.successful * 0.7), // Simulate 70% open rate
        ctr: `${Math.floor(sendResult.successful * 0.15)}%` // Simulate 15% CTR
      };
      
      // Update the campaign in storage
      const campaigns = JSON.parse(localStorage.getItem('chads_campaigns') || '[]');
      const campaignIndex = campaigns.findIndex((c: any) => c.id === campaign.id);
      if (campaignIndex !== -1) {
        campaigns[campaignIndex] = { ...campaigns[campaignIndex], ...updatedStats };
        localStorage.setItem('chads_campaigns', JSON.stringify(campaigns));
      }
      
      // Show detailed results
      if (sendResult.successful > 0) {
        toast.success(`🎉 Campaign sent successfully! ${sendResult.successful}/${sendResult.totalSent} messages delivered.`);
        console.log(`✅ Campaign "${campaign.name}" sent successfully:`, {
          totalSent: sendResult.totalSent,
          successful: sendResult.successful,
          failed: sendResult.failed,
          platform: campaignData.platform
        });
      } else {
        toast.error(`❌ Failed to send campaign. ${sendResult.failed}/${sendResult.totalSent} messages failed.`);
        console.error(`❌ Campaign "${campaign.name}" failed:`, sendResult);
      }
      
    } catch (error) {
      console.error("💥 Error sending campaign:", error);
      toast.error("Failed to send campaign messages");
    } finally {
      setIsSending(false);
      setSendingProgress({ current: 0, total: 0 });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignData.name || !campaignData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (contacts.length === 0) {
      toast.error("Please add at least one contact");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 1: Check compliance
      toast.info("🔍 Checking campaign compliance...");
      const complianceResult = await checkAdCompliance(campaignData.message, campaignData.platform);
      
      const campaignPayload = {
        name: campaignData.name,
        platform: campaignData.platform,
        status: complianceResult.isCompliant ? 'Active' as const : 'Rejected' as const,
        message: campaignData.message,
        mediaUrl: campaignData.mediaUrl,
        buttonText: campaignData.buttonText,
        buttonUrl: campaignData.buttonUrl,
        contacts: contacts,
        sent: 0,
        delivered: 0,
        opened: 0,
        ctr: "0%",
        targetAudience: `${contacts.length} contacts`,
        complianceStatus: complianceResult.isCompliant ? 'Approved' : 'Rejected',
        rejectionReason: complianceResult.isCompliant ? undefined : complianceResult.rejectionReason
      };

      // Step 2: Save campaign
      const savedCampaign = saveCampaign(campaignPayload);
      
      if (complianceResult.isCompliant) {
        toast.success("✅ Campaign approved and created successfully!");
        
        console.log('🔄 Campaign settings:', { 
          sendImmediately, 
          campaignName: savedCampaign.name,
          platform: savedCampaign.platform,
          contactCount: savedCampaign.contacts.length 
        });
        
        // Step 3: Send messages if compliance passed and user wants immediate sending
        if (sendImmediately) {
          console.log('📤 User chose to send immediately - starting message sending...');
          await sendCampaignMessages(savedCampaign);
        } else {
          console.log('📝 User chose to save as draft - skipping message sending');
          toast.info("📝 Campaign saved as draft. You can send it later from the dashboard.");
        }
        
        navigate('/dashboard');
      } else {
        toast.error(`❌ Campaign rejected: ${complianceResult.rejectionReason}`);
        toast.info("📝 Campaign saved as rejected. Please edit and resubmit after fixing compliance issues.");
        navigate('/dashboard');
      }
      
      console.log("Campaign saved:", savedCampaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Campaign</h1>
          <p className="text-gray-600 mt-2">Design and launch your messaging campaign</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Set up your campaign details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection - Always show this field */}
              <div>
                <Label htmlFor="template">Use Existing Template (Optional)</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No template</SelectItem>
                    {templates.length > 0 ? (
                      templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-templates" disabled>
                        No templates available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {templates.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    No templates found. You can create templates in the Templates section.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="campaignName">Campaign Name *</Label>
                  <Input
                    id="campaignName"
                    placeholder="Enter campaign name"
                    value={campaignData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform *</Label>
                  <Select value={campaignData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
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
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="message">Message Content *</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleGenerateAd}
                    disabled={isGeneratingAd}
                  >
                    {isGeneratingAd ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Generate Ad
                      </>
                    )}
                  </Button>
                </div>
                <Textarea
                  id="message"
                  placeholder="Enter your message content..."
                  rows={4}
                  value={campaignData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
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
                              {uploadedImage ? uploadedImage.name : 'Template Image'}
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
                    value={campaignData.buttonText}
                    onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="buttonUrl">Button URL (Optional)</Label>
                  <Input
                    id="buttonUrl"
                    type="url"
                    placeholder="Enter button URL"
                    value={campaignData.buttonUrl}
                    onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Upload contacts or add them manually</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Upload CSV File</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {csvFile ? `Selected: ${csvFile.name}` : 'Upload CSV file with contact details'}
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

          {/* Campaign Sending Options */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Launch</CardTitle>
              <CardDescription>Choose when to send your campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="sendNow"
                    name="sendOption"
                    checked={sendImmediately}
                    onChange={() => setSendImmediately(true)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <Label htmlFor="sendNow" className="flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Send immediately after approval
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id="saveDraft"
                    name="sendOption"
                    checked={!sendImmediately}
                    onChange={() => setSendImmediately(false)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <Label htmlFor="saveDraft">
                    Save as draft (send later from dashboard)
                  </Label>
                </div>
                
                {isSending && sendingProgress.total > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-800">
                        Sending messages... ({sendingProgress.current}/{sendingProgress.total})
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isSending}>
              {isSubmitting ? 'Creating Campaign...' : 
               isSending ? 'Sending Messages...' : 
               sendImmediately ? 'Create & Send Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default NewCampaign;
