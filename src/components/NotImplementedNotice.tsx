import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => window.history.back()}
        className="mt-2"
      >
        Go Back
      </Button>
    </div>
  );
};

export const NotImplementedNotice: React.FC<NotImplementedNoticeProps> = ({
  title,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Under Construction</AlertTitle>
        <AlertDescription>
          The {title} section is currently being developed. Check back soon for
          updates!
        </AlertDescription>
      </Alert>
      <Button variant="outline" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </div>
  );
};
