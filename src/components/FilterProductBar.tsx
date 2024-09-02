import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FilterProductBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  value?: string;
  countryOfOrigin?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const FilterProductBar: React.FC<FilterProductBarProps> = ({
  onFilterChange,
}) => {
  const [value, setValue] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [brand, setBrand] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleApplyFilters = () => {
    onFilterChange({
      value: value || undefined,
      countryOfOrigin: countryOfOrigin || undefined,
      brand: brand || undefined,
      priceMin: priceMin !== "" ? Number(priceMin) : undefined,
      priceMax: priceMax !== "" ? Number(priceMax) : undefined,
      rating: rating !== "" ? Number(rating) : undefined,
      sortBy,
      sortOrder,
    });
  };

  return (
    <div className="bg-background_secondary p-4 rounded-lg shadow-md space-y-6">
      <div>
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search products"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="country">Country of Origin</Label>
        <Select onValueChange={(value) => setCountryOfOrigin(value)}>
          <SelectTrigger id="country">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="China">China</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="France">France</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          placeholder="Enter brand name"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="priceMin">Minimum Price</Label>
        <Input
          id="priceMin"
          type="number"
          placeholder="Enter minimum price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="priceMax">Maximum Price</Label>
        <Input
          id="priceMax"
          type="number"
          placeholder="Enter maximum price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select onValueChange={(value) => setRating(value)}>
          <SelectTrigger id="rating">
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 star and above</SelectItem>
            <SelectItem value="2">2 stars and above</SelectItem>
            <SelectItem value="3">3 stars and above</SelectItem>
            <SelectItem value="4">4 stars and above</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sortBy">Sort By</Label>
        <Select onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger id="sortBy">
            <SelectValue placeholder="Select sorting" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="date">Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Select onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
          <SelectTrigger id="sortOrder">
            <SelectValue placeholder="Select order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleApplyFilters} className="w-full">
        Apply Filters
      </Button>
    </div>
  );
};

export default FilterProductBar;