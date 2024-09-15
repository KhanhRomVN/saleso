import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import SearchResult from "./SearchResult";
import { postPublic } from "@/utils/authUtils";

const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  const fetchSearchResults = useCallback(async (query: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await postPublic<any>("/product/elastic/search", { 
        value: query,
      });
      setSearchResults(response);
      setIsSearchResultVisible(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText && !isTyping) {
        fetchSearchResults(searchText);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText, isTyping, fetchSearchResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsSearchResultVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchText = event.target.value;
    setSearchText(newSearchText);
    setIsTyping(true);
  };

  const handleKeyUp = () => {
    setIsTyping(false);
  };

  const handleFocus = () => {
    if (searchResults) {
      setIsSearchResultVisible(true);
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchResults(null);
    setIsSearchResultVisible(false);
  };

  const handleResultClick = (value: string) => {
    setIsSearchResultVisible(false);
    // Save to localStorage
    const recentSearches = JSON.parse(
      localStorage.getItem("recentSearches") || "[]"
    );
    if (!recentSearches.includes(value)) {
      recentSearches.unshift(value);
      if (recentSearches.length > 5) recentSearches.pop();
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  };

  return (
    <div className="w-full max-w-md relative" ref={searchBarRef}>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          placeholder="Search..."
          className="pl-10 pr-10 w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
          value={searchText}
          onChange={handleSearchChange}
          onKeyUp={handleKeyUp}
          onFocus={handleFocus}
        />
        {searchText && (
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            onClick={handleClearSearch}
          >
            <X size={16} />
          </button>
        )}
      </div>
      {isSearchResultVisible && searchResults && (
        <div className="absolute z-10 w-full mt-1">
          <SearchResult
            results={searchResults}
            onResultClick={handleResultClick}
          />
        </div>
      )}
    </div>
  );
};

export default SearchBar;
