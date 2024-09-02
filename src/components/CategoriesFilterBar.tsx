import React, { useState, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, X } from "lucide-react";

interface CategoriesFilterBarProps {
  categories: { _id: string; name: string }[];
  selectedCategory: string | undefined; // Corrected spelling here
  onCategoryChange: (categoryId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
}
const CategoriesFilterBar: React.FC<CategoriesFilterBarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onFilterChange,
  onClearFilters,
}) => {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [rating, setRating] = useState(0);
  const [attributes, setAttributes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleFilterClick = useCallback(() => {
    onFilterChange({
      priceMin: priceMin ? parseFloat(priceMin) : undefined,
      priceMax: priceMax ? parseFloat(priceMax) : undefined,
      rating: rating || undefined,
      listAttribute: attributes,
      sortBy,
      sortOrder,
    });
  }, [
    priceMin,
    priceMax,
    rating,
    attributes,
    sortBy,
    sortOrder,
    onFilterChange,
  ]);

  const handleClearClick = useCallback(() => {
    setPriceMin("");
    setPriceMax("");
    setRating(0);
    setAttributes([]);
    setSortBy("relevance");
    setSortOrder("desc");
    onClearFilters();
  }, [onClearFilters]);

  const handleAttributeChange = useCallback(
    (attribute: string, checked: boolean) => {
      setAttributes((prev) =>
        checked
          ? [...prev, attribute]
          : prev.filter((attr) => attr !== attribute)
      );
    },
    []
  );

  const handleRatingClick = useCallback((selectedRating: number) => {
    setRating((prevRating) =>
      prevRating === selectedRating ? 0 : selectedRating
    );
  }, []);

  const categoryOptions = useMemo(() => {
    return categories.map((category) => (
      <SelectItem key={category._id} value={category._id}>
        {category.name}
      </SelectItem>
    ));
  }, [categories]);

  return (
    <Card className="mb-6 bg-background_secondary">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Category</h3>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>{categoryOptions}</SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Price Range</h3>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Minimum Rating</h3>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant={rating >= star ? "default" : "outline"}
                size="sm"
                onClick={() => handleRatingClick(star)}
              >
                <Star
                  className={rating >= star ? "fill-current" : ""}
                  size={16}
                />
              </Button>
            ))}
            {rating > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setRating(0)}>
                <X size={16} />
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Attributes</h3>
          {["Brand", "Color", "Size"].map((attr) => (
            <div key={attr} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={attr}
                checked={attributes.includes(attr)}
                onCheckedChange={(checked) =>
                  handleAttributeChange(attr, checked as boolean)
                }
              />
              <Label htmlFor={attr}>{attr}</Label>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Sort By</h3>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-medium mb-2">Sort Order</h3>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleFilterClick} className="flex-1">
            Apply Filters
          </Button>
          <Button
            onClick={handleClearClick}
            variant="outline"
            className="flex-1"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesFilterBar;
