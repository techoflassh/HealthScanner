import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Flame, Droplets, Egg, Stethoscope, Carrot, Beef, Wheat, Soup } from 'lucide-react';

const nutrientMap = [
    { key: 'energy-kcal_100g', label: 'Energy', unit: 'kcal', icon: Flame },
    { key: 'fat_100g', label: 'Total Fat', unit: 'g', icon: Egg },
    { key: 'saturated-fat_100g', label: 'Saturated Fat', unit: 'g', icon: Droplets },
    { key: 'trans-fat_100g', label: 'Trans Fat', unit: 'g', icon: Droplets },
    { key: 'cholesterol_100g', label: 'Cholesterol', unit: 'mg', icon: Stethoscope },
    { key: 'sodium_100g', label: 'Sodium', unit: 'g', icon: Soup },
    { key: 'carbohydrates_100g', label: 'Carbohydrates', unit: 'g', icon: Carrot },
    { key: 'sugars_100g', label: 'Total Sugars', unit: 'g', icon: Wheat },
    { key: 'proteins_100g', label: 'Protein', unit: 'g', icon: Beef },
    { key: 'fiber_100g', label: 'Fiber', unit: 'g', icon: Wheat },
    { key: 'calcium_100g', label: 'Calcium', unit: 'mg', icon: Droplets },
    { key: 'iron_100g', label: 'Iron', unit: 'mg', icon: Droplets },
    { key: 'vitamin-a_100g', label: 'Vitamin A', unit: 'IU', icon: Droplets },
    { key: 'vitamin-c_100g', label: 'Vitamin C', unit: 'mg', icon: Droplets },
];

const novaGroupMap: { [key: number]: string } = {
    1: 'A: Unprocessed or minimally processed',
    2: 'B: Processed culinary ingredients',
    3: 'C: Processed foods',
    4: 'D: Ultra-processed foods',
};

export default function NutritionInfo({ product }: { product: Product }) {
  const { nutriments, ingredients, nova_group, nutriscore_grade } = product;

  return (
    <div className="space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Nutritional Facts</CardTitle>
                <p className="text-sm text-muted-foreground">Per 100g / 100ml</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {nutrientMap.map(({ key, label, unit, icon: Icon }) => {
                        let value = nutriments[key];
                        if (value === undefined || value === '') return null;

                        if(key === 'cholesterol_100g' || key === 'calcium_100g' || key === 'iron_100g' || key === 'vitamin-c_100g') {
                            // Convert from g to mg for some values if needed
                            if (unit === 'mg' && typeof value === 'number' && key !== 'sodium_100g') {
                                if(nutriments[`${key.split('_')[0]}_unit`] !== 'mg')
                                    value = Number(value) * 1000;
                            }
                        }

                        if(key === 'sodium_100g'){
                           value = Number(value) * 1000;
                           unit = 'mg';
                        }


                        return (
                            <div key={key}>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                        <p>{label}</p>
                                    </div>
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
        </Card>

        <Accordion type="single" collapsible className="w-full">
            {(nova_group || nutriscore_grade) && (
                <Card>
                    <AccordionItem value="processing" className="border-b-0">
                         <AccordionTrigger className="p-6">
                            <CardTitle>Processing & Quality</CardTitle>
                        </AccordionTrigger>
                        <AccordionContent>
                            <CardContent className="space-y-4 pt-0">
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
                        </AccordionContent>
                    </AccordionItem>
                </Card>
            )}

            <Card>
                 <AccordionItem value="ingredients" className="border-b-0">
                    <AccordionTrigger className="p-6">
                        <CardTitle>All Ingredients</CardTitle>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent>
                            {ingredients && ingredients.length > 0 ? (
                                <div className="space-y-2">
                                    {ingredients.map((ingredient) => (
                                        <div key={ingredient.id}>
                                            <div className="flex justify-between items-center text-sm">
                                                <p className="capitalize">{ingredient.text.replace(/_/g, '')}</p>
                                                <p className="font-semibold text-muted-foreground">
                                                {ingredient.percent_estimate.toFixed(2)}%
                                                </p>
                                            </div>
                                            <Separator className="my-2"/>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No ingredients list available.</p>
                            )}
                        </CardContent>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </Accordion>
    </div>
  );
}
