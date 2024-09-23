import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MessageCircle } from "lucide-react";
import { get, put } from "@/utils/authUtils";
import { Skeleton } from "@/components/ui/skeleton";

const NotificationContent: React.FC = () => {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setIsLoading(true);
      const response = await get(
        "/notification_preferences/preferences",
        "other"
      );
      setPreferences(response.preferences);
    } catch (error) {
      console.error("Lỗi khi lấy tùy chọn:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreference = async (preferenceName: string) => {
    try {
      await put(
        `/notification_preferences/preferences/${preferenceName}`,
        "other"
      );
      setPreferences((prev) => ({
        ...prev,
        [preferenceName]: !prev[preferenceName],
      }));
    } catch (error) {
      console.error("Error updating preference:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-background_secondary text-foreground">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(7)].map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="w-10 h-5 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const preferenceItems = [
    {
      name: "order_notification",
      label: "Order Notifications",
      description: "Receive updates about your orders",
    },
    {
      name: "marketing_notification",
      label: "Marketing Notifications",
      description: "Receive promotional offers and updates",
    },
    {
      name: "message_notification",
      label: "Message Notifications",
      description: "Receive notifications for new messages",
    },
    {
      name: "feedback_notification",
      label: "Feedback Notifications",
      description: "Receive notifications for feedback requests",
    },
    {
      name: "email_notification",
      label: "Email Notifications",
      description: "Receive notifications via email",
    },
    {
      name: "account_notification",
      label: "Account Notifications",
      description: "Receive updates about your account",
    },
    {
      name: "other_notification",
      label: "Other Notifications",
      description: "Receive other miscellaneous notifications",
    },
  ];

  return (
    <Card className="bg-background_secondary text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6" />
          <span>Notification Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferenceItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div>
              <Label>{item.label}</Label>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <Switch
              checked={preferences[item.name] || false}
              onCheckedChange={() => togglePreference(item.name)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationContent;
