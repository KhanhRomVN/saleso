import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import CategoriesFilterBar from "@/components/CategoriesFilterBar";
import ProductGrid from "@/components/ProductGrid";
import { getPublic, post } from "@/utils/authUtils";

interface Category {
  category_id: string;
  category_name: string;
}

interface ChildCategory {
  _id: string;
  name: string;
  slug: string;
}

interface ProductsResponse {
  total: number;
  page: number;
  limit: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
}

interface Filters {
  listCategory: string[];
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  listAttribute?: string[];
}

const CategoriesSearch: React.FC = () => {
  const { id, category_name } = useParams<{
    id: string;
    category_name: string;
  }>();
  const [, setListCategory] = useState<string[]>([]);
  const [childCategories, setChildCategories] = useState<ChildCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState<ProductsResponse | null>(
    null
  );
  const [filters, setFilters] = useState<Filters>({
    listCategory: [],
    page: 1,
    limit: 12,
    sortBy: "relevance",
    sortOrder: "desc",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchProducts = useCallback(async (params: any) => {
    setLoading(true);
    try {
      const response = await post<ProductsResponse>(
        "/product/elastic/category/filter",
        params
      );
      setProductsData(response);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
      setProductsData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, childrenResponse] = await Promise.all([
          getPublic<Category[]>(`/category/array-id/${id}`),
          getPublic<ChildCategory[]>(`/category/children-of-parent/${id}`),
        ]);

        const newListCategory = categoriesResponse.map(
          (cat: Category) => cat.category_name
        );
        setListCategory(newListCategory);
        setChildCategories(childrenResponse);

        const newFilters = { ...filters, listCategory: newListCategory };
        setFilters(newFilters);
        await fetchProducts(newFilters);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load categories and products");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fetchProducts]);

  const handleCategoryChange = useCallback(
    async (categoryId: string) => {
      try {
        const response = await getPublic<Category[]>(
          `/category/array-id/${categoryId}`
        );
        const newCategories = response.map(
          (cat: Category) => cat.category_name
        );
        setListCategory(newCategories);

        const newFilters = {
          ...filters,
          listCategory: newCategories,
          page: 1,
        };
        setFilters(newFilters);
        await fetchProducts(newFilters);
      } catch (error) {
        console.error("Error updating categories:", error);
        toast.error("Failed to update category selection");
      }
    },
    [filters, fetchProducts]
  );

  const handleFilterChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (newFilters: any) => {
      const updatedFilters = { ...filters, ...newFilters, page: 1 };
      setFilters(updatedFilters);
      await fetchProducts(updatedFilters);
    },
    [filters, fetchProducts]
  );

  const handleClearFilters = useCallback(async () => {
    const clearedFilters = {
      ...filters,
      page: 1,
      priceMin: undefined,
      priceMax: undefined,
      rating: undefined,
      listAttribute: [],
      sortBy: "relevance",
      sortOrder: "desc",
    };
    setFilters(clearedFilters);
    await fetchProducts(clearedFilters);
  }, [filters, fetchProducts]);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      const updatedFilters = { ...filters, page: newPage };
      setFilters(updatedFilters);
      await fetchProducts(updatedFilters);
    },
    [filters, fetchProducts]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container pt-2">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <CategoriesFilterBar
            categories={childCategories}
            selectedCategory={id}
            onCategoryChange={handleCategoryChange}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
        <div className="w-full md:w-3/4">
          {productsData && productsData.products.length > 0 ? (
            <>
              <ProductGrid
                title={`Search product by [${category_name}]`}
                productList={productsData.products}
                grid="3x4"
              />
              <div className="mt-4 flex justify-center items-center space-x-2">
                <Button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                >
                  Previous
                </Button>
                <span>
                  Page {filters.page} of{" "}
                  {Math.ceil(productsData.total / productsData.limit)}
                </span>
                <Button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={
                    filters.page ===
                    Math.ceil(productsData.total / productsData.limit)
                  }
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h2 className="text-2xl font-semibold mb-4">No products found</h2>
              <p className="text-gray-600">
                Try adjusting your filters or search for a different category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSearch;
