
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Building, Activity } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  campaigns: number;
  joinDate: string;
}

interface AdminUserPreviewProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminUserPreview = ({ user, isOpen, onClose }: AdminUserPreviewProps) => {
  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile - {user.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* User Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <Badge className={getStatusColor(user.status)}>
              {user.status}
            </Badge>
          </div>
          
          {/* User Details */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium">{user.email}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Building className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Company</div>
                <div className="font-medium">{user.company}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Total Campaigns</div>
                <div className="font-medium">{user.campaigns}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Join Date</div>
                <div className="font-medium">{user.joinDate}</div>
              </div>
            </div>
          </div>
          
          {/* Account Activity */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Last login</span>
                <span className="text-gray-600">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span>Last campaign</span>
                <span className="text-gray-600">1 day ago</span>
              </div>
              <div className="flex justify-between">
                <span>Account created</span>
                <span className="text-gray-600">{user.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUserPreview;
