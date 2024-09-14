import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as authUtils from "@/utils/authUtils";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Truck,
  CreditCard,
  Tag,
  Percent,
  DollarSign,
  Clock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Variant {
  sku: string;
  stock: number;
  price: number;
}

interface Discount {
  _id: string;
  code: string;
  type: string;
  value: number;
  minimum_purchase: number;
  max_uses: number;
  current_uses: number;
}

interface CheckoutItem {
  product_id: string;
  name: string;
  images: string[];
  quantity: number;
  selected_sku: string;
  price: number;
  variants: Variant[];
  discounts: Discount[];
  appliedDiscount: Discount | null;
}

interface SessionResponse {
  data: { product_id: string; selected_sku: string; quantity: number };
}

interface CartResponse {
  selected_sku: string;
  quantity: number;
}

interface ProductResponse {
  name: string;
  images: string[];
  variants: Variant[];
}

const CheckoutPage: React.FC = () => {
  const { session_id } = useParams<{ session_id: string }>();
  const [checkoutData, setCheckoutData] = useState<CheckoutItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("prepaid");
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!session_id) return;

      try {
        setIsLoading(true);
        const response = await authUtils.get<SessionResponse>(
          `/session/get/${session_id}`
        );

        let processedData: CheckoutItem[] = [];

        if (Array.isArray(response.data)) {
          processedData = await Promise.all(
            response.data.map(async (product_id) => {
              const [cartResponse, productResponse] = await Promise.all([
                authUtils.get<CartResponse>(`/cart/by-product/${product_id}`),
                authUtils.get<ProductResponse>(
                  `/product/by-product/${product_id}`
                ),
              ]);

              return {
                product_id,
                ...cartResponse,
                ...productResponse,
                price:
                  productResponse.variants.find(
                    (v) => v.sku === cartResponse.selected_sku
                  )?.price || 0,
                discounts: [],
                appliedDiscount: null,
              };
            })
          );
        } else {
          const productResponse = await authUtils.get<ProductResponse>(
            `/product/by-product/${response.data.product_id}`
          );
          processedData.push({
            ...response.data,
            ...productResponse,
            price:
              productResponse.variants.find(
                (v) => v.sku === response.data.selected_sku
              )?.price || 0,
            discounts: [],
            appliedDiscount: null,
          });
        }

        setCheckoutData(processedData);
        calculateTotal(processedData);
      } catch (error) {
        console.error("Error fetching checkout data:", error);
        toast.error("Failed to load checkout data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCheckoutData();
  }, [session_id]);

  const calculateTotal = (data: CheckoutItem[]) => {
    const subtotal = data.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shippingFee = 10; // Default shipping fee
    setTotalAmount(subtotal + shippingFee);
  };

  const handleUseDiscount = async (index: number) => {
    try {
      const product = checkoutData[index];
      const response = await authUtils.get<Discount[]>(
        `/product/by-product-with-discount/${product.product_id}`
      );
      const updatedCheckoutData = [...checkoutData];
      updatedCheckoutData[index].discounts = response;
      setCheckoutData(updatedCheckoutData);
    } catch (error) {
      console.error("Error fetching discounts:", error);
      toast.error("Failed to fetch discounts. Please try again.");
    }
  };

  const applyDiscount = (index: number, discount: Discount) => {
    const updatedCheckoutData = [...checkoutData];
    const item = updatedCheckoutData[index];

    if (
      item.price >= discount.minimum_purchase &&
      discount.current_uses < discount.max_uses
    ) {
      let discountedPrice = item.price;

      if (discount.type === "free-shipping") {
        setTotalAmount((prevTotal) => prevTotal - (10 * discount.value) / 100);
      } else {
        discountedPrice = item.price * (1 - discount.value / 100);
      }

      item.price = discountedPrice;
      item.appliedDiscount = discount;
      setCheckoutData(updatedCheckoutData);
      calculateTotal(updatedCheckoutData);
      toast.success(`Discount ${discount.code} applied successfully!`);
    } else {
      toast.error("This discount cannot be applied to this item.");
    }
  };

  const handleCheckout = async () => {
    try {
      const orderItems = checkoutData.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        sku: item.selected_sku,
        total_amount: item.price * item.quantity,
        shipping_fee: 10,
        shipping_address: shippingAddress,
      }));

      const orderData = {
        orderItems,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "prepaid" ? "unpaid" : "paid",
      };

      await authUtils.post("/order", orderData);

      toast.success("Order placed successfully!");
      // Redirect to order confirmation page or clear cart
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ShoppingCart className="w-12 h-12 text-blue-500" />
        </motion.div>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 min-h-screen"
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Card className="mb-8 bg-background_secondary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2" />
                Your Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {checkoutData.map((item, index) => (
                  <motion.div
                    key={item.product_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 p-4 bg-background rounded-lg shadow"
                  >
                    <div className="flex items-start">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          Price: ${item.price.toFixed(2)}
                        </p>
                        <DiscountDialog
                          item={item}
                          index={index}
                          handleUseDiscount={handleUseDiscount}
                          applyDiscount={applyDiscount}
                        />
                        {item.appliedDiscount && (
                          <div className="flex items-center mt-2 text-green-600">
                            <Tag className="w-4 h-4 mr-2" />
                            <span>Applied: {item.appliedDiscount.code}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-1/3">
          <Card className="bg-background_secondary">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Information
                </h2>
                <Input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter shipping address"
                  className="w-full"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h2>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: string) => setPaymentMethod(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="postpaid">Postpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-background p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Order Total</h2>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping Fee:</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-300">
                  <span>Total:</span>
                  <span>${(totalAmount + 10).toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

interface DiscountDialogProps {
  item: CheckoutItem;
  index: number;
  handleUseDiscount: (index: number) => Promise<void>;
  applyDiscount: (index: number, discount: Discount) => void;
}

const DiscountDialog: React.FC<DiscountDialogProps> = ({
  item,
  index,
  handleUseDiscount,
  applyDiscount,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => handleUseDiscount(index)}
        >
          <Tag className="w-4 h-4 mr-2" />
          Use Discount
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Available Discounts
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {item.discounts.map((discount) => (
            <div key={discount._id} className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">{discount.code}</span>
                <Button
                  onClick={() => applyDiscount(index, discount)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Apply
                </Button>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Percent className="w-4 h-4 mr-2" />
                <span>{discount.value}% off</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>
                  Min. Purchase: ${discount.minimum_purchase.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-2" />
                <span>Type: {discount.type}</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Usage</span>
                  <span>
                    {discount.current_uses} / {discount.max_uses}
                  </span>
                </div>
                <Progress
                  value={(discount.current_uses / discount.max_uses) * 100}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutPage;
// just a comment
