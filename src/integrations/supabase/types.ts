export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      campaigns: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          name: string | null;
          platform: string | null;
          message_content: string | null;
          image_url: string | null;
          button_text: string | null;
          button_url: string | null;
          status: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          name?: string | null;
          platform?: string | null;
          message_content?: string | null;
          image_url?: string | null;
          button_text?: string | null;
          button_url?: string | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          name?: string | null;
          platform?: string | null;
          message_content?: string | null;
          image_url?: string | null;
          button_text?: string | null;
          button_url?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey";
            columns: ["user_id"];
            referencedBy: ["tasks"];
            referencedColumns: ["campaign_id"];
          },
        ];
      };
      tasks: {
        Row: {
          id: string;
          created_at: string;
          campaign_id: string;
          description: string | null;
          completed: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          campaign_id: string;
          description?: string | null;
          completed?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          campaign_id?: string;
          description?: string | null;
          completed?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_campaign_id_fkey";
            columns: ["campaign_id"];
            referencedBy: [];
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
