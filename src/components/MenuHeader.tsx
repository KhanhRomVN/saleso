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
        const response = await getPublic<Category[]>("/category/level/1");
        setCategories(response);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (id: string, slug: string) => {
    navigate(`/categories/${id}/${slug}`);
  };

  return (
    <div className="bg-background border-b h-10 flex justify-between px-8">
      <div className="h-full">
        <ul className="flex justify-center space-x-8 h-full items-center">
          <li>
            <Button
              variant="ghost"
              className="h-8 px-3 py-1"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-3 py-1">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category._id}
                    onClick={() =>
                      handleCategoryClick(category._id, category.slug)
                    }
                  >
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <Button variant="ghost" className="h-8 px-3 py-1">
              Shop
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="h-8 px-3 py-1">
              Product
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-3 py-1">
                  Pages <ChevronDown className="ml-1 h-4 w-4" />
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
