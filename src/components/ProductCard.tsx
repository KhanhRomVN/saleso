import React, { useState, useCallback, useContext, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { post } from "@/utils/authUtils";
import { ProductActionSidebarContext } from "@/context/ProductActionSidebarContext";

interface Product {
  id: string;
  _id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  discount_value?: number;
}

interface ProductCardProps {
  productData: Product;
  gridType: string;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({ productData, gridType }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const { openProductActionSidebar } = useContext(
      ProductActionSidebarContext
    );

    const { fullStars, hasHalfStar, discountedPrice } = useMemo(() => {
      const fullStars = Math.floor(productData.rating);
      const hasHalfStar = productData.rating % 1 !== 0;
      const discountedPrice = productData.discount_value
        ? productData.price * (1 - productData.discount_value / 100)
        : null;
      return { fullStars, hasHalfStar, discountedPrice };
    }, [productData.rating, productData.price, productData.discount_value]);

    const handleCardClick = useCallback(() => {
      navigate(`/product/${productData._id}`);
    }, [navigate, productData._id]);

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

    const handleAddToCart = useCallback(() => {
      openProductActionSidebar(productData._id, "add-to-cart");
    }, [openProductActionSidebar, productData._id]);

    const getGridSpecificStyles = useMemo(() => {
      switch (gridType) {
        case "8x2":
          return "h-28 sm:h-32 lg:h-36 w-full";
        case "1x4":
        case "2x4":
          return "h-36 sm:h-40 lg:h-44 w-full";
        default:
          return "h-40 sm:h-48 lg:h-52 w-full";
      }
    }, [gridType]);

    const truncateName = useCallback((name: string, maxLength: number) => {
      return name.length > maxLength
        ? `${name.substring(0, maxLength)}...`
        : name;
    }, []);

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
          >
            <CardContent className="p-2 flex flex-col h-full">
              <div className="relative mb-2">
                <img
                  src={productData.image}
                  alt={productData.name}
                  className={`object-cover rounded-md ${getGridSpecificStyles}`}
                  onClick={handleCardClick}
                />
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-2 right-2 flex flex-col gap-2"
                    >
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full"
                        onClick={handleAddToWishlist}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <img
                            src={productData.image}
                            alt={productData.name}
                            className="w-full h-auto"
                          />
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <h3
                  className="font-semibold text-xs sm:text-sm lg:text-base mb-1 truncate"
                  title={productData.name}
                  onClick={handleCardClick}
                >
                  {truncateName(productData.name, 20)}
                </h3>
                <div className="flex items-center mb-1">
                  {[...Array(fullStars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  {hasHalfStar && (
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    {discountedPrice !== null ? (
                      <>
                        <span className="text-xs sm:text-sm lg:text-base font-bold text-primary">
                          ${discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-xs sm:text-sm lg:text-base ml-2 line-through text-gray-500">
                          ${productData.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs sm:text-sm lg:text-base font-bold text-primary">
                        ${productData.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-full p-1 sm:p-2"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }
  );
  
export default ProductCard;