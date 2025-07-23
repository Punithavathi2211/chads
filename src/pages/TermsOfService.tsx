
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using CHADS (the "Service"), you accept and agree to be bound by the 
              terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="mb-4">
              CHADS is a platform for creating and managing rich media advertising campaigns across 
              various chat platforms including WhatsApp, Messenger, SMS, and web chat widgets.
            </p>

            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Use the Service in compliance with all applicable laws and regulations</li>
              <li>Obtain proper consent before sending messages to recipients</li>
              <li>Not use the Service for spam, harassment, or illegal activities</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with platform-specific terms (WhatsApp, Facebook, etc.)</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">4. Compliance Requirements</h2>
            <p className="mb-4">
              All campaigns must comply with GDPR, TCPA, CAN-SPAM Act, and other applicable 
              privacy and marketing regulations. Users are responsible for ensuring compliance.
            </p>

            <h2 className="text-2xl font-bold mb-4">5. Content Policy</h2>
            <p className="mb-4">
              You are responsible for all content you create and distribute through our Service. 
              We reserve the right to remove content that violates our policies or applicable laws.
            </p>

            <h2 className="text-2xl font-bold mb-4">6. Service Availability</h2>
            <p className="mb-4">
              We strive to provide reliable service but do not guarantee 100% uptime. We may 
              perform maintenance that temporarily affects service availability.
            </p>

            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall CHADS be liable for any indirect, incidental, special, consequential, 
              or punitive damages arising from your use of the Service.
            </p>

            <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your account if you violate these terms or for any other 
              reason at our sole discretion.
            </p>

            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p className="mb-4">
              For questions about these Terms of Service, please contact us at legal@chads.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
