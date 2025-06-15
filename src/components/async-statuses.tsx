import { AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export const LoadingStatus = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="text-lg font-medium">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ErrorStatus = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Oops! An error occured!
            </h3>
            <h2>Too many requests! Try again in a few seconds!</h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
