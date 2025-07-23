
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface AdminCampaignPreviewProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminCampaignPreview = ({ campaign, isOpen, onClose }: AdminCampaignPreviewProps) => {
  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{campaign.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Campaign Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Platform:</span>
              <Badge variant="secondary">{campaign.platform}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <Badge className={
                campaign.status === 'Approved' ? 'bg-green-100 text-green-800' :
                campaign.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {campaign.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Created by:</span>
              <span className="text-sm font-medium">{campaign.user}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Target Audience:</span>
              <span className="text-sm font-medium">{campaign.targetAudience.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Message Preview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Message Preview</h4>
            <p className="text-gray-800 whitespace-pre-wrap">{campaign.message}</p>
          </div>
          
          {/* Button Preview */}
          {campaign.buttonText && (
            <div className="flex justify-center">
              <Button variant="outline" disabled>
                {campaign.buttonText}
              </Button>
            </div>
          )}
          
          {campaign.buttonUrl && (
            <p className="text-xs text-gray-500 text-center">
              URL: {campaign.buttonUrl}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCampaignPreview;
