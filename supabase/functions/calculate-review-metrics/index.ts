import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[calculate-review-metrics] Starting review metrics calculation...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all companies with their submission review times
    const { data: companies, error: companiesError } = await supabase
      .from("company_profiles")
      .select("user_id");

    if (companiesError) {
      console.error("[calculate-review-metrics] Error fetching companies:", companiesError);
      throw companiesError;
    }

    console.log(`[calculate-review-metrics] Processing ${companies?.length || 0} companies`);

    let updatedCount = 0;

    for (const company of companies || []) {
      // Calculate average review time for this company's challenges
      const { data: submissions, error: submissionsError } = await supabase
        .from("submissions")
        .select(`
          submitted_at,
          graded_at,
          challenge:challenges!inner(company_id)
        `)
        .eq("challenge.company_id", company.user_id)
        .not("submitted_at", "is", null)
        .not("graded_at", "is", null);

      if (submissionsError) {
        console.error(`[calculate-review-metrics] Error fetching submissions for company ${company.user_id}:`, submissionsError);
        continue;
      }

      if (!submissions || submissions.length === 0) {
        console.log(`[calculate-review-metrics] No graded submissions for company ${company.user_id}`);
        continue;
      }

      // Calculate average review time in hours
      let totalHours = 0;
      let validCount = 0;

      for (const submission of submissions) {
        if (submission.submitted_at && submission.graded_at) {
          const submittedAt = new Date(submission.submitted_at).getTime();
          const gradedAt = new Date(submission.graded_at).getTime();
          const diffHours = (gradedAt - submittedAt) / (1000 * 60 * 60);
          
          // Only count positive, reasonable review times (under 720 hours / 30 days)
          if (diffHours > 0 && diffHours < 720) {
            totalHours += diffHours;
            validCount++;
          }
        }
      }

      const avgHours = validCount > 0 ? Math.round((totalHours / validCount) * 10) / 10 : 0;

      // Update company profile
      const { error: updateError } = await supabase
        .from("company_profiles")
        .update({ avg_review_time_hours: avgHours })
        .eq("user_id", company.user_id);

      if (updateError) {
        console.error(`[calculate-review-metrics] Error updating company ${company.user_id}:`, updateError);
      } else {
        updatedCount++;
        console.log(`[calculate-review-metrics] Updated company ${company.user_id}: ${avgHours}h avg review time`);
      }
    }

    console.log(`[calculate-review-metrics] Completed. Updated ${updatedCount} companies.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${updatedCount} companies`,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[calculate-review-metrics] Error:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
