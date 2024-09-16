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
  Globe,
  MapPin,
} from "lucide-react";
import { ThumbsUp, Calendar, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getPublic, post } from "@/utils/authUtils";
import { ProductActionSidebarContext } from "@/context/ProductActionSidebarContext";
import { toast } from "react-toastify";
import ProductActionSidebar from "@/components/ProductActionSidebar";
import { useInView } from "react-intersection-observer";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";

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

interface Feedback {
  _id: string;
  user_id: string;
  username: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

interface ProductRating {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { rating: number; count: number }[];
}

export default function ProductPage() {
  const { product_id } = useParams<{ product_id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [productRating, setProductRating] = useState<ProductRating | null>(
    null
  );
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [feedbackImages, setFeedbackImages] = useState<string[]>([]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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

  useEffect(() => {
    const fetchRatingAndFeedbacks = async () => {
      if (product) {
        try {
          const [ratingResponse, feedbacksResponse] = await Promise.all([
            getPublic<ProductRating>(`/feedback/product/${product._id}/rating`),
            getPublic<Feedback[]>(`/feedback/product/${product._id}`),
          ]);
          setProductRating(ratingResponse);
          setFeedbacks(feedbacksResponse);
        } catch (error) {
          console.error("Error fetching rating and feedbacks:", error);
        }
      }
    };

    fetchRatingAndFeedbacks();
  }, [product]);

  const handleSubmitFeedback = async () => {
    if (product) {
      try {
        await post("/feedback", {
          product_id: product._id,
          rating: userRating,
          comment: userComment,
          images: feedbackImages,
        });
        // Refetch rating and feedbacks after submission
        const [ratingResponse, feedbacksResponse] = await Promise.all([
          getPublic<ProductRating>(`/feedback/product/${product._id}/rating`),
          getPublic<Feedback[]>(`/feedback/product/${product._id}`),
        ]);
        setProductRating(ratingResponse);
        setFeedbacks(feedbacksResponse);
        setUserRating(0);
        setUserComment("");
        toast.success("Feedback submitted successfully");
      } catch (error) {
        console.error("Error submitting feedback:", error);
        toast.error("Failed to submit feedback. Please try again.");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <NotFound message="Product not found" />;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ProductImages
          images={product.images}
          name={product.name}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <ProductDetails product={product} productRating={productRating} />
      </div>
      <FeedbackSection
        productRating={productRating}
        feedbacks={feedbacks}
        userRating={userRating}
        setUserRating={setUserRating}
        userComment={userComment}
        setUserComment={setUserComment}
        handleSubmitFeedback={handleSubmitFeedback}
      />
      <ProductActionSidebar />
    </motion.div>
  );
}

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
  <div className="space-y-4">
    <AnimatePresence mode="wait">
      <motion.img
        key={selectedImage}
        src={images[selectedImage]}
        alt={`${name} - main`}
        className="w-full h-auto object-cover rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      />
    </AnimatePresence>
    <Carousel className="w-full max-w-md mx-auto">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem
            key={index}
            className="basis-1/4 sm:basis-1/5 md:basis-1/6"
          >
            <motion.img
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              src={image}
              alt={`${name} - ${index + 1}`}
              className={`w-full h-auto object-cover rounded-lg cursor-pointer transition-all duration-300 ${
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

const ProductDetails: React.FC<{
  product: Product;
  productRating: ProductRating | null;
}> = ({ product, productRating }) => {
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
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="rounded-2xl shadow-2xl space-y-4  "
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-between items-start"
      >
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {product.name}
        </h1>
        <Badge
          variant="outline"
          className="text-base px-3 py-1 bg-gray-800 border-purple-500 text-purple-400"
        >
          {product.categories[0]?.category_name}
        </Badge>
      </motion.div>

      <motion.div
        className="flex items-center space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-4 w-4 ${
                star <= (productRating?.averageRating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-600"
              }`}
            />
          ))}
        </div>
        <span className="text-lg text-gray-300">
          ({productRating?.averageRating.toFixed(1) || "N/A"}) ·{" "}
          <span className="text-purple-400">
            {productRating?.totalReviews} reviews
          </span>
        </span>
      </motion.div>

      <motion.div
        className="flex items-baseline space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-2xl font-bold text-green-400">
          ${discountPrice.toFixed(2)}
        </span>
        <span className="text-base font-semibold text-gray-500 line-through">
          ${product.variants[0]?.price.toFixed(2)}
        </span>
        <Badge
          variant="outline"
          className="text-lg px-3 py-1 bg-green-900 border-green-500 text-green-400"
        >
          Save {product.discount_value}%
        </Badge>
      </motion.div>

      <motion.p
        className="text-xl text-gray-300 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {product.description}
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <MapPin className="h-8 w-8 text-blue-400" />
          <div>
            <span className="block text-sm font-medium text-gray-400">
              Address
            </span>
            <span className="text-base text-gray-200">{product.address}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <Globe className="h-8 w-8 text-green-400" />
          <div>
            <span className="block text-sm font-medium text-gray-400">
              Origin
            </span>
            <span className="text-base text-gray-200">{product.origin}</span>
          </div>
        </div>
      </motion.div>

      {product.details.length > 0 && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-purple-400">
            Product Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.details.map((detail, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <span className="block font-medium text-gray-300 mb-1">
                  {detail.detail_name}
                </span>
                <span className="text-lg text-gray-100">
                  {detail.detail_info}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-semibold text-purple-400">
          Available Variants
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {product.variants.map((variant, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col justify-between"
            >
              <span className="text-base font-medium text-gray-200 mb-2">
                {variant.sku}
              </span>
              <div className="flex justify-between items-center">
                <span className="text-green-400 font-bold">
                  ${variant.price}
                </span>
                <Badge
                  variant="outline"
                  className={`px-2 py-1 ${
                    variant.stock > 0
                      ? "bg-green-900 border-green-500 text-green-400"
                      : "bg-red-900 border-red-500 text-red-400"
                  }`}
                >
                  {variant.stock > 0
                    ? `In Stock: ${variant.stock}`
                    : "Out of Stock"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => openProductActionSidebar(product._id, "add-to-cart")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-lg py-6"
        >
          <ShoppingCart className="mr-3 h-6 w-6" />
          Add to Cart
        </Button>
        <Button
          onClick={() => openProductActionSidebar(product._id, "buy-now")}
          className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-lg py-6"
        >
          <CreditCard className="mr-3 h-6 w-6" />
          Buy Now
        </Button>
        <Button
          onClick={handleAddToWishlist}
          className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg text-lg py-6"
        >
          <Heart className="mr-3 h-6 w-6" />
          Add to Wishlist
        </Button>
      </motion.div>
    </motion.div>
  );
};

const FeedbackSection: React.FC<{
  productRating: ProductRating | null;
  feedbacks: Feedback[];
  userRating: number;
  setUserRating: (rating: number) => void;
  userComment: string;
  setUserComment: (comment: string) => void;
  handleSubmitFeedback: () => void;
}> = ({
  productRating,
  feedbacks,
  userRating,
  setUserRating,
  userComment,
  setUserComment,
  handleSubmitFeedback,
}) => {
  const [feedbackImages, setFeedbackImages] = useState<string[]>([]);

  const renderRatingDistribution = () => {
    if (!productRating) return null;

    return (
      <div className="mt-4 space-y-2">
        {productRating.ratingDistribution.map((dist) => (
          <div key={dist.rating} className="flex items-center">
            <span className="w-16 text-sm">{dist.rating} stars</span>
            <Progress
              value={(dist.count / productRating.totalReviews) * 100}
              className="h-2 flex-grow mx-2"
            />
            <span className="w-10 text-sm text-right">{dist.count}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 bg-background_secondary rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <ThumbsUp className="mr-2" /> Customer Feedback
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">
              {productRating?.averageRating.toFixed(1) || "N/A"}
            </span>
            <span className="text-lg ml-2">out of 5</span>
          </div>
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= (productRating?.averageRating || 0)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {productRating?.totalReviews || 0} reviews
            </span>
          </div>
          {renderRatingDistribution()}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">
              Feedback Highlights
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900 bg-opacity-30 p-3 rounded-lg border border-green-700">
                <p className="text-green-400 font-medium">
                  Most Helpful Positive
                </p>
                <p className="text-sm mt-1 text-gray-300">
                  "{feedbacks[0]?.comment.slice(0, 50)}..."
                </p>
              </div>
              <div className="bg-red-900 bg-opacity-30 p-3 rounded-lg border border-red-700">
                <p className="text-red-400 font-medium">
                  Most Helpful Critical
                </p>
                <p className="text-sm mt-1 text-gray-300">
                  "{feedbacks[feedbacks.length - 1]?.comment.slice(0, 50)}..."
                </p>
              </div>
            </div>
            <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-700">
              <h4 className="text-blue-400 font-medium mb-2">Quick Stats</h4>
              <ul className="text-sm space-y-1 text-gray-300">
                <li>🏆 Top Rated Feature: Quality</li>
                <li>
                  📈{" "}
                  {Math.round(((productRating?.averageRating || 0) / 5) * 100)}%
                  of customers recommend this product
                </li>
                <li>
                  ⭐{" "}
                  {productRating?.ratingDistribution.find((r) => r.rating === 5)
                    ?.count || 0}{" "}
                  customers gave 5 stars
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= userRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                    onClick={() => setUserRating(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Comment
              </label>
              <Textarea
                id="comment"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows={4}
                placeholder="Write your review here..."
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (optional)
              </label>
              <ImageUpload
                max={3}
                isCrop={true}
                images={feedbackImages}
                setImages={setFeedbackImages}
              />
            </div>
            <Button onClick={handleSubmitFeedback} className="w-full">
              <Send className="mr-2 h-4 w-4" /> Submit Review
            </Button>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="space-y-6">
        {feedbacks.map((feedback) => (
          <div key={feedback._id} className="bg-background p-4 rounded-lg">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${feedback.username}`}
                />
                <AvatarFallback>{feedback.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{feedback.username}</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= feedback.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{feedback.comment}</p>
                {feedback.images && feedback.images.length > 0 && (
                  <div className="mt-3 flex space-x-2">
                    {feedback.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Feedback image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
