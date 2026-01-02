import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AppRole = "student" | "teacher" | "company";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  institutionId: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: AppRole | null;
  isOnboarded: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  setRole: (role: AppRole) => Promise<{ error: Error | null }>;
  completeOnboarding: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRoleState] = useState<AppRole | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setRoleState(null);
          setIsOnboarded(false);
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user role from database - expect exactly one row per user
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (roleError) {
        console.error("[AuthContext] Role fetch error:", roleError);
        setRoleState(null);
      } else if (roleData) {
        setRoleState(roleData.role as AppRole);
      } else {
        // No role exists - user needs to select one at /get-started
        setRoleState(null);
      }

      // Fetch profile from database (source of truth)
      let { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email, phone, avatar_url, is_onboarded, institution_id")
        .eq("id", userId)
        .maybeSingle();

      // If profile doesn't exist, create it (handles case where trigger on auth.users was removed)
      if (!profileData && !profileError) {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              first_name: userData.user.user_metadata?.first_name || '',
              last_name: userData.user.user_metadata?.last_name || '',
              email: userData.user.email || '',
              is_onboarded: false,
            })
            .select()
            .single();
          
          if (insertError) {
            console.error("[AuthContext] Profile creation error:", insertError);
          } else {
            profileData = newProfile;
          }
        }
      }

      if (profileData) {
        setIsOnboarded(profileData.is_onboarded);
        setProfile({
          id: profileData.id,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          email: profileData.email,
          phone: profileData.phone,
          avatarUrl: profileData.avatar_url,
          institutionId: profileData.institution_id,
        });
      } else {
        // No profile and couldn't create - set safe defaults
        setIsOnboarded(false);
        setProfile(null);
      }
    } catch (error) {
      console.error("[AuthContext] Error fetching user data:", error);
      // On error, reset to safe state - will redirect to /get-started
      setRoleState(null);
      setIsOnboarded(false);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Clear all state - no localStorage needed
      setRoleState(null);
      setIsOnboarded(false);
      setProfile(null);
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setRole = async (newRole: AppRole) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      // Use upsert to ensure exactly one role per user (replaces existing role)
      const { error } = await supabase
        .from("user_roles")
        .upsert(
          { user_id: user.id, role: newRole },
          { onConflict: 'user_id' }
        );

      if (error) throw error;
      
      // Update local state immediately
      setRoleState(newRole);
      
      return { error: null };
    } catch (error) {
      console.error("[AuthContext] Set role error:", error);
      return { error: error as Error };
    }
  };

  const completeOnboarding = async () => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_onboarded: true })
        .eq("id", user.id);

      if (error) throw error;
      
      setIsOnboarded(true);
      return { error: null };
    } catch (error) {
      console.error("Complete onboarding error:", error);
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        isOnboarded,
        isLoading,
        signUp,
        signIn,
        signOut,
        setRole,
        completeOnboarding,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
