"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Trash2 } from "lucide-react";

export default function HistoryClient() {
    const { scanHistory, clearHistory } = useApp();

    return (
        <div className="mt-4 space-y-4">
            {scanHistory.length > 0 && (
                <div className="flex justify-end">
                    <Button variant="destructive" size="sm" onClick={clearHistory}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear History
                    </Button>
                </div>
            )}

            {scanHistory.length === 0 ? (
                <Card className="text-center">
                    <CardContent className="p-6">
                        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium">No Scans Yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Start scanning products to see your history here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {scanHistory.map((item) => (
                        <Link href={`/product/${item.barcode}`} key={item.barcode}>
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-3 flex items-center gap-4">
                                    <div className="relative h-16 w-16 bg-white rounded-md flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={item.imageUrl || `https://picsum.photos/seed/${item.barcode}/100/100`}
                                            alt={item.productName}
                                            width={64}
                                            height={64}
                                            className="object-contain h-full w-full"
                                            unoptimized={!item.imageUrl}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold leading-tight">{item.productName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Scanned {formatDistanceToNow(new Date(item.scannedAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
