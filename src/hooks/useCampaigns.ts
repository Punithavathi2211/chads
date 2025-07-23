import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Contact {
  id?: string;
  name: string;
  phone: string;
  email: string;
  telegram_chat_id?: string;
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

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      
      const { data: campaignsData, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      const campaignsWithContacts = await Promise.all(
        (campaignsData || []).map(async (campaign) => {
          const { data: contactsData } = await supabase
            .from('contacts')
            .select('*')
            .eq('campaign_id', campaign.id);

          return {
            id: campaign.id,
            name: campaign.name,
            platform: campaign.platform,
            status: campaign.status as Campaign['status'],
            sent: campaign.sent,
            delivered: campaign.delivered,
            opened: campaign.opened,
            ctr: campaign.ctr,
            message: campaign.message,
            mediaUrl: campaign.media_url,
            buttonText: campaign.button_text,
            buttonUrl: campaign.button_url,
            contacts: contactsData || [],
            createdAt: campaign.created_at,
            scheduledDate: campaign.scheduled_date,
            targetAudience: campaign.target_audience,
            complianceStatus: campaign.compliance_status,
            rejectionReason: campaign.rejection_reason,
          };
        })
      );

      setCampaigns(campaignsWithContacts);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to fetch campaigns",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCampaign = async (campaignData: Omit<Campaign, 'id' | 'createdAt'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: campaignResult, error: campaignError } = await supabase
        .from('campaigns')
        .insert([{
          user_id: user.id,
          name: campaignData.name,
          platform: campaignData.platform,
          status: campaignData.status,
          sent: campaignData.sent,
          delivered: campaignData.delivered,
          opened: campaignData.opened,
          ctr: campaignData.ctr,
          message: campaignData.message,
          media_url: campaignData.mediaUrl,
          button_text: campaignData.buttonText,
          button_url: campaignData.buttonUrl,
          scheduled_date: campaignData.scheduledDate,
          target_audience: campaignData.targetAudience,
          compliance_status: campaignData.complianceStatus,
          rejection_reason: campaignData.rejectionReason,
        }])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Save contacts
      if (campaignData.contacts.length > 0) {
        const contactsToInsert = campaignData.contacts.map(contact => ({
          campaign_id: campaignResult.id,
          user_id: user.id,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          telegram_chat_id: contact.telegram_chat_id,
        }));

        const { error: contactsError } = await supabase
          .from('contacts')
          .insert(contactsToInsert);

        if (contactsError) throw contactsError;
      }

      await fetchCampaigns();
      
      toast({
        title: "Success",
        description: "Campaign saved successfully",
      });

      return campaignResult;
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          name: updates.name,
          platform: updates.platform,
          status: updates.status,
          sent: updates.sent,
          delivered: updates.delivered,
          opened: updates.opened,
          ctr: updates.ctr,
          message: updates.message,
          media_url: updates.mediaUrl,
          button_text: updates.buttonText,
          button_url: updates.buttonUrl,
          scheduled_date: updates.scheduledDate,
          target_audience: updates.targetAudience,
          compliance_status: updates.complianceStatus,
          rejection_reason: updates.rejectionReason,
        })
        .eq('id', id);

      if (error) throw error;

      await fetchCampaigns();
      
      toast({
        title: "Success",
        description: "Campaign updated successfully",
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to update campaign",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCampaigns();
      
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getCampaignById = (id: string): Campaign | undefined => {
    return campaigns.find(campaign => campaign.id === id);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return {
    campaigns,
    isLoading,
    saveCampaign,
    updateCampaign,
    deleteCampaign,
    getCampaignById,
    refetch: fetchCampaigns,
  };
};