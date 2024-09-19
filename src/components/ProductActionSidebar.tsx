import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getPublic, post } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProductActionSidebarContext } from "@/context/ProductActionSidebarContext";
import { toast } from "react-toastify";

interface ProductVariant {
  sku: string;
  stock: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  images: string[];
  address: string;
  origin: string;
  variants: ProductVariant[];
  seller_id: string;
}

interface CartData {
  product_id: string;
  selected_sku: string;
  quantity: number;
}

type CheckoutSessionData = CartData;

const ProductActionSidebar: React.FC = () => {
  const { isOpen, productId, action, closeProductActionSidebar } = useContext(
    ProductActionSidebarContext
  );

  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getPublic<Product>(
          `/product/by-product/${productId}`,
          "product"
        );

        setProduct(data);
        setQuantity(1);
        if (data.variants && data.variants.length > 0) {
          setSelectedSku(data.variants[0].sku);
        }
      } catch (err) {
        setError("Failed to fetch product data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getSelectedVariant = () => {
    if (!product || !selectedSku) return null;
    return product.variants.find((variant) => variant.sku === selectedSku);
  };

  const handleQuantityChange = (value: number) => {
    const selectedVariant = getSelectedVariant();
    if (selectedVariant) {
      setQuantity(Math.min(Math.max(1, value), selectedVariant.stock));
    }
  };

  const nextImage = () => {
    if (product) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % product.images.length
      );
    }
  };

  const prevImage = () => {
    if (product) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + product.images.length) % product.images.length
      );
    }
  };

  const handleAddToCart = async () => {
    if (!product || !selectedSku) return;

    const cartData: CartData = {
      product_id: product._id,
      selected_sku: selectedSku,
      quantity: quantity,
    };

    try {
      await post<{ message: string }>("/cart", "order", cartData);
      toast.success("Product added to cart successfully");
      setTimeout(closeProductActionSidebar, 1000);
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Failed to add product to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedSku) return;

    const checkoutSessionData: CheckoutSessionData = {
      product_id: product._id,
      selected_sku: selectedSku,
      quantity: quantity,
    };

    try {
      const session_id = await post<{ message: string }>(
        "/session",
        "other",
        checkoutSessionData
      );
      toast.success("Checkout session created successfully");
      setTimeout(() => {
        closeProductActionSidebar();
        navigate(`/checkout/${session_id}`);
      }, 1000);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to create checkout session");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 h-screen bg-gray-900 shadow-lg z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-4">
              <Button
                variant="ghost"
                className="absolute top-2 right-2 text-gray-300 hover:text-white"
                onClick={closeProductActionSidebar}
              >
                <X size={24} />
              </Button>

              <h2 className="text-xl font-bold mb-4 pr-8 text-white">
                {action === "add-to-cart" ? "Add to cart" : "Buy now"}
              </h2>

              {loading && <p className="text-gray-300">Loading...</p>}
              {error && <p className="text-red-400">{error}</p>}
              {product && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={product.images[currentImageIndex]}
                          alt={product.name}
                          className="w-full h-48 sm:h-64 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                        />
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <div className="relative">
                          <img
                            src={product.images[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-auto"
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={prevImage}
                    >
                      <ChevronLeft size={24} />
                    </Button>
                    <Button
                      variant="outline"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity"
                      onClick={nextImage}
                    >
                      <ChevronRight size={24} />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      Address: {product.address}
                    </p>
                    <p className="text-sm text-gray-300">
                      Origin: {product.origin}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-gray-300">
                      Variants
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.variants.map((variant) => (
                        <Button
                          key={variant.sku}
                          variant={
                            selectedSku === variant.sku ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedSku(variant.sku)}
                          className={`w-full text-xs ${
                            selectedSku === variant.sku
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {variant.sku}
                          <br />${variant.price} - {variant.stock} in stock
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="bg-gray-800 text-gray-300 hover:bg-gray-700"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(parseInt(e.target.value))
                        }
                        className="w-16 mx-2 text-center bg-gray-800 text-white border-gray-700"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="bg-gray-800 text-gray-300 hover:bg-gray-700"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    onClick={
                      action === "add-to-cart" ? handleAddToCart : handleBuyNow
                    }
                  >
                    {action === "add-to-cart" ? "Add to Cart" : "Buy Now"}
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductActionSidebar;
