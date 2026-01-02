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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          category: string | null
          company_id: string
          created_at: string
          credits: number
          current_applicants: number
          deadline: string | null
          description: string
          difficulty: string
          id: string
          instructions: string | null
          max_applicants: number | null
          required_skills: string[] | null
          restrictions: string[] | null
          status: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string
          credits?: number
          current_applicants?: number
          deadline?: string | null
          description?: string
          difficulty?: string
          id?: string
          instructions?: string | null
          max_applicants?: number | null
          required_skills?: string[] | null
          restrictions?: string[] | null
          status?: Database["public"]["Enums"]["challenge_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string
          credits?: number
          current_applicants?: number
          deadline?: string | null
          description?: string
          difficulty?: string
          id?: string
          instructions?: string | null
          max_applicants?: number | null
          required_skills?: string[] | null
          restrictions?: string[] | null
          status?: Database["public"]["Enums"]["challenge_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          company_name: string
          company_size: string | null
          contact_role: string | null
          created_at: string
          description: string | null
          headquarters: string | null
          hiring_roles: string[] | null
          id: string
          industry: string | null
          logo_url: string | null
          required_skills: string[] | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_name?: string
          company_size?: string | null
          contact_role?: string | null
          created_at?: string
          description?: string | null
          headquarters?: string | null
          hiring_roles?: string[] | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          required_skills?: string[] | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_name?: string
          company_size?: string | null
          contact_role?: string | null
          created_at?: string
          description?: string | null
          headquarters?: string | null
          hiring_roles?: string[] | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          required_skills?: string[] | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      credits_ledger: {
        Row: {
          amount: number
          awarded_at: string
          challenge_id: string | null
          id: string
          reason: string
          student_id: string
          submission_id: string | null
        }
        Insert: {
          amount: number
          awarded_at?: string
          challenge_id?: string | null
          id?: string
          reason: string
          student_id: string
          submission_id?: string | null
        }
        Update: {
          amount?: number
          awarded_at?: string
          challenge_id?: string | null
          id?: string
          reason?: string
          student_id?: string
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credits_ledger_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credits_ledger_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      exemption_requests: {
        Row: {
          created_at: string
          credits_at_request: number
          id: string
          reason: string | null
          reviewed_at: string | null
          status: string
          student_id: string
          subject: string
          teacher_id: string | null
        }
        Insert: {
          created_at?: string
          credits_at_request?: number
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          status?: string
          student_id: string
          subject: string
          teacher_id?: string | null
        }
        Update: {
          created_at?: string
          credits_at_request?: number
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          status?: string
          student_id?: string
          subject?: string
          teacher_id?: string | null
        }
        Relationships: []
      }
      grade_approvals: {
        Row: {
          approved_at: string | null
          created_at: string
          dispute_reason: string | null
          id: string
          status: string
          submission_id: string
          teacher_id: string | null
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          dispute_reason?: string | null
          id?: string
          status?: string
          submission_id: string
          teacher_id?: string | null
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          dispute_reason?: string | null
          id?: string
          status?: string
          submission_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grade_approvals_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      hiring_pipeline: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          stage: Database["public"]["Enums"]["pipeline_stage"]
          student_id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          stage?: Database["public"]["Enums"]["pipeline_stage"]
          student_id: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          stage?: Database["public"]["Enums"]["pipeline_stage"]
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      institutions: {
        Row: {
          created_at: string
          domain: string | null
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          company_id: string
          created_at: string
          id: string
          message: string | null
          responded_at: string | null
          role: string
          status: Database["public"]["Enums"]["invitation_status"]
          student_id: string
          type: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          role?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          student_id: string
          type?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          role?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          student_id?: string
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          institution_id: string | null
          is_onboarded: boolean
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id: string
          institution_id?: string | null
          is_onboarded?: boolean
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          institution_id?: string | null
          is_onboarded?: boolean
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_applications: {
        Row: {
          applied_at: string
          challenge_id: string
          cover_letter: string | null
          id: string
          reviewed_at: string | null
          status: Database["public"]["Enums"]["application_status"]
          student_id: string
        }
        Insert: {
          applied_at?: string
          challenge_id: string
          cover_letter?: string | null
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id: string
        }
        Update: {
          applied_at?: string
          challenge_id?: string
          cover_letter?: string | null
          id?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_applications_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          batch: string | null
          career_goals: string[] | null
          created_at: string
          current_semester: string | null
          current_subjects: string[] | null
          existing_skills: string[] | null
          github_url: string | null
          graduation_year: string | null
          hours_per_week: string | null
          id: string
          institution_id: string | null
          interests: string[] | null
          linkedin_url: string | null
          portfolio_url: string | null
          preferred_project_types: string[] | null
          total_credits: number
          university_name: string | null
          university_program: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          batch?: string | null
          career_goals?: string[] | null
          created_at?: string
          current_semester?: string | null
          current_subjects?: string[] | null
          existing_skills?: string[] | null
          github_url?: string | null
          graduation_year?: string | null
          hours_per_week?: string | null
          id?: string
          institution_id?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          preferred_project_types?: string[] | null
          total_credits?: number
          university_name?: string | null
          university_program?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          batch?: string | null
          career_goals?: string[] | null
          created_at?: string
          current_semester?: string | null
          current_subjects?: string[] | null
          existing_skills?: string[] | null
          github_url?: string | null
          graduation_year?: string | null
          hours_per_week?: string | null
          id?: string
          institution_id?: string | null
          interests?: string[] | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          preferred_project_types?: string[] | null
          total_credits?: number
          university_name?: string | null
          university_program?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          application_id: string
          approved_at: string | null
          challenge_id: string
          company_feedback: string | null
          created_at: string
          files_url: string | null
          grade: number | null
          graded_at: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at: string | null
          teacher_feedback: string | null
          video_url: string | null
        }
        Insert: {
          application_id: string
          approved_at?: string | null
          challenge_id: string
          company_feedback?: string | null
          created_at?: string
          files_url?: string | null
          grade?: number | null
          graded_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          video_url?: string | null
        }
        Update: {
          application_id?: string
          approved_at?: string | null
          challenge_id?: string
          company_feedback?: string | null
          created_at?: string
          files_url?: string | null
          grade?: number | null
          graded_at?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submitted_at?: string | null
          teacher_feedback?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "project_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_profiles: {
        Row: {
          created_at: string
          department: string | null
          designation: string | null
          employee_id: string | null
          id: string
          institution_id: string | null
          institution_name: string | null
          institution_type: string | null
          specializations: string[] | null
          subjects_taught: string[] | null
          updated_at: string
          user_id: string
          years_of_experience: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          designation?: string | null
          employee_id?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          institution_type?: string | null
          specializations?: string[] | null
          subjects_taught?: string[] | null
          updated_at?: string
          user_id: string
          years_of_experience?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          designation?: string | null
          employee_id?: string | null
          id?: string
          institution_id?: string | null
          institution_name?: string | null
          institution_type?: string | null
          specializations?: string[] | null
          subjects_taught?: string[] | null
          updated_at?: string
          user_id?: string
          years_of_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_profiles_institution_id_fkey"
            columns: ["institution_id"]
            isOneToOne: false
            referencedRelation: "institutions"
            referencedColumns: ["id"]
          },
        ]
      }
      teacher_settings: {
        Row: {
          created_at: string
          credit_threshold: number
          ia_deadline: string | null
          id: string
          min_projects: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credit_threshold?: number
          ia_deadline?: string | null
          id?: string
          min_projects?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credit_threshold?: number
          ia_deadline?: string | null
          id?: string
          min_projects?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      approve_grade_and_award_credits: {
        Args: {
          p_challenge_id: string
          p_credits: number
          p_submission_id: string
          p_teacher_id: string
        }
        Returns: Json
      }
      complete_student_onboarding: {
        Args: {
          p_batch?: string
          p_career_goals?: string[]
          p_current_semester?: string
          p_current_subjects?: string[]
          p_existing_skills?: string[]
          p_github_url?: string
          p_graduation_year?: string
          p_hours_per_week?: string
          p_interests?: string[]
          p_linkedin_url?: string
          p_portfolio_url?: string
          p_preferred_project_types?: string[]
          p_university_name?: string
          p_university_program?: string
          p_user_id: string
        }
        Returns: Json
      }
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_activity: {
        Args: {
          p_action_type: string
          p_entity_id?: string
          p_entity_type: string
          p_metadata?: Json
          p_user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "company"
      application_status: "pending" | "approved" | "rejected" | "withdrawn"
      challenge_status: "draft" | "active" | "closed" | "archived"
      invitation_status: "pending" | "accepted" | "declined"
      pipeline_stage:
        | "shortlisted"
        | "interviewing"
        | "offer_sent"
        | "hired"
        | "rejected"
      submission_status:
        | "draft"
        | "submitted"
        | "graded"
        | "approved"
        | "disputed"
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
      app_role: ["student", "teacher", "company"],
      application_status: ["pending", "approved", "rejected", "withdrawn"],
      challenge_status: ["draft", "active", "closed", "archived"],
      invitation_status: ["pending", "accepted", "declined"],
      pipeline_stage: [
        "shortlisted",
        "interviewing",
        "offer_sent",
        "hired",
        "rejected",
      ],
      submission_status: [
        "draft",
        "submitted",
        "graded",
        "approved",
        "disputed",
      ],
    },
  },
} as const
