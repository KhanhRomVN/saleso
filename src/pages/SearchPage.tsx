import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import FilterProductBar from "@/components/FilterProductBar";
import ProductGrid from "@/components/ProductGrid";
import { postPublic } from "@/utils/authUtils";
import { Product } from "@/types/product";

export default function SearchPage() {
  const { value } = useParams<{ value: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [value]);

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await postPublic<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
      }>("/product/elastic/filter", { value, ...filters });
      setProducts(response.products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    fetchProducts(filters);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Search results for "{value}"</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterProductBar
          products={products}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <ProductGrid
              title={`Search results for "${value}"`}
              productList={products}
              grid="3x4"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
