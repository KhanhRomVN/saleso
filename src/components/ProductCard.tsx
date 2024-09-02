import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { post } from "@/utils/authUtils";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  discount_value?: number;
}

interface ProductCardProps {
  productData: Product;
  openCart: (productId: string) => void;
  gridType: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productData,
  openCart,
  gridType,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const totalStars = 5;
  const fullStars = Math.floor(productData.rating);
  const hasHalfStar = productData.rating % 1 !== 0;

  const discountedPrice = productData.discount_value
    ? productData.price * (1 - productData.discount_value / 100)
    : null;

  const handleCardClick = useCallback(() => {
    navigate(`/product/${productData.id}`);
  }, [navigate, productData.id]);

  const handleAddToWishlist = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await post(`/wishlist/items/${productData.id}`);
        toast.success("Added to wishlist successfully");
      } catch (error) {
        console.error("Error adding to wishlist:", error);
        if (
          error instanceof Error &&
          error.message === "No access token found"
        ) {
          toast.error("Please log in to add items to your wishlist");
        } else {
          toast.error("Failed to add to wishlist. Please try again.");
        }
      }
    },
    [productData.id]
  );

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openCart(productData.id);
    },
    [openCart, productData.id]
  );

  const getGridSpecificStyles = useCallback(() => {
    switch (gridType) {
      case "8x2":
        return "h-36 w-full";
      case "1x4":
      case "2x4":
        return "h-44 w-full";
      default:
        return "h-52 w-full";
    }
  }, [gridType]);

  const truncateName = (name: string, maxLength: number) => {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className="relative cursor-pointer overflow-hidden bg-background_secondary h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <CardContent className="p-2 flex flex-col h-full">
          <div className="relative flex-grow mb-2">
            <img
              src={productData.image}
              alt={productData.name}
              className={`object-cover rounded-lg transition-all duration-300 transform hover:scale-105 ${getGridSpecificStyles()}`}
            />
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute top-0 right-2 space-y-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={handleAddToWishlist}
                    className="bg-background shadow-md transition-all duration-200 "
                  >
                    <Heart className="h-4 w-4 " />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background shadow-md transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <img
                        src={productData.image}
                        alt={productData.name}
                        className="w-full h-auto rounded-lg"
                      />
                    </DialogContent>
                  </Dialog>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-grow flex flex-col justify-between">
            <h3
              className="font-semibold text-sm sm:text-base mb-1"
              title={productData.name}
            >
              {truncateName(productData.name, 20)}
            </h3>
            <div className="flex items-center">
              {[...Array(totalStars)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-3 h-3 ${
                    index < fullStars
                      ? "text-yellow-400 fill-yellow-400"
                      : index === fullStars && hasHalfStar
                      ? "text-yellow-400 fill-yellow-400 half-star"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {productData.rating.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                {discountedPrice ? (
                  <>
                    <span className="text-gray-500 line-through text-xs sm:text-sm">
                      ${productData.price.toFixed(2)}
                    </span>
                    <span className="font-bold text-primary text-sm sm:text-base">
                      ${discountedPrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-primary text-sm sm:text-base">
                    ${productData.price.toFixed(2)}
                  </span>
                )}
              </div>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="sm"
                      onClick={handleAddToCart}
                      className="text-xs sm:text-sm hover:bg-primary  transition-all duration-200 shadow-lg"
                    >
                      <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Add
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
