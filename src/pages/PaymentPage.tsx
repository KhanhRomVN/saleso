import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authUtils } from '@/utils/authUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SessionData {
  _id: string;
  customer_id: string;
  data: {
    orderItems: Array<{
      product_id: string;
      quantity: number;
      sku: string;
      total_amount: number;
      shipping_fee: number;
      shipping_address: string;
      applied_discount: string | null;
    }>;
    payment_method: string;
    payment_status: string;
    shipping_address: string;
  };
  created_at: string;
}

const MomoPayment: React.FC<{ session_id: string }> = ({ session_id }) => (
  <p>session_id: {session_id}</p>
);

const ZaloPayPayment: React.FC<{ session_id: string }> = ({ session_id }) => (
  <p>session_id: {session_id}</p>
);

const VNBankPayment: React.FC<{ session_id: string }> = ({ session_id }) => (
  <p>session_id: {session_id}</p>
);

const IntlBankPayment: React.FC<{ session_id: string }> = ({ session_id }) => (
  <p>session_id: {session_id}</p>
);

export default function PaymentPage() {
  const { session_id } = useParams<{ session_id: string }>();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await authUtils.get(`/session/get/${session_id}`);
        setSessionData(response.data);
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [session_id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (!sessionData) {
    return <div className="text-center text-red-500">Error loading session data</div>;
  }

  const totalAmount = sessionData.data.orderItems.reduce((sum, item) => sum + item.total_amount, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Payment Options</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Total Items: {sessionData.data.orderItems.length}</p>
            <p>Total Amount: ${totalAmount.toFixed(2)}</p>
            <p>Shipping Address: {sessionData.data.shipping_address}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="momo">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="momo">Momo</TabsTrigger>
                <TabsTrigger value="zalopay">ZaloPay</TabsTrigger>
                <TabsTrigger value="vnbank">VN Bank</TabsTrigger>
                <TabsTrigger value="intlbank">Intl Bank</TabsTrigger>
              </TabsList>
              <TabsContent value="momo">
                <MomoPayment session_id={session_id || ''} />
              </TabsContent>
              <TabsContent value="zalopay">
                <ZaloPayPayment session_id={session_id || ''} />
              </TabsContent>
              <TabsContent value="vnbank">
                <VNBankPayment session_id={session_id || ''} />
              </TabsContent>
              <TabsContent value="intlbank">
                <IntlBankPayment session_id={session_id || ''} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Proceed to Payment</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
