import Scanner from '@/components/scanner/Scanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ScanPage() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Scan a Barcode</CardTitle>
          <CardDescription>
            Point your camera at a barcode to get instant nutritional information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Scanner />
        </CardContent>
      </Card>
    </div>
  );
}
