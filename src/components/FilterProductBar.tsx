import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getPublic } from "@/utils/authUtils";
import { Star, MapPin, Tag } from "lucide-react";
import { Product, Variant } from "@/types/product";

interface FilterProductBarProps {
  products: Product[];
  onFilterChange: (filters: any) => void;
}

export default function FilterProductBar({
  products,
  onFilterChange,
}: FilterProductBarProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    sku: "",
    group: "",
    address: "",
    rating: 0,
    priceRange: [0, 1000],
  });

  useEffect(() => {
    fetchVariants();
  }, [products]);

  const fetchVariants = async () => {
    if (products.length === 0) return;

    const categoryCount = products.reduce((acc, product) => {
      product.categories.forEach((category) => {
        acc[category.category_id] = (acc[category.category_id] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const mostCommonCategoryId = Object.entries(categoryCount).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    try {
      const response = await getPublic<Variant[][]>(
        `/variant/category/${mostCommonCategoryId}`
      );
      const processedVariants = response
        .slice(0, 3)
        .flatMap((group) => group.slice(0, 3));
      setVariants(processedVariants);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onFilterChange(selectedFilters);
  };

  const groupedVariants = variants.reduce((acc, variant) => {
    if (!acc[variant.group]) {
      acc[variant.group] = [];
    }
    acc[variant.group].push(variant);
    return acc;
  }, {} as Record<string, Variant[]>);

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full md:w-64 p-4 bg-background border rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">Filters</h3>

      {/* Variant filters */}
      {Object.entries(groupedVariants).map(([group, groupVariants]) => (
        <div key={group} className="mb-4">
          <h4 className="font-medium mb-2 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            {group}
          </h4>
          {groupVariants.map((variant) => (
            <div key={variant._id} className="flex items-center mb-1">
              <Checkbox
                id={variant.sku}
                checked={selectedFilters.sku === variant.sku}
                onCheckedChange={() => handleFilterChange("sku", variant.sku)}
              />
              <label htmlFor={variant.sku} className="ml-2 text-sm">
                {variant.variant}
              </label>
            </div>
          ))}
        </div>
      ))}

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

      {/* Price Range filter */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Price Range</h4>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={selectedFilters.priceRange}
          onValueChange={(value) => handleFilterChange("priceRange", value)}
          className="mb-2"
        />
        <div className="flex justify-between text-sm">
          <span>${selectedFilters.priceRange[0]}</span>
          <span>${selectedFilters.priceRange[1]}</span>
        </div>
      </div>

      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </motion.div>
  );
}
