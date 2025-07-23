import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const plan = searchParams.get('plan') || 'starter';
  const billing = searchParams.get('billing') || 'monthly';
  const price = searchParams.get('price') || '12';

  const planDetails = {
    starter: {
      name: "Starter",
      color: "border-green-500",
      icon: "🟢",
      features: [
        "1 Chat Platform (WhatsApp or Messenger)",
        "5 Campaigns / Month",
        "1,000 Monthly Messages",
        "Basic Rich Media (Image, Video, Buttons)",
        "Drag & Drop Campaign Builder",
        "Built-in Consent Capture",
        "Basic Analytics Dashboard",
        "Email Support"
      ]
    },
    growth: {
      name: "Growth",
      color: "border-blue-500",
      icon: "🔵",
      features: [
        "Everything in Starter, plus:",
        "3 Chat Platforms (WhatsApp, Messenger, SMS)",
        "25 Campaigns / Month",
        "10,000 Monthly Messages",
        "Advanced Rich Media (Carousels, Lists, Polls)",
        "AI-Powered Personalization",
        "Campaign Templates & Flows",
        "Scheduled Broadcasts",
        "CRM Integration",
        "Web Chat Widget Support",
        "Priority Email + Chat Support"
      ]
    },
    agency: {
      name: "Agency",
      color: "border-red-500",
      icon: "🔴",
      features: [
        "Everything in Growth, plus:",
        "Unlimited Platforms",
        "Unlimited Campaigns",
        "50,000 Monthly Messages",
        "Client/Sub-Account Management",
        "White-Label Branding",
        "Compliance Engine (Geo-aware rules, auto-opt-out)",
        "API Access & Webhooks",
        "Team Collaboration Tools",
        "Advanced Analytics + Export",
        "Dedicated Account Manager",
        "SLA-Based Priority Support"
      ]
    }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails];

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Payment Processing",
      description: "Redirecting to payment processor...",
    });
    
    // In a real implementation, this would redirect to Stripe or another payment processor
    setTimeout(() => {
      toast({
        title: "Coming Soon!",
        description: "Payment integration will be available soon. You'll be notified when it's ready!",
      });
      setIsProcessing(false);
    }, 1000);
  };

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Invalid Plan</CardTitle>
            <CardDescription>The selected plan could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <Card className={`${currentPlan.color} border-2`}>
              <CardHeader className="text-center">
                <div className="mb-4">
                  <span className="text-3xl">{currentPlan.icon}</span>
                  <CardTitle className="text-2xl font-bold mt-2">{currentPlan.name} Plan</CardTitle>
                </div>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">${price}</span>
                  <span className="text-gray-600">/{billing === 'annual' ? 'year' : 'month'}</span>
                  {billing === 'annual' && (
                    <div className="text-sm text-green-600 mt-1">
                      Save 17% with annual billing
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Complete Your Purchase</CardTitle>
                <CardDescription>
                  You'll be redirected to our secure payment processor to complete your subscription.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Plan:</span>
                      <span className="font-medium">{currentPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Billing:</span>
                      <span className="font-medium capitalize">{billing}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${price}/{billing === 'annual' ? 'year' : 'month'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <h4 className="font-medium mb-2">What happens next:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Secure payment processing via Stripe</li>
                      <li>• Instant account activation</li>
                      <li>• Welcome email with setup instructions</li>
                      <li>• 14-day money-back guarantee</li>
                    </ul>
                  </div>

                  <Button 
                    onClick={handlePurchase}
                    disabled={isProcessing}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : (
                      <>Complete Purchase - ${price}</>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                    You can cancel your subscription at any time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
