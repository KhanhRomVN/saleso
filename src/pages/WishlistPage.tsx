import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2 } from "lucide-react";
import { get, del } from "@/utils/authUtils";
import { ProductActionSidebarContext } from "@/context/ProductActionSidebarContext";
import ProductActionSidebar from "@/components/ProductActionSidebar";

interface Variant {
  sku: string;
  stock: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  image: string;
  address: string;
  origin: string;
  variants: Variant[];
  price_min: number;
  total_stock: number;
}

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openProductActionSidebar } = useContext(ProductActionSidebarContext);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await get<Product[]>("/wishlist", "order");
      setWishlistItems(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (productId: string) => {
    openProductActionSidebar(productId, "add-to-cart");
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await del(`/wishlist/items/${productId}`, "order");
      setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleClearWishlist = async () => {
    try {
      await del("/wishlist", "order");
      setWishlistItems([]);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-300">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto sm:px-6 lg:px-8 bg-background_secondary text-gray-100 py-10 mb-40"
    >
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-400">Your wishlist is empty.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl">{wishlistItems.length} items</p>
            <Button
              onClick={handleClearWishlist}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All
            </Button>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-700">
                  <TableHead className="text-gray-300">Product</TableHead>
                  <TableHead className="text-right text-gray-300">
                    Price
                  </TableHead>
                  <TableHead className="text-right text-gray-300">
                    Stock
                  </TableHead>
                  <TableHead className="text-center text-gray-300">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlistItems.map((item, index) => (
                  <motion.tr
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b border-gray-700"
                  >
                    <TableCell className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <span className="font-medium text-lg">{item.name}</span>
                        <p className="text-sm text-gray-400">{item.origin}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${item.price_min.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.total_stock}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center space-x-4">
                        <ShoppingCart
                          onClick={() => handleAddToCart(item._id)}
                          className="w-6 h-6 cursor-pointer text-blue-400 hover:text-blue-300"
                        />
                        <Trash2
                          onClick={() => handleRemoveFromWishlist(item._id)}
                          className="w-6 h-6 cursor-pointer text-red-400 hover:text-red-300"
                        />
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          <ProductActionSidebar />
        </>
      )}
    </motion.div>
  );
};

export default WishlistPage;
