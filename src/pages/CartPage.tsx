import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { get, del, put, post } from "@/utils/authUtils";

interface Variant {
  sku: string;
  stock: number;
  price: number;
}

interface CartItem {
  product_id: string;
  selected_sku: string;
  quantity: number;
  image: string;
  name: string;
  variants: Variant[];
}

interface CartData {
  _id: string;
  customer_id: string;
  items: CartItem[];
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      const response = await get<CartData>(`/cart`);
      setCartData(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setLoading(false);
    }
  };

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    try {
      await put(`/cart/quantity`, {
        product_id: productId,
        quantity: newQuantity,
      });
      fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleSkuChange = async (productId: string, newSku: string) => {
    try {
      await put(`/cart/sku`, { product_id: productId, sku: newSku });
      fetchCartData();
    } catch (error) {
      console.error("Error updating SKU:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await del(`/cart`);
      fetchCartData();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const toggleItemSelection = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getSelectedVariant = (item: CartItem) => {
    return item.variants.find((variant) => variant.sku === item.selected_sku);
  };

  const calculateTotal = (item: CartItem) => {
    const selectedVariant = getSelectedVariant(item);
    return (selectedVariant?.price || 0) * item.quantity;
  };

  const calculateEndTotal = () =>
    cartData?.items.reduce((total, item) => total + calculateTotal(item), 0) ||
    0;

  const calculateSelectedTotal = () =>
    cartData?.items
      .filter((item) => selectedItems.includes(item.product_id))
      .reduce((total, item) => total + calculateTotal(item), 0) || 0;

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    const session_id = await post<{ session_id: any }>(
      "/session",
      selectedItems
    );
    navigate(`/checkout/${session_id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 space-y-8"
    >
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </motion.div>
      ) : cartData?.items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl">Your cart is empty.</p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="destructive"
                onClick={handleClearCart}
                className="flex items-center space-x-2 hover:bg-red-600 transition-colors duration-300"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-between gap-4">
              <div className="w-full lg:w-[70%]">
                <div className="overflow-x-auto">
                  <Table className="bg-background_secondary rounded-lg shadow-md w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">Select</TableHead>
                        <TableHead className="w-[50px]">No.</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartData?.items.map((item, index) => {
                        const selectedVariant = getSelectedVariant(item);
                        return (
                          <TableRow
                            key={item.product_id}
                            className="hover:bg-background transition-colors duration-200"
                          >
                            <TableCell>
                              <Checkbox
                                className="bg-white"
                                checked={selectedItems.includes(item.product_id)}
                                onCheckedChange={() =>
                                  toggleItemSelection(item.product_id)
                                }
                              />
                            </TableCell>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="flex items-center space-x-2">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <p className="font-medium">{item.name}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.selected_sku}
                                onValueChange={(value) =>
                                  handleSkuChange(item.product_id, value)
                                }
                              >
                                <SelectTrigger className="w-[120px] sm:w-[180px]">
                                  <SelectValue placeholder="Select variant" />
                                </SelectTrigger>
                                <SelectContent>
                                  {item.variants.map((variant) => (
                                    <SelectItem
                                      key={variant.sku}
                                      value={variant.sku}
                                    >
                                      {variant.sku}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              ${selectedVariant?.price.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product_id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  max={selectedVariant?.stock}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.product_id,
                                      parseInt(e.target.value)
                                    )
                                  }
                                  className="w-16 text-center"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.product_id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item.quantity >= (selectedVariant?.stock || 0)
                                  }
                                >
                                  <Plus size={16} />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              ${calculateTotal(item).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 text-right">
                  <p className="font-bold">
                    End Total: ${calculateEndTotal().toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-[30%] flex flex-col">
                <Card className="bg-background_secondary rounded-lg shadow-md sticky top-4">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Selected Items: {selectedItems.length}</p>
                    <p>Total Amount: ${calculateSelectedTotal().toFixed(2)}</p>

                    <Button
                      className="mt-4 w-full hover:bg-primary-dark transition-colors duration-300"
                      onClick={handleCheckout}
                    >
                      Checkout
                    </Button>
                  </CardContent>
                </Card>
                <p className="text-xs text-gray-600 mt-2">
                  (This total amount does not include discounts or delivery fees)
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default CartPage;
