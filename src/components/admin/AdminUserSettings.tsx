
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  campaigns: number;
  joinDate: string;
}

interface AdminUserSettingsProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AdminUserSettings = ({ user, isOpen, onClose, onSave }: AdminUserSettingsProps) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    status: user?.status || 'Active',
    emailNotifications: true,
    campaignLimits: true,
    apiAccess: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!user) return;
    
    console.log("Saving user settings:", formData);
    toast.success(`User ${user.name} settings updated successfully`);
    onSave();
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Settings - {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="status">Account Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Permissions & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions & Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive system and campaign notifications</p>
                </div>
                <Switch 
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Campaign Limits</Label>
                  <p className="text-sm text-gray-600">Apply standard campaign limits</p>
                </div>
                <Switch 
                  checked={formData.campaignLimits}
                  onCheckedChange={(checked) => handleInputChange('campaignLimits', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>API Access</Label>
                  <p className="text-sm text-gray-600">Allow programmatic access</p>
                </div>
                <Switch 
                  checked={formData.apiAccess}
                  onCheckedChange={(checked) => handleInputChange('apiAccess', checked)}
                />
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Account Statistics</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">{user.campaigns}</div>
                <div className="text-gray-600">Total Campaigns</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">12</div>
                <div className="text-gray-600">Active Campaigns</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">{user.joinDate}</div>
                <div className="text-gray-600">Member Since</div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          {formData.status === 'Suspended' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Account Suspended</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                This user's account is currently suspended. They cannot access the platform or create campaigns.
              </p>
            </div>
          )}
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

export default AdminUserSettings;
