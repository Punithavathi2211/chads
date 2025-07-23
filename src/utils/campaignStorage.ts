export interface Contact {
  name: string;
  phone: string;
  email: string;
  telegram_chat_id?: string; // Optional Telegram chat ID for direct messaging
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Rejected';
  sent: number;
  delivered: number;
  opened: number;
  ctr: string;
  message: string;
  mediaUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
  contacts: Contact[];
  createdAt: string;
  scheduledDate?: string;
  targetAudience?: string;
  complianceStatus?: string;
  rejectionReason?: string;
}

const CAMPAIGNS_KEY = 'chads_campaigns';

export const saveCampaign = (campaign: Omit<Campaign, 'id' | 'createdAt'>): Campaign => {
  const campaigns = getCampaigns();
  const newCampaign: Campaign = {
    ...campaign,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  campaigns.push(newCampaign);
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  return newCampaign;
};

export const getCampaigns = (): Campaign[] => {
  const campaignsJson = localStorage.getItem(CAMPAIGNS_KEY);
  return campaignsJson ? JSON.parse(campaignsJson) : [];
};

export const getCampaignById = (id: string): Campaign | undefined => {
  const campaigns = getCampaigns();
  return campaigns.find(campaign => campaign.id === id);
};

export const updateCampaign = (id: string, updates: Partial<Campaign>): void => {
  const campaigns = getCampaigns();
  const campaignIndex = campaigns.findIndex(campaign => campaign.id === id);
  
  if (campaignIndex !== -1) {
    campaigns[campaignIndex] = { ...campaigns[campaignIndex], ...updates };
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  }
};

export const deleteCampaign = (id: string): void => {
  const campaigns = getCampaigns();
  const filteredCampaigns = campaigns.filter(campaign => campaign.id !== id);
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(filteredCampaigns));
};
