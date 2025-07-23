import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";

interface Campaign {
  id: number;
  name: string;
  user: string;
  platform: string;
  status: string;
  targetAudience: number;
  submitDate: string;
  message: string;
  mediaUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
}

interface AdminCampaignEditProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AdminCampaignEdit = ({ campaign, isOpen, onClose, onSave }: AdminCampaignEditProps) => {
  const [formData, setFormData] = useState({
    name: campaign?.name || '',
    message: campaign?.message || '',
    platform: campaign?.platform || 'WhatsApp',
    status: campaign?.status || 'Pending Approval',
    buttonText: campaign?.buttonText || '',
    buttonUrl: campaign?.buttonUrl || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Saving campaign:", formData);
    onSave();
  };

  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Campaign - {campaign.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter campaign name"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Enter campaign message"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Messenger">Messenger</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
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

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Campaign Info</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Created by:</span>
                <span className="ml-2 font-medium">{campaign.user}</span>
              </div>
              <div>
                <span className="text-gray-600">Target Audience:</span>
                <span className="ml-2 font-medium">{campaign.targetAudience.toLocaleString()}</span>
              </div>
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

export default AdminCampaignEdit;
