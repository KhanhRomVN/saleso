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

interface ProductAttribute {
  attributes_value: string;
  attributes_quantity: number;
  attributes_price: number;
}

interface CategoryInfo {
  category_id: string;
  category_name: string;
}

interface DetailInfo {
  details_name: string;
  details_info: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  countryOfOrigin: string;
  brand: string;
  details: DetailInfo[];
  categories: CategoryInfo[];
  tags: string[];
  images: string[];
  price?: number;
  stock?: number;
  attributes_name?: string;
  attributes?: ProductAttribute[];
  rating: number;
  units_sold: number;
  seller_id: string;
}

// for action: add-to-cart
interface CartData {
  product_id: string;
  selected_attributes_value?: string;
  quantity: number;
}

// for action: buy-now
interface checkoutSessionData {
  product_id: string;
  selected_attributes_value?: string;
  quantity: number;
}

const ProductActionSidebar: React.FC = () => {
  const { isOpen, productId, action, closeProductActionSidebar } = useContext(
    ProductActionSidebarContext
  );

  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getPublic<Product>(`/product/${productId}`);
        setProduct(data);
        setQuantity(1);
        if (data.attributes && data.attributes.length > 0) {
          setSelectedAttribute(data.attributes[0].attributes_value);
        }
      } catch (err) {
        setError("Failed to fetch product data: " + err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const getStock = () => {
    if (!product) return null;
    if (product.stock !== undefined) return product.stock;
    if (product.attributes && selectedAttribute) {
      const attribute = product.attributes.find(
        (a) => a.attributes_value === selectedAttribute
      );
      return attribute ? attribute.attributes_quantity : null;
    }
    return null;
  };

  const handleQuantityChange = (value: number) => {
    const stock = getStock();
    if (stock !== null) {
      setQuantity(Math.min(Math.max(1, value), stock));
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

  // for action: add-to-cart
  const handleAddToCart = async () => {
    if (!product) return;

    const cartData: CartData = {
      product_id: product._id,
      quantity: quantity,
    };

    if (product.attributes && selectedAttribute) {
      cartData.selected_attributes_value = selectedAttribute;
    }

    try {
      const response = await post<{ message: string }>("/cart", cartData);
      console.log("Product added to cart:", response.message);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  // for action: buy-now
  const handleCreateSessionCheckout = async () => {
    if (!product) return;

    const checkoutSessionData: checkoutSessionData = {
      product_id: product._id,
      quantity: quantity,
    };

    if (product.attributes && selectedAttribute) {
      checkoutSessionData.selected_attributes_value = selectedAttribute;
    }

    try {
      await post<{ message: string }>("/sesion/checkout", checkoutSessionData);
      navigate("/checkout");
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed top-0 right-0 w-2/5 h-screen bg-background shadow-lg z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-4">
              <Button
                variant="ghost"
                className="float-right"
                onClick={closeProductActionSidebar}
              >
                <X size={24} />
              </Button>

              {action === "add-to-cart" ? (
                <h2 className="text-xl font-bold mb-4">Add to cart</h2>
              ) : (
                <h2 className="text-xl font-bold mb-4">Buy now</h2>
              )}

              {loading && <p>Loading...</p>}
              {error && <p className="text-red-500">{error}</p>}
              {product && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative mb-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <img
                          src={product.images[currentImageIndex]}
                          alt={product.name}
                          className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
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
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <p className="text-sm mb-2">
                    Origin: {product.countryOfOrigin}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2 items-center">
                    <p>Categories:</p>
                    {product.categories.map((category) => (
                      <Button
                        key={category.category_id}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {category.category_name}
                      </Button>
                    ))}
                  </div>
                  {product.details && product.details.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-sm font-medium">Product Details:</h4>
                      {product.details.map((detail, index) => (
                        <p key={index} className="text-sm">
                          <span className="font-medium">
                            {detail.details_name}:
                          </span>{" "}
                          {detail.details_info}
                        </p>
                      ))}
                    </div>
                  )}
                  {product.attributes ? (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">
                        {product.attributes_name}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {product.attributes.map((attr) => (
                          <Button
                            key={attr.attributes_value}
                            variant={
                              selectedAttribute === attr.attributes_value
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              setSelectedAttribute(attr.attributes_value)
                            }
                            className="w-full text-xs"
                          >
                            {attr.attributes_value}
                            <br />${attr.attributes_price} -
                            {attr.attributes_quantity} in stock
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-bold mb-2">
                        Price: ${product.price}
                      </p>
                      <p className="text-sm mb-2">Stock: {product.stock}</p>
                    </>
                  )}

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(parseInt(e.target.value))
                        }
                        className="w-16 mx-2 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {action === "add-to-cart" ? (
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      onClick={handleCreateSessionCheckout}
                    >
                      Buy now
                    </Button>
                  )}
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
