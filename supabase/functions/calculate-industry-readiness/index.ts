import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalculationResult {
  industryReadinessScore: number;
  breakdown: {
    difficultyScore: number;
    gradeScore: number;
    authenticityScore: number;
    diversityScore: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { studentId, submissionId } = await req.json();

    if (!studentId) {
      console.error("Missing studentId parameter");
      return new Response(
        JSON.stringify({ error: "studentId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Calculating industry readiness score for student: ${studentId}`);

    // Fetch all approved/graded submissions for the student
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select(`
        id,
        grade,
        authenticity_score,
        status,
        challenge:challenges(
          id,
          difficulty,
          category,
          credits
        )
      `)
      .eq("student_id", studentId)
      .in("status", ["graded", "approved"]);

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError);
      throw submissionsError;
    }

    console.log(`Found ${submissions?.length || 0} graded/approved submissions`);

    // If no submissions, set score to 0
    if (!submissions || submissions.length === 0) {
      const { error: updateError } = await supabase
        .from("student_profiles")
        .update({ industry_readiness_score: 0 })
        .eq("user_id", studentId);

      if (updateError) {
        console.error("Error updating profile:", updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          score: 0, 
          message: "No completed projects yet",
          breakdown: { difficultyScore: 0, gradeScore: 0, authenticityScore: 0, diversityScore: 0 }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate difficulty score (weighted by credits)
    const difficultyWeights: Record<string, number> = {
      Easy: 40,
      Medium: 70,
      Hard: 100,
    };

    let totalDifficultyPoints = 0;
    let totalCredits = 0;
    const uniqueCategories = new Set<string>();

    for (const submission of submissions) {
      const challenge = submission.challenge as unknown as { difficulty: string; category: string; credits: number } | null;
      if (challenge) {
        const difficultyWeight = difficultyWeights[challenge.difficulty] || 50;
        totalDifficultyPoints += difficultyWeight * challenge.credits;
        totalCredits += challenge.credits;
        if (challenge.category) {
          uniqueCategories.add(challenge.category);
        }
      }
    }

    const difficultyScore = totalCredits > 0 ? totalDifficultyPoints / totalCredits : 0;
    console.log(`Difficulty score: ${difficultyScore}`);

    // Calculate average grade score
    const gradesWithValues = submissions.filter((s) => s.grade !== null && s.grade !== undefined);
    const avgGrade = gradesWithValues.length > 0
      ? gradesWithValues.reduce((sum, s) => sum + (s.grade || 0), 0) / gradesWithValues.length
      : 50;
    console.log(`Average grade: ${avgGrade}`);

    // Calculate average authenticity score
    const authScores = submissions.filter((s) => s.authenticity_score !== null && s.authenticity_score !== undefined);
    const avgAuthenticity = authScores.length > 0
      ? authScores.reduce((sum, s) => sum + (s.authenticity_score || 0), 0) / authScores.length
      : 50;
    console.log(`Average authenticity: ${avgAuthenticity}`);

    // Calculate diversity score (unique categories / 5 * 100, capped at 100)
    const diversityScore = Math.min((uniqueCategories.size / 5) * 100, 100);
    console.log(`Diversity score: ${diversityScore} (${uniqueCategories.size} unique categories)`);

    // Final formula: weighted average
    // (projectDifficulty * 0.3) + (avgGrade * 0.3) + (authenticityAvg * 0.2) + (diversityScore * 0.2)
    const industryReadinessScore = Math.round(
      (difficultyScore * 0.3) + 
      (avgGrade * 0.3) + 
      (avgAuthenticity * 0.2) + 
      (diversityScore * 0.2)
    );

    const finalScore = Math.min(Math.max(industryReadinessScore, 0), 100);
    console.log(`Final industry readiness score: ${finalScore}`);

    // Update student profile
    const { error: updateError } = await supabase
      .from("student_profiles")
      .update({ industry_readiness_score: finalScore })
      .eq("user_id", studentId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw updateError;
    }

    // Update skill graph data based on categories
    const categorySkillMap: Record<string, string[]> = {
      frontend: ["Code Quality", "UI/UX"],
      backend: ["Architectural Thinking", "Security"],
      design: ["UI/UX", "Documentation"],
      data: ["Architectural Thinking", "Testing"],
      mobile: ["Code Quality", "Testing"],
      devops: ["Security", "Documentation"],
    };

    // Calculate category-based skill scores
    const skillScores: Record<string, { total: number; count: number }> = {
      "Architectural Thinking": { total: 0, count: 0 },
      "Code Quality": { total: 0, count: 0 },
      "Security": { total: 0, count: 0 },
      "UI/UX": { total: 0, count: 0 },
      "Testing": { total: 0, count: 0 },
      "Documentation": { total: 0, count: 0 },
    };

    for (const submission of submissions) {
      const challenge = submission.challenge as unknown as { category: string } | null;
      const grade = submission.grade || 50;
      
      if (challenge?.category) {
        const skills = categorySkillMap[challenge.category.toLowerCase()] || [];
        for (const skill of skills) {
          if (skillScores[skill]) {
            skillScores[skill].total += grade;
            skillScores[skill].count += 1;
          }
        }
      }
    }

    // Upsert skill graph data
    for (const [category, data] of Object.entries(skillScores)) {
      const score = data.count > 0 ? Math.round(data.total / data.count) : 0;
      
      const { error: skillError } = await supabase
        .from("skill_graph_data")
        .upsert(
          {
            student_id: studentId,
            category,
            score,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id,category" }
        );

      if (skillError) {
        console.error(`Error upserting skill graph data for ${category}:`, skillError);
      }
    }

    console.log("Successfully updated industry readiness score and skill graph");

    return new Response(
      JSON.stringify({
        success: true,
        score: finalScore,
        breakdown: {
          difficultyScore: Math.round(difficultyScore),
          gradeScore: Math.round(avgGrade),
          authenticityScore: Math.round(avgAuthenticity),
          diversityScore: Math.round(diversityScore),
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error calculating industry readiness:", error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
