
import { Campaign, Contact } from './campaignStorage';

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface CampaignSendResponse {
  totalSent: number;
  successful: number;
  failed: number;
  results: MessageResponse[];
}

// Check if we're in demo mode or have real API credentials
const isDemoMode = () => {
  // Check for stored API keys in localStorage
  const hasWhatsAppAPI = localStorage.getItem('whatsapp_api_key');
  const hasTwilioAPI = localStorage.getItem('twilio_auth_token') && localStorage.getItem('twilio_account_sid');
  const hasMessengerAPI = localStorage.getItem('messenger_page_token');
  const hasTelegramAPI = localStorage.getItem('telegram_bot_token');
  
  return !hasWhatsAppAPI && !hasTwilioAPI && !hasMessengerAPI && !hasTelegramAPI;
};

// Enhanced messaging service with real API integration capability
export const sendCampaignToContacts = async (
  campaign: Campaign,
  contacts: Contact[]
): Promise<CampaignSendResponse> => {
  const mode = isDemoMode() ? 'DEMO' : 'PRODUCTION';
  
  console.log('🚀 Starting campaign send:', { 
    campaignName: campaign.name, 
    platform: campaign.platform,
    contactCount: contacts.length,
    mode: mode
  });
  
  if (mode === 'DEMO') {
    console.log('⚠️ DEMO MODE: No real messages will be sent. Configure API keys in Integration Setup to send real messages.');
  } else {
    console.log('✅ PRODUCTION MODE: Real messages will be sent!');
  }
  
  const results: MessageResponse[] = [];
  let successful = 0;
  let failed = 0;

  // Send to each contact
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    
    try {
      console.log(`📤 ${mode === 'DEMO' ? 'SIMULATING' : 'SENDING'} message ${i + 1}/${contacts.length} to:`, contact.name, `(${contact.email || contact.phone})`);
      
      // Add delay for better UX and to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await sendMessageToContact(campaign, contact);
      results.push(result);
      
      if (result.success) {
        successful++;
        console.log(`✅ Message ${mode === 'DEMO' ? 'simulated' : 'sent'} successfully to ${contact.name}`);
      } else {
        failed++;
        console.log(`❌ Failed to ${mode === 'DEMO' ? 'simulate' : 'send'} to ${contact.name}:`, result.error);
      }
    } catch (error) {
      console.error(`💥 Error ${mode === 'DEMO' ? 'simulating' : 'sending'} to ${contact.email || contact.phone}:`, error);
      results.push({ success: false, error: 'Network error' });
      failed++;
    }
  }

  const finalResult = {
    totalSent: contacts.length,
    successful,
    failed,
    results
  };

  console.log('📊 Campaign send completed:', finalResult);
  
  if (mode === 'DEMO') {
    console.log('💡 To send real messages, configure API keys in Settings → Integration Setup');
  }
  
  return finalResult;
};

const sendMessageToContact = async (
  campaign: Campaign,
  contact: Contact
): Promise<MessageResponse> => {
  
  if (isDemoMode()) {
    // Demo mode - simulate with high success rate
    const successRate = 0.95;
    const isSuccess = Math.random() < successRate;
    
    if (!isSuccess) {
      const errors = [
        'Simulated: Invalid contact info',
        'Simulated: User not found',
        'Simulated: Message blocked'
      ];
      return { 
        success: false, 
        error: errors[Math.floor(Math.random() * errors.length)]
      };
    }

    return { 
      success: true, 
      messageId: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
    };
  }

  // Production mode - use real APIs
  const platform = campaign.platform.toLowerCase();
  
  switch (platform) {
    case 'whatsapp':
      return sendWhatsAppMessage(campaign, contact);
    case 'messenger':
      return sendMessengerMessage(campaign, contact);
    case 'sms':
      return sendSMSMessage(campaign, contact);
    case 'telegram':
      return sendTelegramMessage(campaign, contact);
    default:
      return { success: false, error: 'Unsupported platform' };
  }
};

// WbizTool WhatsApp API implementation
const sendWhatsAppMessage = async (campaign: Campaign, contact: Contact): Promise<MessageResponse> => {
  // WbizTool is configured via Supabase secrets, so always try it first
  // The edge function will handle the credential checking
  try {
    return await sendWbizToolMessage(campaign, contact);
  } catch (error) {
    console.log('🔄 WbizTool failed, trying Meta WhatsApp API fallback...');
    
    // Fallback to Meta WhatsApp API credentials
    const accessToken = localStorage.getItem('whatsapp_api_key');
    const phoneNumberId = localStorage.getItem('whatsapp_phone_number_id');
    
    if (accessToken && phoneNumberId) {
      return sendMetaWhatsAppMessage(campaign, contact);
    } else {
      return { 
        success: false, 
        error: 'WhatsApp API not configured. WbizTool API failed and no Meta WhatsApp API credentials found in Integration Setup.' 
      };
    }
  }
};

// WbizTool API implementation
const sendWbizToolMessage = async (campaign: Campaign, contact: Contact): Promise<MessageResponse> => {
  try {
    console.log('🔄 Trying WbizTool WhatsApp API for:', contact.name);
    console.log('📱 Contact details:', { name: contact.name, phone: contact.phone, email: contact.email });
    console.log('📋 Campaign details:', { 
      message: campaign.message, 
      mediaUrl: campaign.mediaUrl,
      buttonText: campaign.buttonText,
      buttonUrl: campaign.buttonUrl
    });
    
    // Import supabase client for edge function call
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Prepare message content
    let messageContent = campaign.message;
    
    // Add button URL if provided
    if (campaign.buttonText && campaign.buttonUrl) {
      messageContent += `\n\n${campaign.buttonText}: ${campaign.buttonUrl}`;
    }
    
    // Format phone number (ensure it starts with country code)
    let formattedPhone = contact.phone;
    if (!formattedPhone) {
      console.error('❌ Contact has no phone number:', contact);
      throw new Error('Contact phone number is required for WhatsApp');
    }
    
    // Clean the phone number and format it properly
    const cleanPhone = formattedPhone.replace(/\D/g, '');
    if (cleanPhone.length === 0) {
      console.error('❌ Contact has invalid phone number:', contact.phone);
      throw new Error('Contact phone number is invalid');
    }
    
    if (!formattedPhone.startsWith('+')) {
      // If no country code, check length to determine likely format
      if (cleanPhone.length === 10) {
        // US/Canada number without country code
        formattedPhone = '+1' + cleanPhone;
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
        // US/Canada number with 1 but no +
        formattedPhone = '+' + cleanPhone;
      } else {
        // For other formats, assume it needs +1 prefix for now
        formattedPhone = '+1' + cleanPhone;
      }
    }
    
    console.log('📤 Sending to WbizTool edge function:', {
      to: formattedPhone,
      messageLength: messageContent.length,
      type: campaign.mediaUrl ? 'media' : 'text',
      hasMediaUrl: !!campaign.mediaUrl
    });
    
    const payload = {
      to: formattedPhone,
      message: messageContent,
      type: campaign.mediaUrl ? 'media' : 'text',
      media_url: campaign.mediaUrl || undefined
    };
    
    console.log('📤 Full payload:', JSON.stringify(payload, null, 2));

    const { data, error } = await supabase.functions.invoke('send-wbiztool-whatsapp', {
      body: payload
    });

    console.log('📡 Raw Supabase edge function response:', { data, error });

    if (error) {
      console.error('❌ Supabase edge function invocation error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { 
        success: false, 
        error: `Edge function error: ${error.message}${error.details ? ` - ${error.details}` : ''}` 
      };
    }

    if (!data) {
      console.error('❌ No data returned from edge function');
      return { success: false, error: 'No response from WbizTool service' };
    }

    console.log('📡 Parsed edge function data:', JSON.stringify(data, null, 2));

    if (data?.success) {
      console.log('✅ WbizTool message sent successfully:', data.messageId);
      return { success: true, messageId: data.messageId };
    } else {
      const errorMsg = data?.error || 'Unknown WbizTool API error';
      console.error('❌ WbizTool API returned failure:', {
        error: errorMsg,
        details: data?.details,
        fullResponse: data
      });
      return { 
        success: false, 
        error: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)
      };
    }
    
  } catch (error) {
    console.error('💥 WbizTool network error:', error);
    return { success: false, error: 'Network error connecting to WbizTool API' };
  }
};

// Meta WhatsApp Business API implementation (fallback)
const sendMetaWhatsAppMessage = async (campaign: Campaign, contact: Contact): Promise<MessageResponse> => {
  const accessToken = localStorage.getItem('whatsapp_api_key');
  const phoneNumberId = localStorage.getItem('whatsapp_phone_number_id');
  
  if (!accessToken || !phoneNumberId) {
    return { success: false, error: 'Meta WhatsApp API not configured' };
  }

  try {
    console.log('🔄 Using Meta WhatsApp Business API for:', contact.name);
    
    try {
      const response = await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: contact.phone,
          type: campaign.mediaUrl ? 'image' : 'text',
          ...(campaign.mediaUrl ? {
            image: { 
              link: campaign.mediaUrl, 
              caption: campaign.message 
            }
          } : {
            text: { body: campaign.message }
          }),
          ...(campaign.buttonText && campaign.buttonUrl ? {
            type: 'interactive',
            interactive: {
              type: 'button',
              body: { text: campaign.message },
              action: {
                buttons: [{
                  type: 'web_url',
                  title: campaign.buttonText,
                  url: campaign.buttonUrl
                }]
              }
            }
          } : {})
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, messageId: data.messages[0].id };
      } else {
        return { success: false, error: data.error?.message || 'Meta WhatsApp API error' };
      }
    } catch (error) {
      return { success: false, error: 'Network error connecting to WhatsApp APIs' };
    }
  } catch (error) {
    return { success: false, error: 'Network error connecting to Meta WhatsApp API' };
  }
};

// Real SMS API implementation (Twilio)
const sendSMSMessage = async (campaign: Campaign, contact: Contact): Promise<MessageResponse> => {
  const authToken = localStorage.getItem('twilio_auth_token');
  const accountSid = localStorage.getItem('twilio_account_sid');
  const fromNumber = localStorage.getItem('twilio_phone_number');
  
  if (!authToken || !accountSid || !fromNumber) {
    return { success: false, error: 'Twilio API not configured. Please add your credentials in Integration Setup.' };
  }

  try {
    const messageBody = campaign.message + (campaign.buttonUrl ? `\n\n${campaign.buttonText}: ${campaign.buttonUrl}` : '');
    
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(accountSid + ':' + authToken)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: contact.phone,
        Body: messageBody
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      return { success: true, messageId: data.sid };
    } else {
      return { success: false, error: data.message || 'Twilio API error' };
    }
  } catch (error) {
    return { success: false, error: 'Network error connecting to Twilio API' };
  }
};

// Enhanced Telegram API implementation
const sendTelegramMessage = async (campaign: Campaign, contact: Contact): Promise<MessageResponse> => {
  const botToken = localStorage.getItem('telegram_bot_token');
  
  if (!botToken) {
    return { success: false, error: 'Telegram Bot Token not configured. Please add your bot token in Integration Setup.' };
  }

  // For Telegram, we need to use the contact's phone as their Telegram user ID or chat ID
  // In a real implementation, you would need to map phone numbers to Telegram user IDs
  // For now, we'll try to use the phone number as chat ID, but this will likely fail
  // The proper way is to have users start a conversation with your bot first
  
  let chatId = contact.phone;
  
  // If the contact has a specific telegram_chat_id field, use that instead
  if ((contact as any).telegram_chat_id) {
    chatId = (contact as any).telegram_chat_id;
  }
  
  // If no specific chat ID for the contact, we can't send individual messages
  if (!chatId) {
    return { success: false, error: 'No Telegram chat ID available for this contact. Users must start a conversation with your bot first.' };
  }

  try {
    console.log('📮 Sending Telegram message:', { 
      hasToken: !!botToken, 
      chatId: chatId,
      messageLength: campaign.message.length,
      contactName: contact.name
    });

    let messageData: any = {
      chat_id: chatId,
      text: campaign.message
    };

    // Add button if provided
    if (campaign.buttonText && campaign.buttonUrl) {
      messageData.reply_markup = {
        inline_keyboard: [[{
          text: campaign.buttonText,
          url: campaign.buttonUrl
        }]]
      };
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Telegram message sent successfully:', data.result.message_id);
      return { success: true, messageId: data.result.message_id.toString() };
    } else {
      console.error('❌ Telegram API error:', data);
      
      // Provide more specific error messages
      let errorMessage = data.description || 'Telegram API error';
      
      if (data.description?.includes('chat not found')) {
        errorMessage = `Contact "${contact.name}" has not started a conversation with your Telegram bot. They need to send a message to your bot first.`;
      } else if (data.description?.includes('user not found')) {
        errorMessage = `Telegram user not found for "${contact.name}". Please verify the contact information.`;
      } else if (data.description?.includes('blocked')) {
        errorMessage = `Your bot has been blocked by "${contact.name}".`;
      }
      
      return { success: false, error: errorMessage };
    }
  } catch (error) {
    console.error('💥 Network error sending Telegram message:', error);
    return { success: false, error: 'Network error connecting to Telegram API' };
  }
};

// Real Messenger API implementation
const sendMessengerMessage = async (campaign: Campaign, contact: Contact): Promise<MessageResponse> => {
  const pageToken = localStorage.getItem('messenger_page_token');
  
  if (!pageToken) {
    return { success: false, error: 'Messenger API not configured. Please add your page token in Integration Setup.' };
  }

  // Note: Messenger requires the user's PSID (Page Scoped ID), not email
  // This is a simplified example - in reality, you'd need to map emails to PSIDs
  return { success: false, error: 'Messenger requires user PSID mapping - contact support for setup' };
};

// Helper function to validate contact information
export const validateContact = (contact: Contact, platform: string): boolean => {
  switch (platform.toLowerCase()) {
    case 'whatsapp':
    case 'sms':
      return !!contact.phone && contact.phone.length > 0;
    case 'messenger':
      return !!contact.email && contact.email.includes('@');
    case 'telegram':
      // For Telegram, we need either a phone number or a specific telegram_chat_id
      return !!(contact.phone || (contact as any).telegram_chat_id);
    default:
      return !!(contact.email || contact.phone);
  }
};

// Helper function to get platform-specific contact info
export const getContactInfo = (contact: Contact, platform: string): string => {
  switch (platform.toLowerCase()) {
    case 'whatsapp':
    case 'sms':
      return contact.phone || 'No phone';
    case 'messenger':
      return contact.email || 'No email';
    case 'telegram':
      return (contact as any).telegram_chat_id || contact.phone || contact.name || 'No Telegram ID';
    default:
      return contact.email || contact.phone || 'No contact info';
  }
};
