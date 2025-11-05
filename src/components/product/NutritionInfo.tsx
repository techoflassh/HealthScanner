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

const novaGroupMap: { [key: number]: {label: string, description: string} } = {
    1: { label: 'Unprocessed', description: 'Unprocessed or minimally processed foods' },
    2: { label: 'Processed Culinary', description: 'Processed culinary ingredients' },
    3: { label: 'Processed', description: 'Processed foods' },
    4: { label: 'Ultra-processed', description: 'Ultra-processed food and drink products' },
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

        {(nova_group || nutriscore_grade) && (
            <Card>
                <CardHeader>
                    <CardTitle>Processing & Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {nutriscore_grade && (
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-sm font-semibold text-muted-foreground">NUTRI-SCORE</p>
                            <img
                                src={`https://static.openfoodfacts.org/images/misc/nutriscore-${nutriscore_grade}.svg`}
                                alt={`Nutri-Score ${nutriscore_grade.toUpperCase()}`}
                                className="h-14 mx-auto my-2"
                            />
                            <p className="text-lg font-bold">Grade {nutriscore_grade.toUpperCase()}</p>
                        </div>
                    )}
                    {nova_group && (
                         <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-sm font-semibold text-muted-foreground">NOVA GROUP</p>
                            <p className="text-4xl font-bold my-2">{nova_group}</p>
                            <p className="text-lg font-semibold">{novaGroupMap[nova_group]?.label || 'Unknown'}</p>
                             <p className="text-sm text-muted-foreground">{novaGroupMap[nova_group]?.description || ''}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}

        <Accordion type="single" collapsible className="w-full">
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