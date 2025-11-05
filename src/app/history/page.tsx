import HistoryClient from "@/components/history/HistoryClient";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryPage() {
    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Scan History</CardTitle>
                    <CardDescription>
                        Here are the products you've recently scanned.
                    </CardDescription>
                </CardHeader>
            </Card>
            <HistoryClient />
        </div>
    )
}
