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
      admin_users: {
        Row: {
          created_at: string
          id: string
          password_hash: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password_hash: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password_hash?: string
          username?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon_key: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon_key: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          icon_key?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          created_at: string
          id: string
          name: string
          region: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          region: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          region?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          age: number
          created_at: string
          experiment_group: string
          gender: string
          has_online_experience: string
          id: string
        }
        Insert: {
          age: number
          created_at?: string
          experiment_group?: string
          gender: string
          has_online_experience: string
          id?: string
        }
        Update: {
          age?: number
          created_at?: string
          experiment_group?: string
          gender?: string
          has_online_experience?: string
          id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_attribute_tags: {
        Row: {
          attribute: Database["public"]["Enums"]["review_attribute"]
          review_id: string
          sentiment: Database["public"]["Enums"]["review_sentiment"]
        }
        Insert: {
          attribute: Database["public"]["Enums"]["review_attribute"]
          review_id: string
          sentiment?: Database["public"]["Enums"]["review_sentiment"]
        }
        Update: {
          attribute?: Database["public"]["Enums"]["review_attribute"]
          review_id?: string
          sentiment?: Database["public"]["Enums"]["review_sentiment"]
        }
        Relationships: [
          {
            foreignKeyName: "review_attribute_tags_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_summaries: {
        Row: {
          attribute: Database["public"]["Enums"]["review_attribute"] | null
          id: string
          negative_bullets: string[]
          positive_bullets: string[]
          product_id: string
          updated_at: string
        }
        Insert: {
          attribute?: Database["public"]["Enums"]["review_attribute"] | null
          id?: string
          negative_bullets?: string[]
          positive_bullets?: string[]
          product_id: string
          updated_at?: string
        }
        Update: {
          attribute?: Database["public"]["Enums"]["review_attribute"] | null
          id?: string
          negative_bullets?: string[]
          positive_bullets?: string[]
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_summaries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "treatment_products"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_label: string
          content: string
          created_at: string
          id: string
          product_id: string
          rating: number
        }
        Insert: {
          author_label: string
          content: string
          created_at?: string
          id?: string
          product_id: string
          rating: number
        }
        Update: {
          author_label?: string
          content?: string
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "treatment_products"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_products: {
        Row: {
          category_id: string
          created_at: string
          detail_image_urls: string[]
          discount_price: number
          hospital_id: string
          id: string
          includes_aftercare: boolean
          includes_anesthesia: boolean
          includes_vat: boolean
          name: string
          original_price: number
          side_effect_notice: string
          thumbnail_url: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          detail_image_urls?: string[]
          discount_price: number
          hospital_id: string
          id?: string
          includes_aftercare?: boolean
          includes_anesthesia?: boolean
          includes_vat?: boolean
          name: string
          original_price: number
          side_effect_notice?: string
          thumbnail_url?: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          detail_image_urls?: string[]
          discount_price?: number
          hospital_id?: string
          id?: string
          includes_aftercare?: boolean
          includes_anesthesia?: boolean
          includes_vat?: boolean
          name?: string
          original_price?: number
          side_effect_notice?: string
          thumbnail_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "treatment_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_products_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      review_attribute_sentiment_ratios: {
        Row: {
          attribute: Database["public"]["Enums"]["review_attribute"] | null
          negative_count: number | null
          negative_ratio: number | null
          positive_count: number | null
          positive_ratio: number | null
          product_id: string | null
          rated_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "treatment_products"
            referencedColumns: ["id"]
          },
        ]
      }
      review_overall_sentiment_ratios: {
        Row: {
          negative_count: number | null
          negative_ratio: number | null
          positive_count: number | null
          positive_ratio: number | null
          product_id: string | null
          rated_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "treatment_products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      upsert_review_with_tags: {
        Args: {
          p_attribute_tags: Json
          p_author_label: string
          p_content: string
          p_created_at: string
          p_product_id: string
          p_rating: number
          p_review_id: string
        }
        Returns: string
      }
    }
    Enums: {
      review_attribute:
        | "medical_staff"
        | "service"
        | "price"
        | "effect"
        | "pain"
      review_sentiment: "positive" | "negative" | "neutral"
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
      review_attribute: ["medical_staff", "service", "price", "effect", "pain"],
      review_sentiment: ["positive", "negative", "neutral"],
    },
  },
} as const
