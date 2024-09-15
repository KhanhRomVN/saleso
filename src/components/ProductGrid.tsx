import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "./ProductCard";
import { postPublic } from "@/utils/authUtils";
import ProductActionSidebar from "./ProductActionSidebar";

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
}

interface ProductGridProps {
  title: React.ReactNode;
  api?: string;
  productList?: Product[];
  grid: "1x4" | "2x4" | "3x4" | "3x5" | "8x2" | "4x3" | "5x3";
}

const gridConfigs = {
  "1x4": { cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", perPage: 4 },
  "2x4": { cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", perPage: 8 },
  "3x4": { cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", perPage: 12 },
  "3x5": { cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5", perPage: 15 },
  "8x2": { cols: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-8", perPage: 16 },
  "4x3": { cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", perPage: 12 },
  "5x3": { cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5", perPage: 15 },
};

const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  api,
  productList,
  grid,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const { cols, perPage } = gridConfigs[grid];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (api) {
          const response = await postPublic<Product[]>(api);
          setProducts(response);
        } else if (productList) {
          setProducts(productList);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [api, productList]);

  const currentProducts = products.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const totalPages = Math.ceil(products.length / perPage);

  return (
    <Card className="w-full bg-background">
      <CardContent className="p-4">
        <h2 className="text-xl mb-4 text-primary">{title}</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              className={`grid ${cols} gap-3 sm:gap-4`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {currentProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard productData={product} gridType={grid} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from(
              { length: Math.min(5, totalPages) },
              (_, i) => i + 1
            ).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className="transition-colors duration-200"
              >
                {page}
              </Button>
            ))}
            {totalPages > 5 && (
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage(Math.min(currentPage + 1, totalPages))
                }
                className="transition-colors duration-200 "
              >
                ...
              </Button>
            )}
          </div>
        )}
      </CardContent>
      <ProductActionSidebar />
      <ToastContainer />
    </Card>
  );
};

export default ProductGrid;
