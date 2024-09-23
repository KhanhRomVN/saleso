import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

const PaymentContent: React.FC = () => {
  return (
    <Card className="bg-background_secondary text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-6 h-6" />
          <span>Payment Methods</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Credit/Debit Card</Label>
          <Input placeholder="Card Number" className="bg-input" />
          <div className="flex space-x-4">
            <Input placeholder="MM/YY" className="bg-input w-1/2" />
            <Input placeholder="CVV" className="bg-input w-1/2" />
          </div>
          <Button className="w-full">Add Card</Button>
        </div>
        <Separator />
        <div>
          <Label>Saved Payment Methods</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <span>Visa ending in 1234</span>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span>PayPal</span>
              <Button variant="outline" size="sm">
                Remove
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentContent;
