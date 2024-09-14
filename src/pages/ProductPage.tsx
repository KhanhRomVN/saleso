import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Heart,
  CreditCard,
  ShoppingCart,
  Tag,
  Globe,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getPublic, post } from "@/utils/authUtils";
import { ProductActionSidebarContext } from "@/context/ProductActionSidebarContext";
import { toast } from "react-toastify";
import ProductActionSidebar from "@/components/ProductActionSidebar";

interface Category {
  category_id: string;
  category_name: string;
}

interface Detail {
  detail_name: string;
  detail_info: string;
}

interface Variant {
  sku: string;
  stock: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  images: string[];
  description: string;
  address: string;
  origin: string;
  categories: Category[];
  details: Detail[];
  variants: Variant[];
  seller_id: string;
  discount_value: number;
  rating: number;
}

const ProductPage: React.FC = () => {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const productResponse = await getPublic<Product>(
        `/product/by-product/${product_id}`
      );
      setProduct(productResponse);
    } catch (err) {
      setError(`Failed to fetch data: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [product_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <NotFound message="Product not found" />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <ProductImages
          images={product.images}
          name={product.name}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <ProductDetails product={product} />
      </div>
      <ProductActionSidebar />
    </motion.div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="text-center py-10 text-red-500"
  >
    {message}
  </motion.div>
);

const NotFound: React.FC<{ message: string }> = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    className="text-center py-10"
  >
    {message}
  </motion.div>
);

const ProductImages: React.FC<{
  images: string[];
  name: string;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}> = ({ images, name, selectedImage, setSelectedImage }) => (
  <div>
    <AnimatePresence mode="wait">
      <motion.img
        key={selectedImage}
        src={images[selectedImage]}
        alt={`${name} - main`}
        className="w-full h-auto object-cover rounded-lg mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </AnimatePresence>
    <Carousel className="w-full max-w-xs mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} className="basis-1/4">
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src={image}
              alt={`${name} - ${index + 1}`}
              className={`w-full h-auto object-cover rounded-lg cursor-pointer ${
                selectedImage === index ? "ring-2 ring-primary_color" : ""
              }`}
              onClick={() => setSelectedImage(index)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  </div>
);

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => {
  const { openProductActionSidebar } = useContext(ProductActionSidebarContext);

  const handleAddToWishlist = useCallback(async () => {
    try {
      await post(`/wishlist/items/${product._id}`);
      toast.success("Added to wishlist successfully");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      if (error instanceof Error && error.message === "No access token found") {
        toast.error("Please log in to add items to your wishlist");
      } else {
        toast.error("Failed to add to wishlist. Please try again.");
      }
    }
  }, [product._id]);

  const discountPrice = useMemo(() => {
    const basePrice = product.variants[0]?.price || 0;
    return basePrice * (1 - product.discount_value / 100);
  }, [product.variants, product.discount_value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg shadow-lg space-y-6 p-6 bg-gray-800"
    >
      <motion.h1
        className="text-3xl font-bold text-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {product.name}
      </motion.h1>

      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= product.rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-500"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-400">
          ({product.rating.toFixed(1)})
        </span>
      </motion.div>

      <motion.div
        className="flex items-baseline space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-3xl font-bold text-primary_color">
          ${discountPrice.toFixed(2)}
        </span>
        <span className="text-2xl font-semibold text-gray-500 line-through">
          ${product.variants[0]?.price.toFixed(2)}
        </span>
      </motion.div>

      <motion.p
        className="text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {product.description}
      </motion.p>

      <motion.div
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-300">
            Address: {product.address}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-300">
            Origin: {product.origin}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-gray-200">Details</h3>
        <div className="grid grid-cols-2 gap-2">
          {product.details.map((detail, index) => (
            <div key={index} className="flex flex-col">
              <span className="font-medium text-gray-300">
                {detail.detail_name}:
              </span>
              <span className="text-gray-400">{detail.detail_info}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-200">Variants</h3>
        <div className="grid grid-cols-2 gap-2">
          {product.variants.map((variant, index) => (
            <Badge key={index} variant="outline" className="px-3 py-1">
              {variant.sku} - ${variant.price} (Stock: {variant.stock})
            </Badge>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-lg font-semibold text-gray-200">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {product.categories.map((category) => (
            <Badge key={category.category_id} className="px-3 py-1">
              {category.category_name}
            </Badge>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => openProductActionSidebar(product._id, "add-to-cart")}
          className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          onClick={() => openProductActionSidebar(product._id, "buy-now")}
          className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Buy Now
        </Button>
        <Button
          onClick={handleAddToWishlist}
          className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-300"
        >
          <Heart className="mr-2 h-4 w-4" />
          Wishlist
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ProductPage;
