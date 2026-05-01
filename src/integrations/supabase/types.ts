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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      class_registrations: {
        Row: {
          association_name: string
          bank_account: string
          campaign_end: string | null
          campaign_start: string | null
          class_code: string
          class_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          fundraising_goal: string | null
          goal_amount: number | null
          id: string
          organization_number: string
          school_name: string
          status: string
          student_count: number
          total_sold_crema: number
          total_sold_gold: number
          total_to_class: number
          tracking_mode: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          association_name: string
          bank_account: string
          campaign_end?: string | null
          campaign_start?: string | null
          class_code: string
          class_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          fundraising_goal?: string | null
          goal_amount?: number | null
          id?: string
          organization_number: string
          school_name: string
          status?: string
          student_count: number
          total_sold_crema?: number
          total_sold_gold?: number
          total_to_class?: number
          tracking_mode?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          association_name?: string
          bank_account?: string
          campaign_end?: string | null
          campaign_start?: string | null
          class_code?: string
          class_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          fundraising_goal?: string | null
          goal_amount?: number | null
          id?: string
          organization_number?: string
          school_name?: string
          status?: string
          student_count?: number
          total_sold_crema?: number
          total_sold_gold?: number
          total_to_class?: number
          tracking_mode?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          class_id: string
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivered_at: string | null
          delivery_address: string | null
          delivery_city: string | null
          delivery_postal_code: string | null
          delivery_recipient: string | null
          delivery_status: string
          id: string
          invoice_due_date: string | null
          invoice_number: string | null
          invoice_paid_at: string | null
          invoice_sent_at: string | null
          invoice_status: string
          notes: string | null
          order_type: string
          paid_at: string | null
          payment_status: string
          qty_crema: number
          qty_gold: number
          stripe_session_id: string | null
          submitted_at: string
          total_to_class: number
          total_to_invoice: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_postal_code?: string | null
          delivery_recipient?: string | null
          delivery_status?: string
          id?: string
          invoice_due_date?: string | null
          invoice_number?: string | null
          invoice_paid_at?: string | null
          invoice_sent_at?: string | null
          invoice_status?: string
          notes?: string | null
          order_type?: string
          paid_at?: string | null
          payment_status?: string
          qty_crema?: number
          qty_gold?: number
          stripe_session_id?: string | null
          submitted_at?: string
          total_to_class?: number
          total_to_invoice?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivered_at?: string | null
          delivery_address?: string | null
          delivery_city?: string | null
          delivery_postal_code?: string | null
          delivery_recipient?: string | null
          delivery_status?: string
          id?: string
          invoice_due_date?: string | null
          invoice_number?: string | null
          invoice_paid_at?: string | null
          invoice_sent_at?: string | null
          invoice_status?: string
          notes?: string | null
          order_type?: string
          paid_at?: string | null
          payment_status?: string
          qty_crema?: number
          qty_gold?: number
          stripe_session_id?: string | null
          submitted_at?: string
          total_to_class?: number
          total_to_invoice?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      qlasskassan_leads: {
        Row: {
          association_name: string | null
          bank_account: string | null
          class_name: string | null
          created_at: string
          email: string
          fundraising_goal: string | null
          id: string
          metadata: Json | null
          name: string | null
          organization_number: string | null
          phone: string | null
          school_name: string | null
          source: string
          student_count: number | null
        }
        Insert: {
          association_name?: string | null
          bank_account?: string | null
          class_name?: string | null
          created_at?: string
          email: string
          fundraising_goal?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          organization_number?: string | null
          phone?: string | null
          school_name?: string | null
          source: string
          student_count?: number | null
        }
        Update: {
          association_name?: string | null
          bank_account?: string | null
          class_name?: string | null
          created_at?: string
          email?: string
          fundraising_goal?: string | null
          id?: string
          metadata?: Json | null
          name?: string | null
          organization_number?: string | null
          phone?: string | null
          school_name?: string | null
          source?: string
          student_count?: number | null
        }
        Relationships: []
      }
      repurchases: {
        Row: {
          bonus_to_class: number
          class_id: string
          created_at: string
          customer_email: string | null
          id: string
          notes: string | null
          product: string
          purchased_at: string
          quantity: number
          source_order_id: string | null
        }
        Insert: {
          bonus_to_class?: number
          class_id: string
          created_at?: string
          customer_email?: string | null
          id?: string
          notes?: string | null
          product: string
          purchased_at?: string
          quantity: number
          source_order_id?: string | null
        }
        Update: {
          bonus_to_class?: number
          class_id?: string
          created_at?: string
          customer_email?: string | null
          id?: string
          notes?: string | null
          product?: string
          purchased_at?: string
          quantity?: number
          source_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repurchases_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_registrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repurchases_source_order_id_fkey"
            columns: ["source_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      startguide_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          school_name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          school_name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          school_name?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          class_id: string
          created_at: string
          id: string
          name: string
          notes: string | null
          sold_crema: number
          sold_gold: number
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          sold_crema?: number
          sold_gold?: number
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          sold_crema?: number
          sold_gold?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          class_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          class_id?: string | null
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
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      generate_class_code: { Args: never; Returns: string }
      get_user_class_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      lookup_class_by_code: {
        Args: { _code: string }
        Returns: {
          class_code: string
          class_name: string
          id: string
          school_name: string
          status: string
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "teacher"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "teacher"],
    },
  },
} as const
