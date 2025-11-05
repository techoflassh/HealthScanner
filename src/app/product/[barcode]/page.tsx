import { getProduct } from '@/lib/openfoodfacts';
import { notFound } from 'next/navigation';
import ProductClient from '@/components/product/ProductClient';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';


export default async function ProductPage({ params }: { params: { barcode: string } }) {
  const productData = await getProduct(params.barcode);

  if (!productData || !productData.product) {
    return (
        <div className="container mx-auto p-4">
            <Card className="text-center">
                <CardContent className="p-6">
                    <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Product Not Found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        We couldn't find a product with the barcode <span className="font-mono bg-muted p-1 rounded-sm">{params.barcode}</span>.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
  }
  
  return <ProductClient product={productData.product} />;
}
