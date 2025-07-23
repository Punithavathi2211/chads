import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Download, Shield, CheckCircle, XCircle } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ConsentManager = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [consents] = useState([
    {
      id: 1,
      email: "john.doe@email.com",
      phone: "+1234567890",
      status: "Opted In",
      date: "2024-03-10",
      source: "Website Form",
      campaigns: ["Summer Sale", "Newsletter"]
    },
    {
      id: 2,
      email: "sarah.wilson@email.com",
      phone: "+1234567891",
      status: "Opted Out",
      date: "2024-03-08",
      source: "WhatsApp",
      campaigns: ["Product Launch"]
    },
    {
      id: 3,
      email: "mike.johnson@email.com",
      phone: "+1234567892",
      status: "Pending",
      date: "2024-03-12",
      source: "Manual Entry",
      campaigns: ["Newsletter"]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Opted In': return 'bg-green-100 text-green-800';
      case 'Opted Out': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportData = () => {
    // Create CSV content
    const headers = ['ID', 'Email', 'Phone', 'Status', 'Date', 'Source', 'Campaigns'];
    const csvContent = [
      headers.join(','),
      ...consents.map(consent => [
        consent.id,
        consent.email,
        consent.phone,
        consent.status,
        consent.date,
        consent.source,
        consent.campaigns.join(';')
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `consent_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Consent data exported successfully");
    console.log("Exported consent data:", consents);
  };

  const handleUpdateConsent = (id: number, status: string) => {
    toast.success(`Consent ${status.toLowerCase()} for user ID ${id}`);
    console.log("Updating consent:", { id, status });
  };

  const filteredConsents = consents.filter(consent =>
    consent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consent.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consent Manager</h1>
              <p className="text-gray-600 mt-2">Manage user consent and compliance</p>
            </div>
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-green-600">+12% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opt-in Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-green-600">+2.1% this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.5%</div>
              <p className="text-xs text-green-600">Excellent</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Consent Records</CardTitle>
                <CardDescription>Manage user consent preferences and compliance</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredConsents.map((consent) => (
                <div key={consent.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className={getStatusColor(consent.status)}>
                        {consent.status}
                      </Badge>
                      <span className="text-sm text-gray-500">ID: {consent.id}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900">{consent.email}</div>
                        <div className="text-gray-600">Email</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{consent.phone}</div>
                        <div className="text-gray-600">Phone</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{consent.date}</div>
                        <div className="text-gray-600">Date</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{consent.source}</div>
                        <div className="text-gray-600">Source</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {consent.status !== 'Opted In' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600"
                        onClick={() => handleUpdateConsent(consent.id, 'Opted In')}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {consent.status !== 'Opted Out' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleUpdateConsent(consent.id, 'Opted Out')}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ConsentManager;
