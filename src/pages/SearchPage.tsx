/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FilterProductBar from "@/components/FilterProductBar";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { postPublic } from "@/utils/authUtils";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  seller_id: string;
  discount_value?: number;
}

interface FilterOptions {
  value?: string;
  countryOfOrigin?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const SearchPage: React.FC = () => {
  const { value } = useParams<{ value: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(false);
  const [lastSuccessfulFilters, setLastSuccessfulFilters] =
    useState<FilterOptions>({});

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await postPublic<{
        products: Product[];
        total: number;
      }>("/product/elastic/filter", {
        value,
        ...filters,
        page: currentPage,
        limit: 12,
      });
      if (response.products.length === 0) {
        toast.info(
          "No products found with the current filters. Showing previous results."
        );
        setFilters(lastSuccessfulFilters);
        return;
      }
      setProducts(response.products);
      setTotalPages(Math.ceil(response.total / 12));
      setLastSuccessfulFilters(filters);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
      setFilters(lastSuccessfulFilters);
    } finally {
      setLoading(false);
    }
  }, [value, filters, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    const filtersChanged =
      JSON.stringify(newFilters) !== JSON.stringify(filters);

    if (filtersChanged) {
      setFilters(newFilters);
      setCurrentPage(1);
    } else {
      toast.warn(
        "No changes in filters. Please modify your selection to apply new filters."
      );
    }
  };

  const handleRefresh = () => {
    setFilters({});
    setCurrentPage(1);
    navigate(`/search/${value}`);
    toast.info("Filters have been reset.");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 pt-2">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="w-full md:w-1/4">
          <FilterProductBar onFilterChange={handleFilterChange} />
          <Button
            onClick={handleRefresh}
            className="w-full mt-4 flex items-center justify-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Filters
          </Button>
        </div>
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ProductGrid
              title={`Showing search results for "${value}"`}
              productList={products}
              grid="4x3"
            />
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? "default" : "outline"}
                    className="mx-1"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default SearchPage;
