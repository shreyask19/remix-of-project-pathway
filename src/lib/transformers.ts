/**
 * Data Transformation Layer (DTO Pattern)
 * 
 * Provides bidirectional conversion between database snake_case fields
 * and frontend camelCase interfaces. Ensures type safety and eliminates
 * runtime undefined errors from field name mismatches.
 */

import type { Database } from "@/integrations/supabase/types";

// Database row types
type DbChallenge = Database["public"]["Tables"]["challenges"]["Row"];
type DbSubmission = Database["public"]["Tables"]["submissions"]["Row"];
type DbStudentProfile = Database["public"]["Tables"]["student_profiles"]["Row"];
type DbCompanyProfile = Database["public"]["Tables"]["company_profiles"]["Row"];
type DbExemptionRequest = Database["public"]["Tables"]["exemption_requests"]["Row"];

// ============= CHALLENGE TRANSFORMERS =============

export interface Challenge {
  id: string;
  companyId: string;
  title: string;
  description: string;
  difficulty: string;
  credits: number;
  deadline: string | null;
  requiredSkills: string[];
  category: string;
  status: string;
  maxApplicants: number;
  currentApplicants: number;
  createdAt: string;
  company?: {
    companyName: string;
    logoUrl: string | null;
  } | null;
}

export function challengeFromDb(
  row: DbChallenge & { company?: { company_name: string; logo_url: string | null } | null }
): Challenge {
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    credits: row.credits,
    deadline: row.deadline,
    requiredSkills: row.required_skills || [],
    category: row.category || "",
    status: row.status,
    maxApplicants: row.max_applicants || 50,
    currentApplicants: row.current_applicants,
    createdAt: row.created_at,
    company: row.company ? {
      companyName: row.company.company_name,
      logoUrl: row.company.logo_url,
    } : null,
  };
}

export interface ChallengeInput {
  title: string;
  description: string;
  difficulty: string;
  credits: number;
  deadline?: string | null;
  requiredSkills: string[];
  category: string;
  maxApplicants?: number;
}

export function challengeToDb(data: ChallengeInput, companyId: string) {
  return {
    company_id: companyId,
    title: data.title,
    description: data.description,
    difficulty: data.difficulty,
    credits: data.credits,
    deadline: data.deadline || null,
    required_skills: data.requiredSkills,
    category: data.category,
    max_applicants: data.maxApplicants || 50,
  };
}

// ============= SUBMISSION TRANSFORMERS =============

export interface AuthenticityBreakdown {
  github?: { score: number; details: string };
  video?: { score: number; details: string };
  timing?: { score: number; details: string };
  overall?: number;
}

export interface Submission {
  id: string;
  studentId: string;
  challengeId: string;
  applicationId: string;
  status: string;
  filesUrl: string | null;
  videoUrl: string | null;
  notes: string | null;
  grade: number | null;
  companyFeedback: string | null;
  teacherFeedback: string | null;
  submittedAt: string | null;
  gradedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  // Authenticity fields
  authenticityScore: number | null;
  authenticityBreakdown: AuthenticityBreakdown | null;
  githubRepoUrl: string | null;
  githubVerifiedAt: string | null;
  videoVerifiedAt: string | null;
  flaggedForReview: boolean;
  flagReasons: string[];
  challenge?: {
    id: string;
    title: string;
    credits: number;
    companyId: string;
  } | null;
  studentProfile?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  student?: {
    userId: string;
    universityName: string | null;
  } | null;
}

export function submissionFromDb(
  row: any
): Submission {
  return {
    id: row.id,
    studentId: row.student_id,
    challengeId: row.challenge_id,
    applicationId: row.application_id,
    status: row.status,
    filesUrl: row.files_url,
    videoUrl: row.video_url,
    notes: row.notes,
    grade: row.grade,
    companyFeedback: row.company_feedback,
    teacherFeedback: row.teacher_feedback,
    submittedAt: row.submitted_at,
    gradedAt: row.graded_at,
    approvedAt: row.approved_at,
    createdAt: row.created_at,
    // Authenticity fields
    authenticityScore: row.authenticity_score ?? null,
    authenticityBreakdown: row.authenticity_breakdown ?? null,
    githubRepoUrl: row.github_repo_url ?? null,
    githubVerifiedAt: row.github_verified_at ?? null,
    videoVerifiedAt: row.video_verified_at ?? null,
    flaggedForReview: row.flagged_for_review ?? false,
    flagReasons: row.flag_reasons ?? [],
    challenge: row.challenge ? {
      id: row.challenge.id,
      title: row.challenge.title,
      credits: row.challenge.credits,
      companyId: row.challenge.company_id,
    } : null,
    studentProfile: row.studentProfile ? {
      firstName: row.studentProfile.first_name,
      lastName: row.studentProfile.last_name,
      email: row.studentProfile.email,
    } : null,
    student: row.student ? {
      userId: row.student.user_id,
      universityName: row.student.university_name,
    } : null,
  };
}

// ============= STUDENT PROFILE TRANSFORMERS =============

export interface StudentProfile {
  id: string;
  userId: string;
  universityName: string | null;
  universityProgram: string | null;
  batch: string | null;
  graduationYear: string | null;
  currentSemester: string | null;
  currentSubjects: string[];
  existingSkills: string[];
  interests: string[];
  careerGoals: string[];
  preferredProjectTypes: string[];
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  hoursPerWeek: string | null;
  totalCredits: number;
  institutionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export function studentProfileFromDb(row: DbStudentProfile): StudentProfile {
  return {
    id: row.id,
    userId: row.user_id,
    universityName: row.university_name,
    universityProgram: row.university_program,
    batch: row.batch,
    graduationYear: row.graduation_year,
    currentSemester: row.current_semester,
    currentSubjects: row.current_subjects || [],
    existingSkills: row.existing_skills || [],
    interests: row.interests || [],
    careerGoals: row.career_goals || [],
    preferredProjectTypes: row.preferred_project_types || [],
    linkedinUrl: row.linkedin_url,
    githubUrl: row.github_url,
    portfolioUrl: row.portfolio_url,
    hoursPerWeek: row.hours_per_week,
    totalCredits: row.total_credits,
    institutionId: row.institution_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============= COMPANY PROFILE TRANSFORMERS =============

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  industry: string | null;
  companySize: string | null;
  headquarters: string | null;
  website: string | null;
  description: string | null;
  logoUrl: string | null;
  contactRole: string | null;
  hiringRoles: string[];
  requiredSkills: string[];
  createdAt: string;
  updatedAt: string;
}

export function companyProfileFromDb(row: DbCompanyProfile): CompanyProfile {
  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    industry: row.industry,
    companySize: row.company_size,
    headquarters: row.headquarters,
    website: row.website,
    description: row.description,
    logoUrl: row.logo_url,
    contactRole: row.contact_role,
    hiringRoles: row.hiring_roles || [],
    requiredSkills: row.required_skills || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============= EXEMPTION REQUEST TRANSFORMERS =============

export interface ExemptionRequest {
  id: string;
  studentId: string;
  teacherId: string | null;
  subject: string;
  creditsAtRequest: number;
  status: string;
  reason: string | null;
  reviewedAt: string | null;
  createdAt: string;
  studentProfile?: {
    firstName: string;
    lastName: string;
  } | null;
  currentCredits?: number;
}

export function exemptionRequestFromDb(
  row: DbExemptionRequest & {
    studentProfile?: { first_name: string; last_name: string } | null;
    currentCredits?: number;
  }
): ExemptionRequest {
  return {
    id: row.id,
    studentId: row.student_id,
    teacherId: row.teacher_id,
    subject: row.subject,
    creditsAtRequest: row.credits_at_request,
    status: row.status,
    reason: row.reason,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    studentProfile: row.studentProfile ? {
      firstName: row.studentProfile.first_name,
      lastName: row.studentProfile.last_name,
    } : null,
    currentCredits: row.currentCredits,
  };
}

// ============= UTILITY HELPERS =============

/**
 * Calculate deadline display string
 */
export function formatDeadline(deadline: string | null): string {
  if (!deadline) return "No deadline";
  
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Expired";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days`;
}

/**
 * Map numeric grade to label
 */
export function getGradeLabel(grade: number | null): string {
  if (grade === null) return "Not graded";
  if (grade >= 90) return "Excellent";
  if (grade >= 75) return "Satisfied";
  if (grade >= 50) return "Average";
  return "Dissatisfied";
}

/**
 * Map label to numeric grade
 */
export function getLabelToGrade(label: string): number {
  switch (label) {
    case "Excellent": return 95;
    case "Satisfied": return 80;
    case "Average": return 65;
    case "Dissatisfied": return 40;
    default: return 0;
  }
}
