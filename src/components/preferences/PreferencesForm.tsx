"use client";

import { useApp } from "@/context/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { DietaryPreference } from "@/lib/types";

const dietaryOptions: { id: DietaryPreference; label: string; description: string }[] = [
    { id: 'vegan', label: 'Vegan', description: 'No animal products, including meat, dairy, and eggs.' },
    { id: 'gluten-free', label: 'Gluten-Free', description: 'Avoids wheat, barley, rye, and their derivatives.' },
    { id: 'diabetic-friendly', label: 'Diabetic-Friendly', description: 'Low in sugar and simple carbohydrates.' },
    { id: 'low-sodium', label: 'Low-Sodium', description: 'Limits intake of salt and high-sodium ingredients.' },
    { id: 'keto', label: 'Keto', description: 'Very low-carb, high-fat diet.' },
];

export default function PreferencesForm() {
    const { preferences, toggleDietaryRestriction } = useApp();

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                {dietaryOptions.map((option) => (
                    <div key={option.id} className="flex items-start space-x-4">
                        <Switch
                            id={option.id}
                            checked={preferences.dietaryRestrictions.includes(option.id)}
                            onCheckedChange={() => toggleDietaryRestriction(option.id)}
                            aria-label={`Toggle ${option.label} preference`}
                        />
                        <div className="grid gap-1.5">
                            <Label htmlFor={option.id} className="font-semibold text-base cursor-pointer">
                                {option.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
