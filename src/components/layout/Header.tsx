import { ScanLine } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card text-card-foreground shadow-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <div className="bg-primary text-primary-foreground p-2 rounded-lg">
          <ScanLine className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold font-headline text-primary">NutriScan Pro</h1>
      </div>
    </header>
  );
}
