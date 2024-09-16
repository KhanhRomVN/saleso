import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { postPublic } from "@/utils/authUtils";
import ProductGrid from "@/components/ProductGrid";
import FilterProductBar from "@/components/FilterProductBar";
import ProductGridFilterBar from "@/components/ProductGridFilterBar";

interface Product {
  id: string;
  _id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  discount_value?: number;
  seller_id?: string | null;
  categories?: { category_id: string; category_name: string }[] | [];
  address?: string;
}

export default function SearchPage() {
  const { value } = useParams<{ value: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastValidProducts, setLastValidProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [value]);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const fetchProducts = async (filters: Record<string, any> = {}) => {
    setLoading(true);
    try {
      const response = await postPublic<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
      }>("/product/elastic/filter", { value, ...filters });

      if (response.products.length === 0) {
        toast.warning(
          "No products found with the applied filters. Showing previous results."
        );
        setProducts(lastValidProducts);
      } else {
        setProducts(response.products);
        setLastValidProducts(response.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleServerFilterChange = (filters: Record<string, any>) => {
    fetchProducts(filters);
  };

  const handleClientFilterChange = (newFilteredProducts: Product[]) => {
    setFilteredProducts(newFilteredProducts);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4">
          <FilterProductBar
            products={products}
            onFilterChange={handleServerFilterChange}
          />
        </div>
        <div className="flex-grow">
          <ProductGridFilterBar
            products={products}
            onFilterChange={handleClientFilterChange}
          />
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <ProductGrid title={``} productList={filteredProducts} grid="3x4" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
