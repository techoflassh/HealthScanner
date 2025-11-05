"use client";

import { useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/lib/types';
import { calculateHealthScore } from '@/lib/health-score';
import { Button } from '@/components/ui/button';
import HealthScoreGauge from './HealthScoreGauge';
import NutritionInfo from './NutritionInfo';
import { Card, CardContent } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ProductClient({ product }: { product: Product }) {
  const { addToHistory } = useApp();
  const { toast } = useToast();
  const { score, remarks } = calculateHealthScore(product);

  const memoizedAddToHistory = useCallback(addToHistory, [product]);

  useEffect(() => {
    memoizedAddToHistory(product);
  }, [product, memoizedAddToHistory]);

  const productName = product.product_name_en || product.product_name || 'Unknown Product';

  const handleShare = async () => {
    const shareData = {
      title: `NutriScan Pro: ${productName}`,
      text: `Check out ${productName} on NutriScan Pro. It has a health score of ${score}/10.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied!",
          description: "Product page URL copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing', error);
      toast({
        variant: "destructive",
        title: "Sharing Failed",
        description: "Could not share the product information.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative h-48 w-full sm:w-1/3 bg-white rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                    <Image
                        src={product.image_url || `https://picsum.photos/seed/${product.code}/400/400`}
                        alt={productName}
                        fill
                        className="object-contain"
                        unoptimized={!product.image_url}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{product.brands || 'Unknown Brand'}</p>
                    <h1 className="text-2xl font-bold font-headline leading-tight">{productName}</h1>
                    <div className="mt-4">
                      <HealthScoreGauge score={score} remarks={remarks} />
                    </div>
                </div>
            </div>
             <Button onClick={handleShare} size="sm" className="w-full mt-4">
                <Share2 className="mr-2 h-4 w-4" />
                Share Product
            </Button>
        </CardContent>
      </Card>

      <NutritionInfo product={product} />
    </div>
  );
}
