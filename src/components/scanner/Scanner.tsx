"use client";

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Camera, CheckCircle, FileUp, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const qrcodeRegionId = "reader";

const manualSchema = z.object({
  barcode: z.string().min(8, "Barcode must be at least 8 characters"),
});

export default function Scanner() {
  const router = useRouter();
  const { toast } = useToast();
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'permission' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const form = useForm<z.infer<typeof manualSchema>>({
    resolver: zodResolver(manualSchema),
    defaultValues: { barcode: '' },
  });

  const startScan = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      return;
    }
    setScanState('permission');
    
    try {
      await Html5Qrcode.getCameras();
      const config = {
        fps: 24,
        qrbox: { width: 250, height: 150 },
        supportedScanTypes: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E],
        videoConstraints: {
          facingMode: "environment",
          focusMode: "continuous"
        }
      };
      
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode(qrcodeRegionId, { formatsToSupport: config.supportedScanTypes });
      }

      await html5QrcodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          router.push(`/product/${decodedText}`);
        },
        (errorMessage) => { /* ignore parse errors */ }
      );
      setScanState('scanning');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not start scanner. Please grant camera permissions.');
      setScanState('error');
    }
  };

  const stopScan = async () => {
    if (html5QrcodeRef.current && html5QrcodeRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
      try {
        await html5QrcodeRef.current.stop();
        setScanState('idle');
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to stop the scanner.');
        setScanState('error');
      }
    }
  };

  useEffect(() => {
    // Cleanup function to stop the scanner when the component unmounts
    return () => {
      stopScan();
    };
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Ensure we have an instance before scanning
      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode(qrcodeRegionId, { formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.UPC_A, Html5QrcodeSupportedFormats.UPC_E]});
      }
      try {
        const decodedText = await html5QrcodeRef.current.scanFile(file, false);
        router.push(`/product/${decodedText}`);
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: "Could not find a barcode in the image.",
        });
      }
    }
  };

  const onManualSubmit = (data: z.infer<typeof manualSchema>) => {
    router.push(`/product/${data.barcode}`);
  };

  return (
    <Tabs defaultValue="scan" className="w-full" onValueChange={ (value) => {
        if (value === 'scan') {
             // startScan is called by the button now
        } else {
            stopScan();
        }
    }}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="scan">Camera</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
        <TabsTrigger value="upload">Upload</TabsTrigger>
      </TabsList>
      <TabsContent value="scan">
        <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden relative mt-4">
            <div id={qrcodeRegionId} className="w-full h-full" />
            {scanState === 'permission' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Requesting camera...</p>
                </div>
            )}
             {scanState === 'idle' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                    <Button onClick={startScan} className="animate-pulse">
                        <Camera className="mr-2 h-5 w-5"/>
                        Start Scanning
                    </Button>
                </div>
            )}
            {scanState === 'error' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                    <Button onClick={startScan} className="mt-4">Try Again</Button>
                </div>
            )}
        </div>
      </TabsContent>
      <TabsContent value="manual">
        <div className="pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter barcode..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <CheckCircle />
                Look up Product
              </Button>
            </form>
          </Form>
        </div>
      </TabsContent>
      <TabsContent value="upload">
        <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground mb-4">Scan a barcode from an image in your gallery.</p>
            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
              <FileUp />
              Choose Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
        </div>
      </TabsContent>
    </Tabs>
  );
}
