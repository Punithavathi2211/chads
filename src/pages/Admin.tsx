import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  MessageSquare, 
  Shield, 
  BarChart3, 
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Settings
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminCampaignPreview from "@/components/admin/AdminCampaignPreview";
import AdminCampaignEdit from "@/components/admin/AdminCampaignEdit";
import AdminUserPreview from "@/components/admin/AdminUserPreview";
import AdminUserSettings from "@/components/admin/AdminUserSettings";
import SystemSettingsModal from "@/components/admin/SystemSettingsModal";
import { toast } from "sonner";

const Admin = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@company.com",
      company: "Tech Corp",
      status: "Active",
      campaigns: 5,
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@startup.com",
      company: "Innovation Labs",
      status: "Pending",
      campaigns: 2,
      joinDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@business.com",
      company: "Business Solutions",
      status: "Suspended",
      campaigns: 8,
      joinDate: "2024-01-08"
    }
  ]);

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: "Holiday Promotion",
      user: "John Doe",
      platform: "WhatsApp",
      status: "Pending Approval",
      targetAudience: 5000,
      submitDate: "2024-03-15",
      message: "🎄 Special Holiday Offers! Get 50% off all products. Limited time only!",
      mediaUrl: "",
      buttonText: "Shop Now",
      buttonUrl: "https://example.com/shop"
    },
    {
      id: 2,
      name: "Product Launch",
      user: "Sarah Wilson",
      platform: "Messenger",
      status: "Approved",
      targetAudience: 2500,
      submitDate: "2024-03-14",
      message: "🚀 Introducing our latest innovation! Be the first to experience the future.",
      mediaUrl: "",
      buttonText: "Learn More",
      buttonUrl: "https://example.com/product"
    },
    {
      id: 3,
      name: "Newsletter Campaign",
      user: "Mike Johnson",
      platform: "SMS",
      status: "Rejected",
      targetAudience: 8000,
      submitDate: "2024-03-13",
      message: "📧 Stay updated with our weekly newsletter. Get the latest news and updates.",
      mediaUrl: "",
      buttonText: "Subscribe",
      buttonUrl: "https://example.com/newsletter"
    }
  ]);

  const [previewCampaign, setPreviewCampaign] = useState(null);
  const [editCampaign, setEditCampaign] = useState(null);
  const [previewUser, setPreviewUser] = useState(null);
  const [settingsUser, setSettingsUser] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUserPreviewOpen, setIsUserPreviewOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [isSystemSettingsOpen, setIsSystemSettingsOpen] = useState(false);

  const stats = [
    {
      title: "Total Users",
      value: "245",
      change: "+12 this week",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Campaigns",
      value: "68",
      change: "+8 pending approval",
      icon: MessageSquare,
      color: "text-green-600"
    },
    {
      title: "Compliance Score",
      value: "98.5%",
      change: "Excellent rating",
      icon: Shield,
      color: "text-purple-600"
    },
    {
      title: "Platform Uptime",
      value: "99.9%",
      change: "Last 30 days",
      icon: BarChart3,
      color: "text-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePreviewCampaign = (campaign) => {
    setPreviewCampaign(campaign);
    setIsPreviewOpen(true);
  };

  const handleEditCampaign = (campaign) => {
    setEditCampaign(campaign);
    setIsEditOpen(true);
  };

  const handlePreviewUser = (user) => {
    setPreviewUser(user);
    setIsUserPreviewOpen(true);
  };

  const handleUserSettings = (user) => {
    setSettingsUser(user);
    setIsUserSettingsOpen(true);
  };

  const handleApproveCampaign = (campaignId) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'Approved' }
          : campaign
      )
    );
    toast.success(`Campaign ${campaignId} approved successfully`);
  };

  const handleRejectCampaign = (campaignId) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, status: 'Rejected' }
          : campaign
      )
    );
    toast.success(`Campaign ${campaignId} rejected`);
  };

  const handleApproveUser = (userId) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'Active' }
          : user
      )
    );
    toast.success(`User ${userId} approved successfully`);
  };

  const handleRejectUser = (userId) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: 'Suspended' }
          : user
      )
    );
    toast.success(`User ${userId} rejected`);
  };

  const handleSystemSettings = () => {
    setIsSystemSettingsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onSystemSettings={handleSystemSettings} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Oversight</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage registered users and their access</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input placeholder="Search users..." className="pl-10 w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <div className="font-medium text-gray-900">{user.email}</div>
                            <div>Email</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.company}</div>
                            <div>Company</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.campaigns}</div>
                            <div>Campaigns</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.joinDate}</div>
                            <div>Joined</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePreviewUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {user.status === 'Pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRejectUser(user.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleUserSettings(user)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Oversight</CardTitle>
                <CardDescription>Review and approve user campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <Badge variant="secondary">{campaign.platform}</Badge>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <div className="font-medium text-gray-900">{campaign.user}</div>
                            <div>Created by</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{campaign.targetAudience.toLocaleString()}</div>
                            <div>Target Audience</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{campaign.submitDate}</div>
                            <div>Submitted</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{campaign.platform}</div>
                            <div>Platform</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handlePreviewCampaign(campaign)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {campaign.status === 'Pending Approval' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApproveCampaign(campaign.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRejectCampaign(campaign.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Dashboard</CardTitle>
                <CardDescription>Monitor platform compliance and audit logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Recent Audit Events</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-green-50 rounded">
                        <span>WhatsApp template approved</span>
                        <span className="text-gray-500">2h ago</span>
                      </div>
                      <div className="flex justify-between p-2 bg-blue-50 rounded">
                        <span>User opt-in recorded</span>
                        <span className="text-gray-500">4h ago</span>
                      </div>
                      <div className="flex justify-between p-2 bg-yellow-50 rounded">
                        <span>SMS delivery rate check</span>
                        <span className="text-gray-500">6h ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Compliance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>GDPR Compliance</span>
                        <Badge className="bg-green-100 text-green-800">98.5%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>TCPA Compliance</span>
                        <Badge className="bg-green-100 text-green-800">97.2%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Opt-out Response Time</span>
                        <Badge className="bg-green-100 text-green-800">&lt; 1 min</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Campaign Preview Modal */}
      <AdminCampaignPreview 
        campaign={previewCampaign}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Campaign Edit Modal */}
      <AdminCampaignEdit 
        campaign={editCampaign}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={() => {
          setIsEditOpen(false);
          toast.success("Campaign updated successfully");
        }}
      />

      {/* User Preview Modal */}
      <AdminUserPreview 
        user={previewUser}
        isOpen={isUserPreviewOpen}
        onClose={() => setIsUserPreviewOpen(false)}
      />

      {/* User Settings Modal */}
      <AdminUserSettings 
        user={settingsUser}
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
        onSave={() => {
          setIsUserSettingsOpen(false);
          toast.success("User settings updated successfully");
        }}
      />

      {/* System Settings Modal */}
      <SystemSettingsModal 
        isOpen={isSystemSettingsOpen}
        onClose={() => setIsSystemSettingsOpen(false)}
      />
    </div>
  );
};

export default Admin;
