import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tag, Package, MapPin, ArrowRight } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  images: string[];
  countryOfOrigin: string;
  tags: string[];
}

interface SearchResultProps {
  results: {
    products: Product[];
  };
  onResultClick: (value: string) => void;
}

const TagSection: React.FC<{
  tags: string[];
  onResultClick: (value: string) => void;
}> = ({ tags, onResultClick }) => {
  const navigate = useNavigate();

  const handleTagClick = (tag: string) => {
    onResultClick(tag);
    navigate(`/search/${encodeURIComponent(tag)}`);
  };

  return (
    <div className="p-3 border-b border-border">
      <h3 className="text-sm font-semibold mb-2 flex items-center">
        <Tag className="mr-2 h-4 w-4" />
        Related Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 5).map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ProductItem: React.FC<{
  product: Product;
  onResultClick: (value: string) => void;
}> = ({ product, onResultClick }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    onResultClick(product.name);
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="flex items-center p-3 hover:bg-accent cursor-pointer transition-colors duration-200"
      onClick={handleProductClick}
    >
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-16 h-16 object-cover rounded-md mr-4 border border-border"
      />
      <div className="flex-grow">
        <h4 className="text-sm font-medium mb-1 line-clamp-2">
          {product.name}
        </h4>
        <p className="text-xs text-muted-foreground flex items-center">
          <MapPin className="mr-1 h-3 w-3" />
          {product.countryOfOrigin}
        </p>
      </div>
      <ArrowRight className="text-muted-foreground h-4 w-4" />
    </div>
  );
};

const NoResults: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <Package className="h-12 w-12 text-muted-foreground mb-4" />
    <p className="text-lg font-semibold mb-2">No results found</p>
    <p className="text-sm text-muted-foreground">
      Try adjusting your search or filter to find what you're looking for.
    </p>
  </div>
);

const SearchResult: React.FC<SearchResultProps> = ({
  results,
  onResultClick,
}) => {
  const allTags = Array.from(
    new Set(results.products.flatMap((product) => product.tags))
  );

  return (
    <div className="max-h-[32rem] w-96 overflow-y-auto bg-background border border-border rounded-md shadow-lg">
      {allTags.length > 0 && (
        <TagSection tags={allTags} onResultClick={onResultClick} />
      )}
      {results.products.length > 0 ? (
        <div>
          {results.products.slice(0, 3).map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              onResultClick={onResultClick}
            />
          ))}
        </div>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default SearchResult;
