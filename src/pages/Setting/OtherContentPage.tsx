import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Bell, Shield, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";


const OtherContent: React.FC = () => {
  return (
    <Card className="bg-background_secondary text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="w-6 h-6" />
          <span>Other Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </div>
          <Button variant="outline">Manage</Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Security</span>
          </div>
          <Button variant="outline">Review</Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5" />
            <span>Help & Support</span>
          </div>
          <Button variant="outline">Contact</Button>
        </div>
        <Separator />
        <Button variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default OtherContent;
