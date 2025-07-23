
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Play, Pause, Trash2 } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { getCampaignById, updateCampaign, deleteCampaign } from "@/utils/campaignStorage";

const CampaignDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundCampaign = getCampaignById(id);
      setCampaign(foundCampaign);
      setLoading(false);
      
      if (!foundCampaign) {
        toast.error("Campaign not found");
        navigate('/dashboard');
      }
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Campaign not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Paused': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = () => {
    navigate(`/campaign/${id}/edit`);
  };

  const handleToggle = () => {
    if (campaign.status === 'Rejected') {
      toast.error("Cannot toggle rejected campaign");
      return;
    }
    
    const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
    updateCampaign(id!, { status: newStatus });
    setCampaign(prev => ({ ...prev, status: newStatus }));
    toast.success(`Campaign ${newStatus.toLowerCase()}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      deleteCampaign(id!);
      toast.success("Campaign deleted successfully");
      navigate('/dashboard');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
              <p className="text-gray-600 mt-2">Campaign Details</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                onClick={handleToggle}
                disabled={campaign.status === 'Rejected'}
              >
                {campaign.status === 'Active' ? 
                  <Pause className="h-4 w-4 mr-2" /> : 
                  <Play className="h-4 w-4 mr-2" />
                }
                {campaign.status === 'Active' ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Platform</label>
                    <p className="text-lg capitalize">{campaign.platform}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      {campaign.complianceStatus && (
                        <Badge variant="outline" className="ml-2">
                          {campaign.complianceStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <p className="text-lg">{formatDate(campaign.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Target Audience</label>
                    <p className="text-lg">{campaign.targetAudience || `${campaign.contacts?.length || 0} contacts`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Message Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">{campaign.message}</p>
                </div>
                
                {campaign.mediaUrl && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Media</label>
                    <div className="mt-2">
                      <img 
                        src={campaign.mediaUrl} 
                        alt="Campaign media"
                        className="max-w-xs rounded-lg border"
                      />
                    </div>
                  </div>
                )}
                
                {campaign.buttonText && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Call to Action</label>
                    <div className="mt-2">
                      <Button variant="outline" disabled>
                        {campaign.buttonText}
                      </Button>
                      {campaign.buttonUrl && (
                        <p className="text-xs text-gray-500 mt-1">URL: {campaign.buttonUrl}</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {campaign.status === 'Rejected' && campaign.rejectionReason && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Compliance Issue</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700">{campaign.rejectionReason}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sent</span>
                    <span className="font-semibold">{campaign.sent}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Delivered</span>
                    <span className="font-semibold">{campaign.delivered}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Opened</span>
                    <span className="font-semibold">{campaign.opened}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CTR</span>
                    <span className="font-semibold">{campaign.ctr}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-800">{campaign.contacts?.length || 0} contacts</p>
                {campaign.contacts && campaign.contacts.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {campaign.contacts.slice(0, 3).map((contact, index) => (
                      <div key={index} className="text-sm">
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-gray-600">
                          {contact.email && <span>{contact.email}</span>}
                          {contact.email && contact.phone && <span> • </span>}
                          {contact.phone && <span>{contact.phone}</span>}
                        </p>
                      </div>
                    ))}
                    {campaign.contacts.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{campaign.contacts.length - 3} more contacts
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignDetails;
