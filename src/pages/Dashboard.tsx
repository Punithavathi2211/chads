import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  MessageSquare, 
  Plus, 
  Settings, 
  Users, 
  TrendingUp,
  Eye,
  Play,
  Pause,
  Edit,
  Image,
  FileText,
  Shield,
  Zap,
  Send
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getCampaigns, updateCampaign, Campaign } from "@/utils/campaignStorage";
import { sendCampaignToContacts } from "@/utils/messagingService";
import TaskList from "@/components/tasks/TaskList";

const Dashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sendingCampaigns, setSendingCampaigns] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    const savedCampaigns = getCampaigns();
    setCampaigns(savedCampaigns);
  };

  const stats = [
    {
      title: "Total Campaigns",
      value: campaigns.length.toString(),
      change: "+2 this month",
      icon: MessageSquare,
      color: "text-blue-600"
    },
    {
      title: "Messages Sent",
      value: campaigns.reduce((total, c) => total + c.sent, 0).toLocaleString(),
      change: "+12% from last month",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Avg. CTR",
      value: campaigns.length > 0 ? 
        (campaigns.reduce((total, c) => total + parseFloat(c.ctr.replace('%', '')), 0) / campaigns.length).toFixed(1) + '%' : 
        '0%',
      change: "+2.1% from last month",
      icon: BarChart3,
      color: "text-purple-600"
    },
    {
      title: "Active Users",
      value: "2.4K",
      change: "+5% from last month",
      icon: Users,
      color: "text-orange-600"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateCampaign = () => {
    navigate('/campaign/new');
  };

  const handleViewCampaign = (campaignId: string) => {
    navigate(`/campaign/${campaignId}`);
  };

  const handleEditCampaign = (campaignId: string) => {
    navigate(`/campaign/${campaignId}/edit`);
  };

  const handleToggleCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign && campaign.status !== 'Rejected') {
      const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
      updateCampaign(campaignId, { status: newStatus });
      loadCampaigns();
      toast.success(`Campaign ${newStatus.toLowerCase()}`);
    } else if (campaign?.status === 'Rejected') {
      toast.error("Cannot activate rejected campaign");
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    if (campaign.status === 'Rejected') {
      toast.error("Cannot send rejected campaign");
      return;
    }

    if (campaign.sent > 0) {
      toast.error("Campaign has already been sent");
      return;
    }

    setSendingCampaigns(prev => new Set(prev).add(campaignId));
    
    try {
      toast.info("Sending campaign messages...");
      
      const sendResult = await sendCampaignToContacts(campaign, campaign.contacts);
      
      // Update campaign with send statistics
      const updatedStats = {
        sent: sendResult.totalSent,
        delivered: sendResult.successful,
        opened: Math.floor(sendResult.successful * 0.7), // Simulate 70% open rate
        ctr: `${Math.floor(sendResult.successful * 0.15)}%`, // Simulate 15% CTR
        status: 'Active' as const
      };
      
      updateCampaign(campaignId, updatedStats);
      loadCampaigns();
      
      if (sendResult.successful > 0) {
        toast.success(`Campaign sent successfully! ${sendResult.successful}/${sendResult.totalSent} messages delivered.`);
      } else {
        toast.error(`Failed to send campaign. ${sendResult.failed}/${sendResult.totalSent} messages failed.`);
      }
      
    } catch (error) {
      console.error("Error sending campaign:", error);
      toast.error("Failed to send campaign messages");
    } finally {
      setSendingCampaigns(prev => {
        const newSet = new Set(prev);
        newSet.delete(campaignId);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your messaging campaigns and track performance</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/campaign/new')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">New Campaign</h3>
                  <p className="text-sm text-gray-600">Create a campaign</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/rich-media-builder')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Image className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Rich Media</h3>
                  <p className="text-sm text-gray-600">Create templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/templates')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Templates</h3>
                  <p className="text-sm text-gray-600">Manage templates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/consent-manager')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Shield className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Consent Manager</h3>
                  <p className="text-sm text-gray-600">Manage user consent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Tasks Section */}
        <div className="mb-8">
          <TaskList />
        </div>

        {/* Campaigns Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Campaigns</CardTitle>
                  <CardDescription>Manage and monitor your advertising campaigns</CardDescription>
                </div>
                <Button onClick={handleCreateCampaign}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </CardHeader>
              <CardContent>
                {campaigns.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
                    <Button onClick={handleCreateCampaign}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Campaign
                    </Button>
                  </div>
                ) : (
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
                            {campaign.complianceStatus && (
                              <Badge variant="outline">
                                {campaign.complianceStatus}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <p className="line-clamp-2">{campaign.message}</p>
                          </div>
                          {campaign.status === 'Rejected' && campaign.rejectionReason && (
                            <div className="text-sm text-red-600 mb-2">
                              <p><strong>Rejection Reason:</strong> {campaign.rejectionReason}</p>
                            </div>
                          )}
                          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <div className="font-medium text-gray-900">{campaign.sent}</div>
                              <div>Sent</div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{campaign.delivered}</div>
                              <div>Delivered</div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{campaign.opened}</div>
                              <div>Opened</div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{campaign.ctr}</div>
                              <div>CTR</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaign.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {campaign.sent === 0 && campaign.status !== 'Rejected' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSendCampaign(campaign.id)}
                              disabled={sendingCampaigns.has(campaign.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {sendingCampaigns.has(campaign.id) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                              ) : (
                                <Send className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleCampaign(campaign.id)}
                            disabled={campaign.status === 'Rejected'}
                          >
                            {campaign.status === 'Active' ? 
                              <Pause className="h-4 w-4" /> : 
                              <Play className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" onClick={handleCreateCampaign}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/rich-media-builder')}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Rich Media Builder
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/consent-manager')}>
                  <Users className="h-4 w-4 mr-2" />
                  Consent Manager
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/integration-setup')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Integration Setup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {campaigns.slice(0, 3).map((campaign, index) => (
                    <div key={campaign.id} className="flex justify-between">
                      <span>Campaign "{campaign.name}" {campaign.status.toLowerCase()}</span>
                      <span className="text-gray-500">
                        {new Date(campaign.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 text-sm">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms-of-service')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </button>
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">
            © 2025 CHADS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;