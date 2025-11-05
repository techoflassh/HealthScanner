import PreferencesForm from "@/components/preferences/PreferencesForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PreferencesPage() {
    return (
        <div className="container mx-auto p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Dietary Preferences</CardTitle>
                    <CardDescription>
                        Select your dietary restrictions to get personalized warnings on products.
                    </CardDescription>
                </CardHeader>
            </Card>
            <PreferencesForm />
        </div>
    );
}
