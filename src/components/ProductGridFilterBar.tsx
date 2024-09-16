import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

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

interface ProductGridFilterBarProps {
  products: Product[];
  onFilterChange: (filteredProducts: Product[]) => void;
}

export default function ProductGridFilterBar({
  products,
  onFilterChange,
}: ProductGridFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, sortOrder, products]);

  const filterAndSortProducts = () => {
    let result = [...products];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by price
    if (sortOrder) {
      result.sort((a, b) =>
        sortOrder === "asc" ? a.price - b.price : b.price - a.price
      );
    }
    onFilterChange(result);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4 p-2 bg-background_secondary border rounded-lg shadow-md"
    >
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-grow flex items-centerrounded-md border">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none focus:ring-0"
          />
        </div>
        <Button
          onClick={toggleSortOrder}
          variant="outline"
          className="bg-background"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          {sortOrder === "asc" ? "Price: Low to High" : "Price: High to Low"}
        </Button>
      </div>
    </motion.div>
  );
}
