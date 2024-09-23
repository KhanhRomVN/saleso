import { useState, useEffect, useMemo } from "react";
import { get, post } from "@/utils/authUtils";
import { toast } from "react-toastify";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  DollarSign,
  MapPin,
  Calendar,
  RotateCcw,
  X,
  Package,
} from "lucide-react";
import { CheckCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ErrorDisplay } from "@/components/NotImplementedNotice";
import { CardFooter } from "@/components/ui/card";

interface Order {
  _id: string;
  product_id: string;
  quantity: number;
  sku: string;
  total_amount: number;
  shipping_fee: number;
  shipping_address: string;
  customer_id: string;
  seller_id: string;
  order_status: string;
  created_at: string;
  sku_name: string;
  product_image: string;
  product_name: string;
  product_address: string;
}

const OrderContent: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [reversalReason, setReversalReason] = useState("");
  const [isReversalModalOpen, setIsReversalModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await get<Order[]>(
          `/order/${activeTab.toLowerCase()}`,
          "order"
        );

        // Map the response to match the expected Order interface
        const mappedOrders = response.map((order: any) => ({
          _id: order._id,
          product_id: order.product_id,
          quantity: order.quantity,
          sku: order.sku || "",
          total_amount: order.total_amount,
          shipping_fee: order.shipping_fee || 0,
          shipping_address: order.shipping_address,
          customer_id: order.customer_id,
          seller_id: order.seller_id || "",
          order_status: order.order_status,
          created_at: order.created_at || new Date().toISOString(),
          sku_name: order.sku_name || "",
          product_image: order.product_image,
          product_name: order.product_name,
          product_address: order.product_address || "",
          reversal_reason: order.reversal_reason || "",
          reversal_status: order.reversal_status || "",
        }));

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
        toast.error("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const statusIcons = useMemo(
    () => ({
      Pending: <Package className="w-6 h-6 text-yellow-500" />,
      Accepted: <CheckCircle className="w-6 h-6 text-green-500" />,
      Refused: <XCircle className="w-6 h-6 text-red-500" />,
      Reversed: <RotateCcw className="w-6 h-6 text-blue-500" />, // Added Reversed status icon
    }),
    []
  );

  const renderOrderCard = (order: Order) => (
    <motion.div
      key={order._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 hover:shadow-lg transition-shadow duration-300 bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-gray-200">
            <span className="text-sm md:text-base">
              Order #{order._id.slice(-6)}
            </span>
            <Badge variant="outline" className="bg-gray-700 text-yellow-400">
              {activeTab}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <img
              src={order.product_image}
              alt={order.product_name}
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md mr-4"
            />
            <div>
              <h3 className="font-semibold text-sm md:text-base text-gray-200">
                {order.product_name}
              </h3>
              <p className="text-xs md:text-sm text-gray-400">
                SKU: {order.sku_name}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm mb-4 text-gray-300">
            <p className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2 text-blue-400" /> Quantity:{" "}
              {order.quantity}
            </p>
            <p className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2 text-green-400" /> Total: $
              {order.total_amount.toFixed(2)}
            </p>
            <p className="flex items-center col-span-2">
              <MapPin className="w-4 h-4 mr-2 text-purple-400" /> Shipping:{" "}
              {order.shipping_address}
            </p>
            <p className="flex items-center col-span-2">
              <Calendar className="w-4 h-4 mr-2 text-red-400" /> Ordered:{" "}
              {format(new Date(order.created_at), "PPP")}
            </p>
          </div>
          <div className="text-xs md:text-sm text-gray-400">
            <p className="font-semibold text-gray-300">Shipping Route:</p>
            <p>
              {order.shipping_address} → {order.product_address}
            </p>
          </div>
          {activeTab === "Accepted" && (
            <div className="mt-4">
              <Dialog
                open={isReversalModalOpen}
                onOpenChange={setIsReversalModalOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => setCurrentOrderId(order._id)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reversal Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-800 text-gray-100">
                  <DialogHeader>
                    <DialogTitle>Reversal Order</DialogTitle>
                  </DialogHeader>
                  <Textarea
                    placeholder="Enter reason for reversal"
                    value={reversalReason}
                    onChange={(e) => setReversalReason(e.target.value)}
                    className="mt-4 bg-gray-700 text-gray-100"
                  />
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsReversalModalOpen(false)}
                      className="mr-2"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleReversalSubmit}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Submit Reversal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const handleReversalSubmit = async () => {
    try {
      console.log(currentOrderId);
      await post(`/reversal/${currentOrderId}`, "order", {
        reason: reversalReason,
      });

      const response = await get<Order[]>(
        `/order/${activeTab.toLowerCase()}`,
        "order"
      );
      setOrders(response);
      setIsReversalModalOpen(false);
      setReversalReason("");
    } catch (error) {
      console.error("Error submitting reversal:", error);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 shadow-lg">
        <CardHeader className="border-b border-gray-800">
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t border-gray-800 pt-4">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} />;
  }

  return (
    <div className="container mx-auto p-4 bg-background_secondary text-gray-100">
      <Tabs
        defaultValue="Pending"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-800">
          {" "}
          {/* Changed grid-cols-3 to grid-cols-4 */}
          {Object.keys(statusIcons).map((status) => (
            <TabsTrigger
              key={status}
              value={status}
              className="flex items-center justify-center py-2 data-[state=active]:bg-gray-700"
            >
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="ml-2 text-xs md:text-sm">{status}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(statusIcons).map((status) => (
          <TabsContent key={status} value={status}>
            <h2 className="text-xl md:text-2xl font-bold mb-6 flex items-center text-gray-200">
              {statusIcons[status as keyof typeof statusIcons]}
              <span className="ml-2">{status} Orders</span>
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <Card key={n} className="mb-4 bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-2/3 mb-4 bg-gray-700" />
                      <Skeleton className="h-20 w-full mb-4 bg-gray-700" />
                      <Skeleton className="h-4 w-1/2 mb-2 bg-gray-700" />
                      <Skeleton className="h-4 w-1/3 bg-gray-700" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {orders.length > 0 ? (
                    orders
                      .filter(
                        (order) =>
                          order.order_status.toLowerCase() ===
                          activeTab.toLowerCase()
                      ) // Filter orders based on activeTab
                      .map(renderOrderCard)
                  ) : (
                    <p className="text-center text-gray-400">
                      No {status.toLowerCase()} orders found.
                    </p>
                  )}
                </div>
              </AnimatePresence>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OrderContent;
