import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  // Common fields
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  role: "student" | "teacher" | "company" | null;
  
  // Student specific
  universityName?: string;
  universityProgram?: string;
  batch?: string;
  graduationYear?: string;
  currentSemester?: string;
  currentSubjects?: string[];
  existingSkills?: string[];
  interests?: string[];
  careerGoals?: string[];
  preferredProjectTypes?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  hoursPerWeek?: string;
  
  // Teacher specific
  designation?: string;
  institutionName?: string;
  institutionType?: string;
  department?: string;
  employeeId?: string;
  yearsOfExperience?: string;
  subjectsTaught?: string[];
  specializations?: string[];
  
  // Company specific
  companyName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  headquarters?: string;
  description?: string;
  contactRole?: string;
  hiringRoles?: string[];
  requiredSkills?: string[];
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  isOnboarded: boolean;
  setIsOnboarded: (value: boolean) => void;
}

const defaultUser: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  role: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("heuristic_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem("heuristic_onboarded") === "true";
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("heuristic_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("heuristic_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("heuristic_onboarded", isOnboarded.toString());
  }, [isOnboarded]);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => prev ? { ...prev, ...updates } : { ...defaultUser, ...updates });
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUser, isOnboarded, setIsOnboarded }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
