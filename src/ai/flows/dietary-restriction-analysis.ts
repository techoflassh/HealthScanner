'use server';

/**
 * @fileOverview Analyzes product data to identify allergens or non-compliant ingredients based on user dietary preferences.
 *
 * - analyzeDietaryRestrictions - A function that analyzes dietary restrictions.
 * - DietaryRestrictionAnalysisInput - The input type for the analyzeDietaryRestrictions function.
 * - DietaryRestrictionAnalysisOutput - The return type for the analyzeDietaryRestrictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DietaryRestrictionAnalysisInputSchema = z.object({
  ingredients: z.string().describe('List of ingredients in the product.'),
  nutritionFacts: z.string().describe('Nutritional information of the product.'),
  dietaryPreferences: z
    .array(
      z.enum(['vegan', 'gluten-free', 'diabetic-friendly', 'low-sodium', 'keto'])
    )
    .describe('User selected dietary preferences.'),
});
export type DietaryRestrictionAnalysisInput = z.infer<
  typeof DietaryRestrictionAnalysisInputSchema
>;

const DietaryRestrictionAnalysisOutputSchema = z.object({
  isCompliant: z
    .boolean()
    .describe(
      'Whether the product is compliant with the specified dietary restrictions.'
    ),
  warningSummary: z
    .string()
    .describe(
      'A summary of any warnings or non-compliant ingredients, with color-coded warnings (red for harmful, yellow for moderate, green for healthy).' + 
      'This should explain why the product is non-compliant with the dietary restrictions based on the most relevant factors.'
    ),
  nonCompliantIngredients: z
    .array(z.string())
    .describe('List of ingredients that violate the dietary restrictions.'),
});
export type DietaryRestrictionAnalysisOutput = z.infer<
  typeof DietaryRestrictionAnalysisOutputSchema
>;

export async function analyzeDietaryRestrictions(
  input: DietaryRestrictionAnalysisInput
): Promise<DietaryRestrictionAnalysisOutput> {
  return analyzeDietaryRestrictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dietaryRestrictionAnalysisPrompt',
  input: {schema: DietaryRestrictionAnalysisInputSchema},
  output: {schema: DietaryRestrictionAnalysisOutputSchema},
  prompt: `You are a dietary expert. Analyze the product ingredients and nutritional information based on the user's dietary preferences and warn them if a scanned product contains ingredients that violate their restrictions.

  Ingredients: {{{ingredients}}}
  Nutrition Facts: {{{nutritionFacts}}}
  Dietary Preferences: {{#each dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Determine if the product is compliant with all dietary restrictions. If not, generate a warning summary explaining why the product is non-compliant, highlighting problem ingredients with color codes (red for harmful, yellow for moderate, green for healthy). Also, list the non-compliant ingredients.

  Output should be formatted as JSON:
  {
    "isCompliant": true/false,
    "warningSummary": "Summary of warnings with color-coded highlights.",
    "nonCompliantIngredients": ["Ingredient 1", "Ingredient 2"]
  }
  `,
});

const analyzeDietaryRestrictionsFlow = ai.defineFlow(
  {
    name: 'analyzeDietaryRestrictionsFlow',
    inputSchema: DietaryRestrictionAnalysisInputSchema,
    outputSchema: DietaryRestrictionAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
