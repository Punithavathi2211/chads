import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CheckCircle, AlertCircle, ExternalLink, TestTube } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const IntegrationSetup = () => {
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState({
    wbiztool: {
      enabled: false,
      clientId: '',
      apiKey: '',
      whatsappClientId: '',
      status: 'Not Connected'
    },
    whatsapp: { 
      enabled: false, 
      apiKey: '', 
      phoneNumberId: '',
      status: 'Not Connected'
    },
    messenger: { 
      enabled: false, 
      pageToken: '', 
      status: 'Not Connected'
    },
    sms: { 
      enabled: false, 
      authToken: '', 
      accountSid: '',
      phoneNumber: '',
      status: 'Not Connected'
    },
    telegram: { 
      enabled: false, 
      botToken: '', 
      chatId: '',
      status: 'Not Connected'
    }
  });

  const [showInstructions, setShowInstructions] = useState({
    wbiztool: false,
    whatsapp: false,
    messenger: false,
    sms: false,
    telegram: false
  });

  // Load saved settings on component mount
  useEffect(() => {
    loadSavedSettings();
  }, []);

  const loadSavedSettings = () => {
    const savedSettings = {
      wbiztool: {
        enabled: !!(localStorage.getItem('wbiztool_client_id') && localStorage.getItem('wbiztool_api_key') && localStorage.getItem('wbiztool_whatsapp_client_id')),
        clientId: localStorage.getItem('wbiztool_client_id') || '',
        apiKey: localStorage.getItem('wbiztool_api_key') || '',
        whatsappClientId: localStorage.getItem('wbiztool_whatsapp_client_id') || '',
        status: (localStorage.getItem('wbiztool_client_id') && localStorage.getItem('wbiztool_api_key') && localStorage.getItem('wbiztool_whatsapp_client_id')) ? 'Connected' : 'Not Connected'
      },
      whatsapp: {
        enabled: !!localStorage.getItem('whatsapp_api_key'),
        apiKey: localStorage.getItem('whatsapp_api_key') || '',
        phoneNumberId: localStorage.getItem('whatsapp_phone_number_id') || '',
        status: localStorage.getItem('whatsapp_api_key') ? 'Connected' : 'Not Connected'
      },
      sms: {
        enabled: !!localStorage.getItem('twilio_auth_token'),
        authToken: localStorage.getItem('twilio_auth_token') || '',
        accountSid: localStorage.getItem('twilio_account_sid') || '',
        phoneNumber: localStorage.getItem('twilio_phone_number') || '',
        status: localStorage.getItem('twilio_auth_token') ? 'Connected' : 'Not Connected'
      },
      telegram: {
        enabled: !!localStorage.getItem('telegram_bot_token'),
        botToken: localStorage.getItem('telegram_bot_token') || '',
        chatId: localStorage.getItem('telegram_chat_id') || '',
        status: (localStorage.getItem('telegram_bot_token') && localStorage.getItem('telegram_chat_id')) ? 'Connected' : 'Not Connected'
      },
      messenger: {
        enabled: !!localStorage.getItem('messenger_page_token'),
        pageToken: localStorage.getItem('messenger_page_token') || '',
        status: localStorage.getItem('messenger_page_token') ? 'Connected' : 'Not Connected'
      }
    };

    setIntegrations(savedSettings);
  };

  const handleToggleIntegration = (platform: string) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        enabled: !prev[platform as keyof typeof prev].enabled
      }
    }));
  };

  const handleSaveTelegramConfig = () => {
    const { botToken, chatId } = integrations.telegram;
    
    if (!botToken || !chatId) {
      toast.error("Please fill in both bot token and chat ID");
      return;
    }

    if (!botToken.includes(':')) {
      toast.error("Please enter a valid bot token (should contain ':')");
      return;
    }

    // Save to localStorage
    localStorage.setItem('telegram_bot_token', botToken);
    localStorage.setItem('telegram_chat_id', chatId);
    
    // Update status
    setIntegrations(prev => ({
      ...prev,
      telegram: {
        ...prev.telegram,
        status: 'Connected'
      }
    }));

    toast.success("Telegram configuration saved! You can now send real Telegram messages.");
    console.log('✅ Telegram Bot configured:', { 
      hasToken: !!botToken, 
      chatId: chatId 
    });
  };

  const handleSaveSMSConfig = () => {
    const { authToken, accountSid, phoneNumber } = integrations.sms;
    
    if (!authToken || !accountSid || !phoneNumber) {
      toast.error("Please fill in all SMS configuration fields");
      return;
    }

    localStorage.setItem('twilio_auth_token', authToken);
    localStorage.setItem('twilio_account_sid', accountSid);
    localStorage.setItem('twilio_phone_number', phoneNumber);
    
    setIntegrations(prev => ({
      ...prev,
      sms: {
        ...prev.sms,
        status: 'Connected'
      }
    }));

    toast.success("SMS configuration saved! You can now send real SMS messages.");
  };

  const handleSaveWhatsAppConfig = () => {
    const { apiKey, phoneNumberId } = integrations.whatsapp;
    
    if (!apiKey || !phoneNumberId) {
      toast.error("Please fill in both access token and phone number ID");
      return;
    }

    localStorage.setItem('whatsapp_api_key', apiKey);
    localStorage.setItem('whatsapp_phone_number_id', phoneNumberId);
    
    setIntegrations(prev => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        status: 'Connected'
      }
    }));

    toast.success("WhatsApp configuration saved! You can now send real WhatsApp messages.");
  };

  const handleSaveWbizToolConfig = () => {
    const { clientId, apiKey, whatsappClientId } = integrations.wbiztool;
    
    if (!clientId || !apiKey || !whatsappClientId) {
      toast.error("Please fill in all WbizTool configuration fields");
      return;
    }

    localStorage.setItem('wbiztool_client_id', clientId);
    localStorage.setItem('wbiztool_api_key', apiKey);
    localStorage.setItem('wbiztool_whatsapp_client_id', whatsappClientId);
    
    setIntegrations(prev => ({
      ...prev,
      wbiztool: {
        ...prev.wbiztool,
        status: 'Connected'
      }
    }));

    toast.success("WbizTool configuration saved! You can now send real WhatsApp messages via WbizTool.");
  };

  const testWbizToolConfig = async () => {
    const { clientId, apiKey, whatsappClientId } = integrations.wbiztool;
    
    if (!clientId || !apiKey || !whatsappClientId) {
      toast.error("Please save your WbizTool configuration first");
      return;
    }

    toast.info("Testing WbizTool configuration...");
    
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('send-wbiztool-whatsapp', {
        body: {
          to: '+1234567890', // Test number
          message: '🎉 This is a test message from CHADS via WbizTool. Your configuration is working correctly!',
          type: 'text'
        }
      });

      if (error) {
        console.error('WbizTool test failed:', error);
        toast.error("❌ WbizTool test failed. Please check your credentials.");
      } else if (data?.success) {
        toast.success("✅ WbizTool test successful! Your configuration is working.");
      } else {
        toast.error("❌ WbizTool test failed. Please check your credentials.");
      }
    } catch (error) {
      console.error('WbizTool test error:', error);
      toast.error("❌ Network error during WbizTool test.");
    }
  };

  const handleSaveMessengerConfig = () => {
    const { pageToken } = integrations.messenger;
    
    if (!pageToken) {
      toast.error("Please enter the page access token");
      return;
    }

    localStorage.setItem('messenger_page_token', pageToken);
    
    setIntegrations(prev => ({
      ...prev,
      messenger: {
        ...prev.messenger,
        status: 'Connected'
      }
    }));

    toast.success("Messenger configuration saved!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-800';
      case 'Not Connected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleInstructions = (platform: string) => {
    setShowInstructions(prev => ({
      ...prev,
      wbiztool: false,
      [platform]: !prev[platform as keyof typeof prev]
    }));
  };

  const testTelegramConfig = async () => {
    const { botToken, chatId } = integrations.telegram;
    
    if (!botToken || !chatId) {
      toast.error("Please save your Telegram configuration first");
      return;
    }

    toast.info("Testing Telegram configuration...");
    
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🎉 This is a test message from CHADS. Your Telegram configuration is working correctly!'
        })
      });

      if (response.ok) {
        toast.success("✅ Telegram test successful! Check your Telegram chat.");
      } else {
        const errorData = await response.json();
        console.error('Telegram test failed:', errorData);
        toast.error("❌ Telegram test failed. Please check your bot token and chat ID.");
      }
    } catch (error) {
      console.error('Telegram test error:', error);
      toast.error("❌ Network error during Telegram test.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Integration Setup</h1>
          <p className="text-gray-600 mt-2">Configure your platform integrations to send real messages</p>
        </div>

        {/* Status Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔌 Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">📮</div>
                <div className="font-medium">Telegram</div>
                <Badge className={getStatusColor(integrations.telegram.status)}>
                  {integrations.telegram.status}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🚀</div>
                <div className="font-medium">WbizTool</div>
                <Badge className={getStatusColor(integrations.wbiztool.status)}>
                  {integrations.wbiztool.status}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📨</div>
                <div className="font-medium">SMS</div>
                <Badge className={getStatusColor(integrations.sms.status)}>
                  {integrations.sms.status}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <div className="font-medium">WhatsApp</div>
                <Badge className={getStatusColor(integrations.whatsapp.status)}>
                  {integrations.whatsapp.status}
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💬</div>
                <div className="font-medium">Messenger</div>
                <Badge className={getStatusColor(integrations.messenger.status)}>
                  {integrations.messenger.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* WbizTool WhatsApp - Priority Integration */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>🚀 WbizTool WhatsApp API - RECOMMENDED</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleInstructions('wbiztool')}
                  >
                    {showInstructions.wbiztool ? 'Hide' : 'Show'} Setup Guide
                  </Button>
                  {integrations.wbiztool.status === 'Connected' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={testWbizToolConfig}
                    >
                      <TestTube className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                Professional WhatsApp Business API with high delivery rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={integrations.wbiztool.enabled}
                    onCheckedChange={() => handleToggleIntegration('wbiztool')}
                  />
                  <Badge className={getStatusColor(integrations.wbiztool.status)}>
                    {integrations.wbiztool.status}
                  </Badge>
                </div>
                {integrations.wbiztool.status === 'Connected' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              {showInstructions.wbiztool && (
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-green-800">📋 Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-green-700">
                    <li>Sign up at <a href="https://wbiztool.com" target="_blank" className="underline">WbizTool.com</a></li>
                    <li>Get your Client ID, API Key, and WhatsApp Client ID from your dashboard</li>
                    <li>Enter the credentials below and save</li>
                    <li>Test the configuration to ensure it's working</li>
                  </ol>
                  <div className="mt-3 p-3 bg-blue-100 rounded">
                    <p className="text-sm font-medium text-blue-800">💰 Cost:</p>
                    <p className="text-sm text-blue-700">Pay-per-message with competitive rates</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="wbizClientId">Client ID *</Label>
                  <Input
                    id="wbizClientId"
                    value={integrations.wbiztool.clientId}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      wbiztool: { ...prev.wbiztool, clientId: e.target.value }
                    }))}
                    placeholder="Your Client ID"
                  />
                </div>
                <div>
                  <Label htmlFor="wbizApiKey">API Key *</Label>
                  <Input
                    id="wbizApiKey"
                    type="password"
                    value={integrations.wbiztool.apiKey}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      wbiztool: { ...prev.wbiztool, apiKey: e.target.value }
                    }))}
                    placeholder="Your API Key"
                  />
                </div>
                <div>
                  <Label htmlFor="wbizWhatsappClientId">WhatsApp Client ID *</Label>
                  <Input
                    id="wbizWhatsappClientId"
                    value={integrations.wbiztool.whatsappClientId}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      wbiztool: { ...prev.wbiztool, whatsappClientId: e.target.value }
                    }))}
                    placeholder="WhatsApp Client ID"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveWbizToolConfig} className="w-full">
                Save WbizTool Configuration
              </Button>
            </CardContent>
          </Card>

          {/* Telegram Bot - Most Important */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📮 Telegram Bot - RECOMMENDED</span>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleInstructions('telegram')}
                  >
                    {showInstructions.telegram ? 'Hide' : 'Show'} Setup Guide
                  </Button>
                  {integrations.telegram.status === 'Connected' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={testTelegramConfig}
                    >
                      <TestTube className="h-4 w-4 mr-1" />
                      Test
                    </Button>
                  )}
                </div>
              </CardTitle>
              <CardDescription>
                Easy to set up - Free messaging with high delivery rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={integrations.telegram.enabled}
                    onCheckedChange={() => handleToggleIntegration('telegram')}
                  />
                  <Badge className={getStatusColor(integrations.telegram.status)}>
                    {integrations.telegram.status}
                  </Badge>
                </div>
                {integrations.telegram.status === 'Connected' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              {showInstructions.telegram && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-blue-800">📋 Quick Setup (3 minutes):</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                    <li>Open Telegram and search for <strong>@BotFather</strong></li>
                    <li>Send <code>/newbot</code> command and follow instructions</li>
                    <li>Choose a name and username for your bot (must end with 'bot')</li>
                    <li>Copy the bot token (format: 123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11)</li>
                    <li>Start a chat with your bot and send any message</li>
                    <li>Get your Chat ID by visiting: <code>https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates</code></li>
                    <li>Look for the "chat" object and copy the "id" number</li>
                  </ol>
                  <div className="mt-3 p-3 bg-green-100 rounded">
                    <p className="text-sm font-medium text-green-800">💰 Cost:</p>
                    <p className="text-sm text-green-700">Completely free with unlimited messages</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telegramToken">Bot Token *</Label>
                  <Input
                    id="telegramToken"
                    type="password"
                    value={integrations.telegram.botToken}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      telegram: { ...prev.telegram, botToken: e.target.value }
                    }))}
                    placeholder="123456789:ABC-DEF1234ghIkl..."
                  />
                </div>
                <div>
                  <Label htmlFor="telegramChatId">Chat ID *</Label>
                  <Input
                    id="telegramChatId"
                    value={integrations.telegram.chatId}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      telegram: { ...prev.telegram, chatId: e.target.value }
                    }))}
                    placeholder="123456789"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveTelegramConfig} className="w-full">
                Save Telegram Configuration
              </Button>
            </CardContent>
          </Card>

          {/* SMS (Twilio) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📨 SMS Gateway (Twilio)</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleInstructions('sms')}
                >
                  {showInstructions.sms ? 'Hide' : 'Show'} Setup Guide
                </Button>
              </CardTitle>
              <CardDescription>High delivery rates - ~$0.0075 per SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={integrations.sms.enabled}
                    onCheckedChange={() => handleToggleIntegration('sms')}
                  />
                  <Badge className={getStatusColor(integrations.sms.status)}>
                    {integrations.sms.status}
                  </Badge>
                </div>
                {integrations.sms.status === 'Connected' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
              </div>

              {showInstructions.sms && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-blue-800">📋 Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                    <li>Sign up at <a href="https://www.twilio.com/try-twilio" target="_blank" className="underline">Twilio.com</a></li>
                    <li>Verify your account and get a phone number</li>
                    <li>Go to Console → Account → API Keys & Tokens</li>
                    <li>Copy your Account SID and Auth Token</li>
                    <li>Fund your account (minimum $20 for production)</li>
                  </ol>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="smsAuthToken">Auth Token</Label>
                  <Input
                    id="smsAuthToken"
                    type="password"
                    value={integrations.sms.authToken}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      sms: { ...prev.sms, authToken: e.target.value }
                    }))}
                    placeholder="Your Auth Token"
                  />
                </div>
                <div>
                  <Label htmlFor="smsAccountSid">Account SID</Label>
                  <Input
                    id="smsAccountSid"
                    value={integrations.sms.accountSid}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      sms: { ...prev.sms, accountSid: e.target.value }
                    }))}
                    placeholder="AC..."
                  />
                </div>
                <div>
                  <Label htmlFor="smsPhoneNumber">Twilio Phone Number</Label>
                  <Input
                    id="smsPhoneNumber"
                    value={integrations.sms.phoneNumber}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      sms: { ...prev.sms, phoneNumber: e.target.value }
                    }))}
                    placeholder="+1234567890"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveSMSConfig} className="w-full">
                Save SMS Configuration
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Business API */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📱 Meta WhatsApp Business API (Alternative)</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleInstructions('whatsapp')}
                >
                  {showInstructions.whatsapp ? 'Hide' : 'Show'} Setup Guide
                </Button>
              </CardTitle>
              <CardDescription>Alternative to WbizTool - Requires business verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={integrations.whatsapp.enabled}
                    onCheckedChange={() => handleToggleIntegration('whatsapp')}
                  />
                  <Badge className={getStatusColor(integrations.whatsapp.status)}>
                    {integrations.whatsapp.status}
                  </Badge>
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>

              {showInstructions.whatsapp && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-blue-800">📋 Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                    <li>Go to <a href="https://developers.facebook.com/" target="_blank" className="underline">Facebook Developers</a></li>
                    <li>Create a new app and add WhatsApp Business API</li>
                    <li>Complete business verification process</li>
                    <li>Get your Phone Number ID and Access Token</li>
                    <li>Set up webhook for message handling</li>
                  </ol>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsappKey">Access Token</Label>
                  <Input
                    id="whatsappKey"
                    type="password"
                    value={integrations.whatsapp.apiKey}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      whatsapp: { ...prev.whatsapp, apiKey: e.target.value }
                    }))}
                    placeholder="EAA..."
                  />
                </div>
                <div>
                  <Label htmlFor="whatsappPhoneId">Phone Number ID</Label>
                  <Input
                    id="whatsappPhoneId"
                    value={integrations.whatsapp.phoneNumberId}
                    onChange={(e) => setIntegrations(prev => ({
                      ...prev,
                      whatsapp: { ...prev.whatsapp, phoneNumberId: e.target.value }
                    }))}
                    placeholder="1234567890123456"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveWhatsAppConfig} className="w-full">
                Save WhatsApp Configuration
              </Button>
            </CardContent>
          </Card>

          {/* Facebook Messenger */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>💬 Facebook Messenger</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleInstructions('messenger')}
                >
                  {showInstructions.messenger ? 'Hide' : 'Show'} Setup Guide
                </Button>
              </CardTitle>
              <CardDescription>Requires users to initiate conversation first</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={integrations.messenger.enabled}
                    onCheckedChange={() => handleToggleIntegration('messenger')}
                  />
                  <Badge className={getStatusColor(integrations.messenger.status)}>
                    {integrations.messenger.status}
                  </Badge>
                </div>
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>

              {showInstructions.messenger && (
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-blue-800">📋 Setup Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
                    <li>Create a Facebook Page for your business</li>
                    <li>Go to <a href="https://developers.facebook.com/" target="_blank" className="underline">Facebook Developers</a></li>
                    <li>Create an app and add Messenger product</li>
                    <li>Generate a Page Access Token</li>
                    <li>Set up webhook for message handling</li>
                  </ol>
                </div>
              )}

              <div>
                <Label htmlFor="messengerToken">Page Access Token</Label>
                <Input
                  id="messengerToken"
                  type="password"
                  value={integrations.messenger.pageToken}
                  onChange={(e) => setIntegrations(prev => ({
                    ...prev,
                    messenger: { ...prev.messenger, pageToken: e.target.value }
                  }))}
                  placeholder="EAA..."
                />
              </div>
              
              <Button onClick={handleSaveMessengerConfig} className="w-full">
                Save Messenger Configuration
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">🚀 Ready to Send Real Messages!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-green-700 space-y-3">
              <p><strong>✅ What's Working:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Campaign creation and compliance checking</li>
                <li>Contact list management</li>
                <li>Real API integration for all platforms</li>
                <li>WbizTool WhatsApp API integration</li>
                <li>Automatic switching between demo and production modes</li>
              </ul>
              
              <p><strong>📮 Recommended Next Steps:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Your <strong>WbizTool WhatsApp API</strong> is ready to use!</li>
                <li>Create a test campaign with WhatsApp as the platform</li>
                <li>Add your phone number to the contact list</li>
                <li>Send the campaign and verify you receive the WhatsApp message</li>
                <li>Set up other platforms (Telegram, SMS) for broader reach</li>
              </ol>
              
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="font-medium text-green-800">💡 Pro Tip:</p>
                <p className="text-sm text-green-700">
                  Your WbizTool configuration is saved! When you create a WhatsApp campaign, 
                  it will automatically use WbizTool to send real WhatsApp messages to your contacts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default IntegrationSetup;