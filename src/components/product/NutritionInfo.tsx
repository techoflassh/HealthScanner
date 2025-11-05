import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const nutrientMap = [
    { key: 'energy-kcal_100g', label: 'Calories', unit: 'kcal' },
    { key: 'proteins_100g', label: 'Protein', unit: 'g' },
    { key: 'carbohydrates_100g', label: 'Carbs', unit: 'g' },
    { key: 'sugars_100g', label: 'Sugar', unit: 'g' },
    { key: 'fat_100g', label: 'Fat', unit: 'g' },
    { key: 'saturated-fat_100g', label: 'Saturated Fat', unit: 'g' },
    { key: 'trans-fat_100g', label: 'Trans Fat', unit: 'g' },
    { key: 'cholesterol_100g', label: 'Cholesterol', unit: 'mg' },
    { key: 'fiber_100g', label: 'Fiber', unit: 'g' },
    { key: 'sodium_100g', label: 'Sodium', unit: 'g' },
    { key: 'calcium_100g', label: 'Calcium', unit: 'mg' },
    { key: 'iron_100g', label: 'Iron', unit: 'mg' },
    { key: 'vitamin-a_100g', label: 'Vitamin A', unit: 'IU' },
    { key: 'vitamin-c_100g', label: 'Vitamin C', unit: 'mg' },
];

const novaGroupMap: { [key: number]: string } = {
    1: 'A: Unprocessed or minimally processed',
    2: 'B: Processed culinary ingredients',
    3: 'C: Processed foods',
    4: 'D: Ultra-processed foods',
};

export default function NutritionInfo({ product }: { product: Product }) {
  const { nutriments, ingredients_text_with_allergens_en, ingredients_text, nova_group, nutriscore_grade } = product;

  return (
    <div className="space-y-4">
        <Accordion type="single" collapsible className="w-full" defaultValue='nutrients'>
            <Card>
                <AccordionItem value="nutrients" className="border-b-0">
                    <AccordionTrigger className="p-6">
                        <CardTitle>Nutritional Facts</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Per 100g / 100ml</p>
                            <div className="space-y-2">
                                {nutrientMap.map(({ key, label, unit }) => {
                                    let value = nutriments[key];
                                    if (value === undefined || value === '') return null;

                                    if(key === 'cholesterol_100g') {
                                        // OpenFoodFacts provides cholesterol in grams, so convert to mg
                                        value = Number(value) * 1000;
                                    }

                                    return (
                                        <div key={key}>
                                            <div className="flex justify-between items-center text-sm">
                                                <p>{label}</p>
                                                <p className="font-semibold">
                                                    {Number(value).toFixed(1)} {unit}
                                                </p>
                                            </div>
                                            <Separator className="my-2"/>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Card>

            {(nova_group || nutriscore_grade) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Processing & Quality</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {nutriscore_grade && (
                            <div className="flex items-center gap-4">
                                <p className="font-semibold w-28">Nutri-Score</p>
                                <img
                                    src={`https://static.openfoodfacts.org/images/misc/nutriscore-${nutriscore_grade}.svg`}
                                    alt={`Nutri-Score ${nutriscore_grade.toUpperCase()}`}
                                    className="h-10"
                                />
                            </div>
                        )}
                        {nova_group && (
                            <div className="flex items-center gap-4">
                                <p className="font-semibold w-28">NOVA Group</p>
                                <p className="text-sm">{novaGroupMap[nova_group] || `Unknown (${nova_group})`}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <Card>
                 <AccordionItem value="ingredients" className="border-b-0">
                    <AccordionTrigger className="p-6">
                        <CardTitle>All Ingredients</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: (ingredients_text_with_allergens_en || ingredients_text || 'No ingredients list available.').replace(/_/g, '') }}
                            />
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </Accordion>
    </div>
  );
}
