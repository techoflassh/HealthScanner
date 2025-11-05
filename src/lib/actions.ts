"use server";

import { analyzeDietaryRestrictions, DietaryRestrictionAnalysisInput } from "@/ai/flows/dietary-restriction-analysis";

export async function runDietaryAnalysis(input: DietaryRestrictionAnalysisInput) {
  try {
    const result = await analyzeDietaryRestrictions(input);
    return result;
  } catch (error) {
    console.error("Error in dietary analysis action:", error);
    throw new Error("Failed to analyze dietary restrictions.");
  }
}
