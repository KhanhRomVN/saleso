import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import {
  Package,
  CheckCircle,
  XCircle,
  DollarSign,
  ShoppingCart,
  CreditCard,
  MessageCircle,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Plus,
  MapPin,
  Calendar,
  RotateCcw,
  X,
} from "lucide-react";
import { get, post } from "@/utils/authUtils";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import NotImplementedNotice from "@/components/NotImplementedNotice";
import { Textarea } from "@/components/ui/textarea";

type TabId = "account" | "address" | "orders" | "payment" | "message" | "other";

const SettingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  const tabs = [
    { id: "account" as const, label: "Account", icon: "👤" },
    { id: "address" as const, label: "Address", icon: "🏠" },
    { id: "orders" as const, label: "Orders", icon: "📦" },
    { id: "payment" as const, label: "Payment", icon: "💳" },
    { id: "message" as const, label: "Message", icon: "✉️" },
    { id: "other" as const, label: "Other", icon: "⚙️" },
  ];

  const contentComponents: Record<TabId, React.FC> = {
    account: AccountContent,
    address: AddressContent,
    orders: OrderContent,
    payment: PaymentContent,
    message: MessageContent,
    other: OtherContent,
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabId);
  };

  return (
    <div className="flex w-full flex-col gap-4 pt-8">
      <p className="text-3xl ml-4 font-bold">Setting</p>
      <Tabs
        orientation="horizontal"
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col md:flex-row flex-grow pb-40"
      >
        <div className="w-[15%] pt-[100px]">
          <TabsList className="flex flex-col bg-transparent items-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex justify-start"
              >
                <span className="mr-2 text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="w-[85%] bg-background_secondary rounded-lg shadow-lg">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(contentComponents[tab.id])}
              </motion.div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

const AccountContent: React.FC = () => {
  return <NotImplementedNotice title="Account" />;
};

interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const AddressContent: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "Home",
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
      isDefault: true,
    },
    {
      id: "2",
      type: "Work",
      street: "456 Office Blvd",
      city: "Workville",
      state: "NY",
      zipCode: "67890",
      country: "USA",
      isDefault: false,
    },
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAddress, setNewAddress] = useState<
    Omit<Address, "id" | "isDefault">
  >({
    type: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleAddressChange = (field: string, value: string) => {
    setNewAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewAddress = () => {
    const newAddr: Address = {
      ...newAddress,
      id: (addresses.length + 1).toString(),
      isDefault: false,
    };
    setAddresses([...addresses, newAddr]);
    setIsAddingNew(false);
    setNewAddress({
      type: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    });
  };

  return (
    <div className="space-y-8 p-6 bg-background_secondary text-gray-100">
      <h2 className="text-2xl font-bold text-blue-300">Addresses</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-blue-300">
                <span>{address.type}</span>
                {address.isDefault && (
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    Default
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <p>{address.street}</p>
              <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
              <p>{address.country}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="bg-gray-700 text-blue-300 border-blue-500 hover:bg-gray-600"
              >
                Edit
              </Button>
              {!address.isDefault && (
                <Button
                  variant="secondary"
                  onClick={() => handleSetDefault(address.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Set as Default
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {isAddingNew ? (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-blue-300">Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.keys(newAddress).map((field) => (
                <div key={field}>
                  <Label htmlFor={field} className="text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    value={newAddress[field as keyof typeof newAddress]}
                    onChange={(e) => handleAddressChange(field, e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAddingNew(false)}
              className="bg-gray-700 text-blue-300 border-blue-500 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNewAddress}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Address
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Address
        </Button>
      )}
    </div>
  );
};

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

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await get<Order[]>(
          `/order/${activeTab.toLowerCase()}`,
          "order"
        );
        console.log(response);

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

const MessageContent: React.FC = () => {
  return (
    <Card className="bg-background_secondary text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6" />
          <span>Message Preferences</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive order updates via email
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>SMS Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive order updates via SMS
            </p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications on your device
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};

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

export default SettingPage;
