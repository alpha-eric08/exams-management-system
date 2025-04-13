export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      application_courses: {
        Row: {
          application_id: string
          course_id: string
          created_at: string
          id: string
        }
        Insert: {
          application_id: string
          course_id: string
          created_at?: string
          id?: string
        }
        Update: {
          application_id?: string
          course_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_courses_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      application_documents: {
        Row: {
          application_id: string
          created_at: string
          id: string
          name: string
          url: string
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          name: string
          url: string
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          name?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          admin_comments: string | null
          created_at: string
          id: string
          payment_status: string | null
          status: string
          total_fee: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_comments?: string | null
          created_at?: string
          id?: string
          payment_status?: string | null
          status?: string
          total_fee?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_comments?: string | null
          created_at?: string
          id?: string
          payment_status?: string | null
          status?: string
          total_fee?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          code: string
          created_at: string
          credit_hours: number
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          credit_hours: number
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          credit_hours?: number
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      failed_courses: {
        Row: {
          academic_year: string
          course_id: string
          created_at: string
          grade: string
          id: string
          semester: string
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_year: string
          course_id: string
          created_at?: string
          grade: string
          id?: string
          semester: string
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_year?: string
          course_id?: string
          created_at?: string
          grade?: string
          id?: string
          semester?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "failed_courses_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          level: string | null
          name: string
          program: string | null
          student_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          level?: string | null
          name: string
          program?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          level?: string | null
          name?: string
          program?: string | null
          student_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          application_id: string
          course_id: string
          created_at: string
          grade: string
          id: string
          passed: boolean
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id: string
          course_id: string
          created_at?: string
          grade: string
          id?: string
          passed: boolean
          score: number
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: string
          course_id?: string
          created_at?: string
          grade?: string
          id?: string
          passed?: boolean
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "results_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable_entries: {
        Row: {
          course_id: string
          created_at: string
          date: string
          end_time: string
          id: string
          start_time: string
          updated_at: string
          venue: string
        }
        Insert: {
          course_id: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
          venue: string
        }
        Update: {
          course_id?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "timetable_entries_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
