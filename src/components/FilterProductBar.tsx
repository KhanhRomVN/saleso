import React, { useState, useCallback } from "react";
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
  priceMin?: string | number;
  priceMax?: string | number;
  rating?: string | number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const FilterProductBar: React.FC<FilterProductBarProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    value: "",
    countryOfOrigin: "",
    brand: "",
    priceMin: "",
    priceMax: "",
    rating: "",
    sortBy: "relevance",
    sortOrder: "desc",
  });

  const handleInputChange = useCallback(
    (field: keyof FilterOptions, value: string) => {
      setFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleApplyFilters = useCallback(() => {
    onFilterChange({
      ...filters,
      priceMin: filters.priceMin !== "" ? Number(filters.priceMin) : undefined,
      priceMax: filters.priceMax !== "" ? Number(filters.priceMax) : undefined,
      rating: filters.rating !== "" ? Number(filters.rating) : undefined,
    });
  }, [filters, onFilterChange]);

  return (
    <div className="bg-background_secondary p-4 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <FilterInput
        label="Search"
        id="search"
        placeholder="Search products"
        value={filters.value}
        onChange={(value) => handleInputChange("value", value)}
      />

      <FilterSelect
        label="Country of Origin"
        id="country"
        value={filters.countryOfOrigin}
        onChange={(value) => handleInputChange("countryOfOrigin", value)}
        options={[
          { value: "USA", label: "USA" },
          { value: "China", label: "China" },
          { value: "Japan", label: "Japan" },
          { value: "Germany", label: "Germany" },
          { value: "France", label: "France" },
        ]}
      />

      <FilterInput
        label="Brand"
        id="brand"
        placeholder="Enter brand name"
        value={filters.brand}
        onChange={(value) => handleInputChange("brand", value)}
      />

      <FilterInput
        label="Minimum Price"
        id="priceMin"
        type="number"
        placeholder="Enter minimum price"
        value={filters.priceMin}
        onChange={(value) => handleInputChange("priceMin", value)}
      />

      <FilterInput
        label="Maximum Price"
        id="priceMax"
        type="number"
        placeholder="Enter maximum price"
        value={filters.priceMax}
        onChange={(value) => handleInputChange("priceMax", value)}
      />

      <FilterSelect
        label="Rating"
        id="rating"
        placeholder="Select rating"
        value={filters.rating?.toString()}
        onChange={(value) => handleInputChange("rating", value)}
        options={[
          { value: "1", label: "1 star and above" },
          { value: "2", label: "2 stars and above" },
          { value: "3", label: "3 stars and above" },
          { value: "4", label: "4 stars and above" },
          { value: "5", label: "5 stars" },
        ]}
      />

      <FilterSelect
        label="Sort By"
        id="sortBy"
        placeholder="Select sorting"
        value={filters.sortBy}
        onChange={(value) => handleInputChange("sortBy", value)}
        options={[
          { value: "relevance", label: "Relevance" },
          { value: "price", label: "Price" },
          { value: "rating", label: "Rating" },
          { value: "date", label: "Date" },
        ]}
      />

      <FilterSelect
        label="Sort Order"
        id="sortOrder"
        placeholder="Select order"
        value={filters.sortOrder}
        onChange={(value) =>
          handleInputChange("sortOrder", value as "asc" | "desc")
        }
        options={[
          { value: "asc", label: "Ascending" },
          { value: "desc", label: "Descending" },
        ]}
      />

      <Button onClick={handleApplyFilters} className="w-full col-span-full">
        Apply Filters
      </Button>
    </div>
  );
};

// Tạo các component con để tái sử dụng
const FilterInput = ({
  label,
  id,
  onChange,
  ...props
}: { label: string; id: string; onChange: (value: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
>) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} {...props} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const FilterSelect = ({
  label,
  id,
  options,
  onChange,
  placeholder,
  ...props
}: {
  label: string;
  id: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
} & Omit<React.ComponentProps<typeof Select>, 'onValueChange'>) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Select onValueChange={onChange} {...props}>
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder ?? "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default FilterProductBar;
