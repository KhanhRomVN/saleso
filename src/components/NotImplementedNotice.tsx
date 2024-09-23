import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface NotImplementedNoticeProps {
  title: string;
}

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onRetry,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="pt-6 pb-4 px-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
          <AlertDescription className="mt-2">{message}</AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pb-6 px-6">
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            Try Again
          </Button>
        )}
        <Button variant="default" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export const NotImplementedNotice: React.FC<NotImplementedNoticeProps> = ({
  title,
}) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardContent className="pt-6 pb-4 px-6">
        <Alert className="mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          <AlertTitle className="text-lg font-semibold">
            Under Construction
          </AlertTitle>
          <AlertDescription className="mt-2">
            The <span className="font-medium">{title}</span> section is
            currently being developed. Check back soon for updates!
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="flex justify-end pb-6 px-6">
        <Button variant="default" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </CardFooter>
    </Card>
  );
};
