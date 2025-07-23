import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, Zap, Shield, BarChart3, Users, Smartphone, Check } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DemoModal from "@/components/demo/DemoModal";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isAnnual, setIsAnnual] = useState(false);

  const handleGetStarted = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleWatchDemo = () => {
    setShowDemoModal(true);
  };

  const handleStarterPlan = () => {
    const price = isAnnual ? 150 : 15;
    navigate(`/checkout?plan=starter&billing=${isAnnual ? 'annual' : 'monthly'}&price=${price}`);
  };

  const handleGrowthPlan = () => {
    const price = isAnnual ? 490 : 49;
    navigate(`/checkout?plan=growth&billing=${isAnnual ? 'annual' : 'monthly'}&price=${price}`);
  };

  const handleAgencyDemo = () => {
    const price = isAnnual ? 1190 : 119;
    navigate(`/checkout?plan=agency&billing=${isAnnual ? 'annual' : 'monthly'}&price=${price}`);
  };

  const features = [
    {
      icon: MessageSquare,
      title: "Multi-Platform Support",
      description: "WhatsApp, Messenger, SMS, and Website Chat Widget integration"
    },
    {
      icon: Shield,
      title: "Compliance First",
      description: "GDPR, TCPA compliant with built-in consent management"
    },
    {
      icon: Zap,
      title: "No-Code Builder",
      description: "Drag-and-drop campaign builder with rich media support"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track engagement, CTR, and delivery rates in real-time"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      monthlyPrice: 15,
      annualPrice: 150,
      period: isAnnual ? "/ year" : "/ month",
      description: "Perfect for individuals & startups launching their first chat ads.",
      color: "border-green-500",
      buttonColor: "bg-green-600 hover:bg-green-700",
      features: [
        "1 Chat Platform (WhatsApp or Messenger)",
        "5 Campaigns / Month",
        "1,000 Monthly Messages",
        "Basic Rich Media (Image, Video, Buttons)",
        "Built-in Consent Capture",
        "Basic Analytics Dashboard",
        "Email Support"
      ],
      buttonText: "Start Free Trial",
      action: handleStarterPlan
    },
    {
      name: "Growth",
      monthlyPrice: 49,
      annualPrice: 490,
      period: isAnnual ? "/ year" : "/ month",
      description: "Ideal for businesses scaling multi-channel chat marketing.",
      color: "border-blue-500",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: true,
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
      ],
      buttonText: "Upgrade Now",
      action: handleGrowthPlan
    },
    {
      name: "Agency",
      monthlyPrice: 119,
      annualPrice: 1190,
      period: isAnnual ? "/ year" : "/ month",
      description: "For agencies & large teams managing multiple clients or verticals.",
      color: "border-red-500",
      buttonColor: "bg-red-600 hover:bg-red-700",
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
      ],
      buttonText: "Request Demo",
      action: handleAgencyDemo
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">CHADS</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Rich Media Ads in
            <span className="text-blue-600"> Chat Platforms</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Create engaging, compliant advertising campaigns across WhatsApp, Messenger, SMS, and web chat platforms with our no-code solution.
          </p>
          <div className="space-x-4">
            <Button size="lg" onClick={handleGetStarted} className="px-8 py-4 text-lg">
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools built for modern chat-based advertising
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Plans & Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Simple Pricing for Every Stage of Growth
            </p>
            <p className="text-lg text-gray-500 mt-2 mb-8">
              Choose the plan that fits your needs. Whether you're just getting started or managing campaigns for multiple clients, CHADS has you covered.
            </p>
            
            {/* Pricing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-lg font-medium ${!isAnnual ? 'text-blue-600' : 'text-gray-600'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className={`text-lg font-medium ${isAnnual ? 'text-blue-600' : 'text-gray-600'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.color} border-2 hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="mb-4">
                    <span className="text-2xl font-bold">
                      {plan.name === "Starter" && "🟢"}
                      {plan.name === "Growth" && "🔵"}
                      {plan.name === "Agency" && "🔴"}
                    </span>
                    <CardTitle className="text-2xl font-bold mt-2">{plan.name}</CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                    {isAnnual && (
                      <div className="text-sm text-gray-500 mt-1">
                        ${Math.round((plan.annualPrice / 12) * 100) / 100}/month billed annually
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-gray-600 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={plan.action}
                    className={`w-full ${plan.buttonColor} text-white py-3 text-lg font-medium`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-200">Message Delivery Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5x</div>
              <div className="text-blue-200">Higher Engagement</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-200">GDPR Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Chat Marketing?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of businesses using CHADS to create compliant, engaging chat campaigns.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 text-sm">
            <button
              onClick={() => navigate('/privacy-policy')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate('/terms-of-service')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Terms of Service
            </button>
          </div>
          <div className="text-center text-gray-400 text-sm mt-4">
            © 2025 CHADS. All rights reserved.
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
      
      <DemoModal 
        isOpen={showDemoModal} 
        onClose={() => setShowDemoModal(false)}
      />
    </div>
  );
};

export default Index;
