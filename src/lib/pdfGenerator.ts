import jsPDF from "jspdf";

// Heuristic logo as base64 (blue H in circle)
const HEURISTIC_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADyUlEQVR4nO2ZW4hVVRjHf2fGS+qYl8xLajpq5qWHMCi6UGEVBEVFUUREL0HRQ1BQD0EPQVBBDxUEQQ9BL0UPYRBUkBARFBFBEQRBEIR6K2ey0Urz9BDfwnXWWXvvs/c+Z+bM+MGf2bP3Wuv7/t+31rfWWjM0a9asWbNmzZpVrQW4F1gCTAfGAh3A38BXwAbgPeDdQnNtFXAJMDuQuwX4E/gR+ATYDHwCfFJong1aK4ArgPuBu4FJQH+g/DnANGAZ8BZwKbCy0PwaZB1wNXArsAbYHSqPA84AZgHnA0uBd4AngYuBO4CPCs2zIesI4FngMeDPQvkC4ExgOTAPeA94C3gIOA84A/ig0DwbtAbgLuAVYH+h/DDgSOBsYD6wEHgXeAO4AvgL+LTQPBu0JgGvAe8AOwvl+wPTgVOBpcAbwJvANcB84ONC82zQmggsBT4Cdhe8+wNHAScBpwHLgOXAa8B1wELgk0LzbNAaBbwMfArsKnj3AaYApwAnA6cDrwMrgeuBS4BPC82zQWsE8CLwGbCz4N0bOBo4EZgHnAG8CqwAbgQuAz4rNM8GreHAC8AXwI6Cdx/gKOB44BTgTGAVsBy4CbgU+LzQPBu0hgHPA18C2wvevYDJwLHA8cBZwCrgVeAW4ALgs0LzbNAaAjwPfA1sK3j3BI4EjgOOAc4GVgMrgNuA84FPC82zQasf8CzwHbC14N0TmAIcAxwNnAOsAVYCdwLnAp8VmmeDVh/gWeB7YEvBuycwGTgaOAo4F1gLrALuBs4BPi80zwatXsAzwI/A5oJ3D2ASMBWYB5wHrAVWAvcB5wCfFppng1Yv4GngJ2BTwbs7MBGYCpwEnA+sA1YBDwJnA58WmmeDVk/gKeBnYGPBuxswAZgCnAhcAKwHVgMPAWcBnxaaZ4NWD+Ap4Bfg74J3V2A8MBk4HrgIWA+sAR4FzgA+LzTPBq0ewJPAb8CGgncXYBxwJHAccDGwAdgArAYeB04HPis0zwatbsATwO/A34F3F2AMcCRwHHAJsAHYCGwAVgNPAKcBnxWaZ4NWV+Bx4A9gY8G7EzAGOBI4FrgU2AhsAjYCa4CngFOBzwrNs0GrC/AY8CewueDdERgNHAEcA1wGbAI2A5uAtcAzwCnAZ4Xm2aDVGXgU2AxsCry7AKOBw4EjgMuBzcAWYDOwDngWOBn4rNA8G7Q6AY8Am4Atgfc/wChgMDAJuALYAmwFtgDrgeeAk4BPCs2zQasj8DCwFdga+G8HDgEGAYcCVwJbge3ANmA9sBg4Efik0Dz/B/0HpCDGEqjNmgYAAAAASUVORK5CYII=";

// Verified checkmark badge
const VERIFIED_BADGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAACkUlEQVR4nO2WTUhUURTHf2+mGZumD6IiKAoiKGhRRAQttGhRtGhTtGhRtIigRREtIloU0aJF0aJo0aJoUUQQFBREUBBBQdFHZjOjztBnnrmv+96b++6bccb5wYV7z7n3nP+5H+9eaNCgQYNSdAEnge+AKx4ngA4gE5B3C/gJFEPeD0E3cAh4ARTDpuAecC3w3AD0AV8C7zuA+8CdgL47wFJgJ/Cn9HzAW2A5cBnYCjwLWU7oA84G5M3AfEDv5/MAuA1cBJYAy4BzNcpPAj8AHkTEE0ADsAlYpNdIBa5JQl4GRoEu4BqwEugW7xvAYaAV2AQsB+YAb0LedwMDwDpgbkD+I0AM2AI0Ad/CSxIe1oTlPwSeApcC7xuAy8BmoBPYJn4d8nMVMBdoDfvJAUeB50BXQH4tcB9YL743AD3FIAu0V0oBIAnMAh4CT4H1QBb4CTQB7cq1CXgY0HcVOAd0Aq/C/maBLuC9GGfJFkB2K7AFuFJaXgQ0A2eAnHI9AWyuAHgKnJbyQuC58loI5MQ7D7gCNNVSBdBM8SxguYAfgVt6/xVYL34j8FDvq4GHyoVPOuIBdFayNAIjwDPhsQp4DjzR+xLgoXitAnrFCyABvNH7lcCLkJUJGAJ+K/8k0A/k9H4McE+2bAbeAc+0rF8MfNI7q4cjwKv3q4GXoZUJ6AfOAF+USwro0/vvAr5fQx8QU+4zYK/4TgBx8ToJDAP39X4VMBSy5BDQL14LwE7gXknfIbBPPE4AB+XbELAd+CD1B8nvi0l6+AngupbxHeB4hfx6vT8GXAn6yijXMfHJ6f0lIEewEWMaUCB4F9hBYQcwAfAY2Af0A8eBDwH3CwE3gT0En4oN/tf8A4Ai/K2lRbvNAAAAAElFTkSuQmCC";

export interface ProjectData {
  id: string;
  title: string;
  company: string;
  companyLogoUrl?: string;
  credits: number;
  grade: string;
  skills: string[];
  completedAt: string;
  description: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
  level: number;
}

export interface StudentData {
  name: string;
  title: string;
  university: string;
  email: string;
  totalCredits: number;
  projectsCompleted: number;
  skillScore: number;
  topSkills: string[];
  proEligible: boolean;
  reliabilityVouches: number;
  publicProfileUrl?: string;
}

// Convert URL to base64 with error handling
export const embedImage = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

// Generate QR code as data URL using a simple QR API
export const generateQRCode = async (url: string): Promise<string | null> => {
  try {
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(url)}`;
    return await embedImage(qrApiUrl);
  } catch {
    return null;
  }
};

// Pre-fetch all company logos
const prefetchCompanyLogos = async (projects: ProjectData[]): Promise<Map<string, string>> => {
  const logoMap = new Map<string, string>();
  
  const logoPromises = projects
    .filter(p => p.companyLogoUrl)
    .map(async (project) => {
      const logo = await embedImage(project.companyLogoUrl!);
      if (logo) {
        logoMap.set(project.id, logo);
      }
    });
  
  await Promise.all(logoPromises);
  return logoMap;
};

// Brand colors in RGB
const BRAND_PRIMARY = { r: 59, g: 130, b: 246 }; // Blue-500
const BRAND_SECONDARY = { r: 99, g: 102, b: 241 }; // Indigo-500
const BRAND_SUCCESS = { r: 34, g: 197, b: 94 }; // Green-500
const BRAND_MUTED = { r: 148, g: 163, b: 184 }; // Slate-400
const BRAND_DARK = { r: 15, g: 23, b: 42 }; // Slate-900

export const generatePortfolioPDF = async (
  studentData: StudentData,
  projects: ProjectData[],
  skillCategories: SkillCategory[],
  onProgress?: (progress: number) => void
): Promise<Blob> => {
  onProgress?.(5);
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  
  // Pre-fetch all images
  onProgress?.(10);
  const companyLogos = await prefetchCompanyLogos(projects);
  onProgress?.(30);
  
  // Generate QR code for public profile
  let qrCode: string | null = null;
  if (studentData.publicProfileUrl) {
    qrCode = await generateQRCode(studentData.publicProfileUrl);
  }
  onProgress?.(40);
  
  // === PAGE 1: Header and Summary ===
  
  // Gradient header background
  pdf.setFillColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
  pdf.rect(0, 0, pageWidth, 55, 'F');
  
  // Secondary accent strip
  pdf.setFillColor(BRAND_SECONDARY.r, BRAND_SECONDARY.g, BRAND_SECONDARY.b);
  pdf.rect(0, 52, pageWidth, 3, 'F');
  
  // Heuristic logo in header
  try {
    pdf.addImage(HEURISTIC_LOGO_BASE64, 'PNG', margin, 8, 12, 12);
  } catch {
    // Fallback if logo fails
  }
  
  // Heuristic branding text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HEURISTIC', margin + 15, 15);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Verified Portfolio', margin + 15, 19);
  
  // Pro badge if eligible
  if (studentData.proEligible) {
    pdf.setFillColor(255, 215, 0);
    pdf.roundedRect(pageWidth - margin - 25, 10, 25, 8, 2, 2, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('PRO', pageWidth - margin - 18, 15);
  }
  
  // QR code in header (right side)
  if (qrCode) {
    try {
      pdf.addImage(qrCode, 'PNG', pageWidth - margin - 20, 25, 18, 18);
      pdf.setFontSize(5);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Scan to verify', pageWidth - margin - 17, 45);
    } catch {
      // QR failed, continue without it
    }
  }
  
  // Student name and title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text(studentData.name, margin, 35);
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(studentData.title, margin, 42);
  pdf.setFontSize(9);
  pdf.text(studentData.university, margin, 48);
  
  onProgress?.(50);
  
  // === Summary Stats Section ===
  let yPos = 65;
  
  // Stats boxes
  const statsBoxWidth = (contentWidth - 10) / 3;
  const stats = [
    { label: 'Credits Earned', value: studentData.totalCredits.toString(), color: BRAND_PRIMARY },
    { label: 'Projects Completed', value: studentData.projectsCompleted.toString(), color: BRAND_DARK },
    { label: 'Skill Score', value: `${studentData.skillScore}%`, color: BRAND_SUCCESS },
  ];
  
  stats.forEach((stat, i) => {
    const x = margin + i * (statsBoxWidth + 5);
    
    pdf.setFillColor(245, 247, 250);
    pdf.roundedRect(x, yPos, statsBoxWidth, 22, 3, 3, 'F');
    
    pdf.setTextColor(stat.color.r, stat.color.g, stat.color.b);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(stat.value, x + statsBoxWidth / 2, yPos + 12, { align: 'center' });
    
    pdf.setTextColor(BRAND_MUTED.r, BRAND_MUTED.g, BRAND_MUTED.b);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(stat.label, x + statsBoxWidth / 2, yPos + 18, { align: 'center' });
  });
  
  yPos += 30;
  
  // Reliability badge indicator
  if (studentData.reliabilityVouches > 0) {
    pdf.setFillColor(BRAND_SUCCESS.r, BRAND_SUCCESS.g, BRAND_SUCCESS.b);
    pdf.circle(margin + 3, yPos + 3, 3, 'F');
    pdf.setTextColor(BRAND_DARK.r, BRAND_DARK.g, BRAND_DARK.b);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Highly Reliable (${studentData.reliabilityVouches} teacher vouches)`, margin + 8, yPos + 5);
    yPos += 12;
  }
  
  // === Top Skills Section ===
  pdf.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Top Skills', margin, yPos);
  yPos += 8;
  
  if (studentData.topSkills.length > 0) {
    let skillX = margin;
    const skillY = yPos;
    
    studentData.topSkills.forEach((skill) => {
      const skillWidth = pdf.getTextWidth(skill) + 8;
      
      if (skillX + skillWidth > pageWidth - margin) {
        skillX = margin;
        yPos += 8;
      }
      
      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(skillX, yPos - 4, skillWidth, 7, 2, 2, 'F');
      
      pdf.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(skill, skillX + 4, yPos);
      
      skillX += skillWidth + 3;
    });
    yPos += 12;
  }
  
  onProgress?.(60);
  
  // === Skills Breakdown Section ===
  if (skillCategories.length > 0) {
    yPos += 5;
    pdf.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Skills Breakdown', margin, yPos);
    yPos += 10;
    
    skillCategories.forEach((cat) => {
      // Category name
      pdf.setTextColor(BRAND_DARK.r, BRAND_DARK.g, BRAND_DARK.b);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(cat.category, margin, yPos);
      
      // Level percentage
      pdf.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      pdf.text(`${cat.level}%`, margin + 35, yPos);
      
      // Progress bar background
      pdf.setFillColor(226, 232, 240);
      pdf.roundedRect(margin + 50, yPos - 3, 60, 4, 1, 1, 'F');
      
      // Progress bar fill
      pdf.setFillColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      pdf.roundedRect(margin + 50, yPos - 3, 60 * (cat.level / 100), 4, 1, 1, 'F');
      
      // Skills list
      pdf.setTextColor(BRAND_MUTED.r, BRAND_MUTED.g, BRAND_MUTED.b);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      const skillsText = cat.skills.slice(0, 5).join(', ');
      pdf.text(skillsText, margin + 115, yPos, { maxWidth: contentWidth - 115 });
      
      yPos += 10;
    });
  }
  
  onProgress?.(70);
  
  // === Projects Section ===
  yPos += 5;
  pdf.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Verified Projects', margin, yPos);
  yPos += 10;
  
  // Filter only verified/graded projects
  const verifiedProjects = projects.filter(p => p.grade !== 'Draft');
  
  verifiedProjects.forEach((project, index) => {
    // Check if we need a new page
    if (yPos > pageHeight - 50) {
      pdf.addPage();
      yPos = margin;
      
      // Smaller header on subsequent pages
      pdf.setFillColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      pdf.rect(0, 0, pageWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(`${studentData.name} - Portfolio (continued)`, margin, 10);
      yPos = 25;
    }
    
    // Project card background
    pdf.setFillColor(250, 250, 252);
    pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');
    
    // Company logo
    const logo = companyLogos.get(project.id);
    let textStartX = margin + 5;
    if (logo) {
      try {
        pdf.addImage(logo, 'PNG', margin + 3, yPos + 3, 10, 10);
        textStartX = margin + 16;
      } catch {
        // Logo failed, continue without it
      }
    }
    
    // Project title
    pdf.setTextColor(BRAND_DARK.r, BRAND_DARK.g, BRAND_DARK.b);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text(project.title, textStartX, yPos + 8);
    
    // Company and metadata
    pdf.setTextColor(BRAND_MUTED.r, BRAND_MUTED.g, BRAND_MUTED.b);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${project.company} • ${project.credits} Credits • ${project.completedAt}`, textStartX, yPos + 14);
    
    // Grade badge
    const gradeColors: Record<string, { r: number; g: number; b: number }> = {
      'Excellent': { r: 34, g: 197, b: 94 },
      'Satisfied': { r: 59, g: 130, b: 246 },
      'Needs Improvement': { r: 249, g: 115, b: 22 },
    };
    const gradeColor = gradeColors[project.grade] || BRAND_MUTED;
    
    pdf.setFillColor(gradeColor.r, gradeColor.g, gradeColor.b);
    const gradeWidth = pdf.getTextWidth(project.grade) + 6;
    pdf.roundedRect(pageWidth - margin - gradeWidth - 5, yPos + 3, gradeWidth, 6, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text(project.grade, pageWidth - margin - gradeWidth / 2 - 2, yPos + 7, { align: 'center' });
    
    // Skills
    if (project.skills.length > 0) {
      pdf.setTextColor(BRAND_MUTED.r, BRAND_MUTED.g, BRAND_MUTED.b);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Skills: ${project.skills.join(', ')}`, textStartX, yPos + 20);
    }
    
    // Verified checkmark
    try {
      pdf.addImage(VERIFIED_BADGE_BASE64, 'PNG', pageWidth - margin - 8, yPos + 18, 5, 5);
    } catch {
      // Badge failed, continue
    }
    
    yPos += 32;
  });
  
  onProgress?.(85);
  
  // === Footer with verification ===
  const addFooter = (pageNum: number, totalPages: number) => {
    // Verification watermark
    pdf.setFillColor(245, 247, 250);
    pdf.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    pdf.setDrawColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    pdf.setLineWidth(0.5);
    pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    // Verified by Heuristic text
    pdf.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('✓ Verified by Heuristic', margin, pageHeight - 12);
    
    // Timestamp
    pdf.setTextColor(BRAND_MUTED.r, BRAND_MUTED.g, BRAND_MUTED.b);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    pdf.text(`Generated: ${timestamp}`, margin, pageHeight - 7);
    
    // Page number
    pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    
    // Public URL
    if (studentData.publicProfileUrl) {
      pdf.setTextColor(BRAND_PRIMARY.r, BRAND_PRIMARY.g, BRAND_PRIMARY.b);
      pdf.text(studentData.publicProfileUrl, pageWidth / 2, pageHeight - 7, { align: 'center' });
    }
  };
  
  // Add footer to all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    addFooter(i, totalPages);
  }
  
  onProgress?.(100);
  
  return pdf.output('blob');
};

export const downloadPDF = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
