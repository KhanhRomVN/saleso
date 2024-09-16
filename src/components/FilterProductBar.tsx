import { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

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

interface FilterProductBarProps {
  products: Product[];
  onFilterChange: (filters: any) => void;
}

export default function FilterProductBar({
  onFilterChange,
}: FilterProductBarProps) {
  const [selectedFilters, setSelectedFilters] = useState({
    address: "",
    rating: 0,
  });

  const handleFilterChange = (key: string, value: any) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFilterChange(selectedFilters);
  };

  const clearFilters = () => {
    setSelectedFilters({ address: "", rating: 0 });
    onFilterChange({ address: "", rating: 0 });
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-64 p-4 bg-background_secondary border rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Address filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Address
        </h4>
        {["Ha Noi", "Ho Chi Minh", "Da Nang", "Can Tho"].map((city) => (
          <div key={city} className="flex items-center mb-1">
            <Checkbox
              id={city}
              checked={selectedFilters.address === city}
              onCheckedChange={() => handleFilterChange("address", city)}
            />
            <label htmlFor={city} className="ml-2 text-sm">
              {city}
            </label>
          </div>
        ))}
        <Input
          placeholder="Other address"
          value={selectedFilters.address}
          onChange={(e) => handleFilterChange("address", e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Rating filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2 flex items-center">
          <Star className="w-4 h-4 mr-2" />
          Rating
        </h4>
        {[1, 2, 3, 4, 5].map((rating) => (
          <div key={rating} className="flex items-center mb-1">
            <Checkbox
              id={`rating-${rating}`}
              checked={selectedFilters.rating === rating}
              onCheckedChange={() => handleFilterChange("rating", rating)}
            />
            <label
              htmlFor={`rating-${rating}`}
              className="ml-2 text-sm flex items-center"
            >
              {rating} {rating === 1 ? "star" : "stars"}
              {Array.from({ length: rating }).map((_, index) => (
                <Star
                  key={index}
                  className="w-3 h-3 ml-1 text-yellow-400 fill-current"
                />
              ))}
            </label>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex-grow">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="flex-grow">
          Clear
        </Button>
      </div>
    </motion.div>
  );
}
