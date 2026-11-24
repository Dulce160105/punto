export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      businesses: {
        Row: {
          accent_color: string
          address: string | null
          card_template: string
          commercial_name: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          legal_name: string | null
          logo_position: string
          logo_size: string
          logo_url: string | null
          owner_id: string
          phone: string | null
          points_required: number
          points_style: string
          reward_description: string | null
          scan_code: string
          socials: Json
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          accent_color?: string
          address?: string | null
          card_template?: string
          commercial_name: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          legal_name?: string | null
          logo_position?: string
          logo_size?: string
          logo_url?: string | null
          owner_id: string
          phone?: string | null
          points_required?: number
          points_style?: string
          reward_description?: string | null
          scan_code?: string
          socials?: Json
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          accent_color?: string
          address?: string | null
          card_template?: string
          commercial_name?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          legal_name?: string | null
          logo_position?: string
          logo_size?: string
          logo_url?: string | null
          owner_id?: string
          phone?: string | null
          points_required?: number
          points_style?: string
          reward_description?: string | null
          scan_code?: string
          socials?: Json
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      card_designs: {
        Row: {
          created_at: string
          id: string
          image_url: string
          name: string
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          name: string
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          storage_path?: string
        }
        Relationships: []
      }
      loyalty_cards: {
        Row: {
          business_id: string
          created_at: string
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          id: string
          last_scan_at: string | null
          points: number
          privacy_accepted_at: string | null
          privacy_version: string | null
          rewards_redeemed: number
        }
        Insert: {
          business_id: string
          created_at?: string
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          id?: string
          last_scan_at?: string | null
          points?: number
          privacy_accepted_at?: string | null
          privacy_version?: string | null
          rewards_redeemed?: number
        }
        Update: {
          business_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          id?: string
          last_scan_at?: string | null
          points?: number
          privacy_accepted_at?: string | null
          privacy_version?: string | null
          rewards_redeemed?: number
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_cards_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      point_scans: {
        Row: {
          business_id: string
          card_id: string
          id: string
          scanned_at: string
        }
        Insert: {
          business_id: string
          card_id: string
          id?: string
          scanned_at?: string
        }
        Update: {
          business_id?: string
          card_id?: string
          id?: string
          scanned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_scans_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "point_scans_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "loyalty_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accepted_terms_at: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          accepted_terms_at?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          accepted_terms_at?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_loyalty_point: {
        Args: { _card_id: string; _scan_code: string }
        Returns: Json
      }
      create_loyalty_card: {
        Args: {
          _business_id: string
          _email: string
          _name: string
          _phone: string
        }
        Returns: string
      }
      create_loyalty_card_v2: {
        Args: {
          _accepted: boolean
          _business_id: string
          _email: string
          _name: string
          _phone: string
        }
        Returns: string
      }
      get_loyalty_card: {
        Args: { _card_id: string }
        Returns: {
          accent_color: string
          business_id: string
          card_template: string
          commercial_name: string
          customer_name: string
          id: string
          last_scan_at: string
          logo_url: string
          points: number
          points_required: number
          points_style: string
          reward_description: string
          rewards_redeemed: number
        }[]
      }
      get_loyalty_card_v2: {
        Args: { _card_id: string }
        Returns: {
          accent_color: string
          business_id: string
          card_template: string
          commercial_name: string
          customer_name: string
          id: string
          last_scan_at: string
          logo_position: string
          logo_size: string
          logo_url: string
          points: number
          points_required: number
          points_style: string
          reward_description: string
          rewards_redeemed: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      join_business_info: {
        Args: { _business_id: string }
        Returns: {
          accent_color: string
          card_template: string
          commercial_name: string
          id: string
          logo_url: string
          points_required: number
          points_style: string
          reward_description: string
        }[]
      }
      join_business_info_v2: {
        Args: { _business_id: string }
        Returns: {
          accent_color: string
          address: string
          card_template: string
          commercial_name: string
          email: string
          id: string
          logo_position: string
          logo_size: string
          logo_url: string
          phone: string
          points_required: number
          points_style: string
          reward_description: string
          website: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "business"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "business"],
    },
  },
} as const
