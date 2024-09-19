import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getPublic } from "@/utils/authUtils";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const MenuHeader: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getPublic<Category[]>(
          "/category/level/1",
          "product"
        );
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (_id: string, slug: string) => {
    navigate(`/search/${slug}`);
  };

  return (
    <div className="bg-background border-b h-10 hidden sm:flex justify-between px-8">
      <div className="h-full">
        <ul className="flex justify-center space-x-4 sm:space-x-8 h-full items-center">
          <li>
            <Button
              variant="ghost"
              className="h-8 px-2 sm:px-3 py-1 text-sm"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 px-2 sm:px-3 py-1 text-sm"
                >
                  Categories{" "}
                  <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category._id}
                    onClick={() =>
                      handleCategoryClick(category._id, category.slug)
                    }
                    className="cursor-pointer"
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <Button variant="ghost" className="h-8 px-2 sm:px-3 py-1 text-sm">
              Shop
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="h-8 px-2 sm:px-3 py-1 text-sm">
              Product
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 px-2 sm:px-3 py-1 text-sm"
                >
                  Pages <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>About Us</DropdownMenuItem>
                <DropdownMenuItem>Contact</DropdownMenuItem>
                <DropdownMenuItem>Blog</DropdownMenuItem>
                <DropdownMenuItem>FAQ</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
      <div className=""></div>
    </div>
  );
};

export default MenuHeader;
