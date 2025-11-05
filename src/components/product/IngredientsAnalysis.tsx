"use client";

import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { runDietaryAnalysis } from '@/lib/actions';
import type { Product } from '@/lib/types';
import type { DietaryRestrictionAnalysisOutput } from '@/ai/flows/dietary-restriction-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

function WarningSummary({ summary }: { summary: string }) {
    const parts = summary.split(/(\(red\)|\(yellow\)|\(green\))/gi);

    return (
        <p>
            {parts.map((part, index) => {
                if (part === '(red)') {
                    const text = parts[index + 1];
                    parts[index + 1] = '';
                    return <span key={index} className="text-red-600 font-semibold">{text}</span>;
                }
                if (part === '(yellow)') {
                    const text = parts[index + 1];
                    parts[index + 1] = '';
                    return <span key={index} className="text-yellow-600 font-semibold">{text}</span>;
                }
                if (part === '(green)') {
                    const text = parts[index + 1];
                    parts[index + 1] = '';
                    return <span key={index} className="text-emerald-600 font-semibold">{text}</span>;
                }
                return <span key={index}>{part}</span>;
            })}
        </p>
    );
}

export default function IngredientsAnalysis({ product }: { product: Product }) {
  const { preferences } = useApp();
  const [analysis, setAnalysis] = useState<DietaryRestrictionAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preferences.dietaryRestrictions.length > 0) {
      setIsLoading(true);
      setError(null);
      setAnalysis(null);
      
      const nutritionFacts = Object.entries(product.nutriments)
        .map(([key, value]) => `${key.replace(/_100g$/, '')}: ${value}`)
        .join(', ');

      runDietaryAnalysis({
        ingredients: product.ingredients_text_with_allergens_en || product.ingredients_text || '',
        nutritionFacts,
        dietaryPreferences: preferences.dietaryRestrictions,
      })
      .then(setAnalysis)
      .catch(() => setError("An error occurred while analyzing ingredients. Please try again later."))
      .finally(() => setIsLoading(false));
    }
  }, [product, preferences.dietaryRestrictions]);

  if (preferences.dietaryRestrictions.length === 0) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center gap-3">
                <Info className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Set your dietary preferences to get a personalized analysis.</p>
            </CardContent>
        </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Analysis</CardTitle>
          <CardDescription>Checking against your preferences...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (analysis) {
    return (
      <Card className={analysis.isCompliant ? 'border-green-300 dark:border-green-800' : 'border-amber-300 dark:border-amber-800'}>
        <CardHeader>
          <CardTitle>AI-Powered Analysis</CardTitle>
          <CardDescription>Based on your preferences: {preferences.dietaryRestrictions.join(', ')}</CardDescription>
        </CardHeader>
        <CardContent>
          {analysis.isCompliant ? (
            <div className="flex items-center gap-3 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
              <div>
                <p className="font-bold text-lg">Looks Good!</p>
                <p className="text-sm">This product appears to be compliant with your dietary needs.</p>
              </div>
            </div>
          ) : (
             <div className="flex items-start gap-3 text-amber-600">
              <AlertTriangle className="h-8 w-8 mt-1" />
              <div>
                <p className="font-bold text-lg">Potential Issues Found</p>
                <div className="text-foreground/80 mt-2 text-sm space-y-2">
                    <WarningSummary summary={analysis.warningSummary} />
                    {analysis.nonCompliantIngredients.length > 0 && (
                        <div>
                            <p className="font-semibold">Problematic Ingredients:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {analysis.nonCompliantIngredients.map(ing => <Badge key={ing} variant="destructive">{ing}</Badge>)}
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
