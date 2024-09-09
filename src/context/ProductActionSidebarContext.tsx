import React, { createContext, useState, ReactNode } from "react";

interface ProductActionSidebarContextType {
  isOpen: boolean;
  productId: string | null;
  action: string | null;
  openProductActionSidebar: (productId: string, action: string) => void;
  closeProductActionSidebar: () => void;
}

export const ProductActionSidebarContext =
  createContext<ProductActionSidebarContextType>({
    isOpen: false,
    productId: null,
    action: null,
    openProductActionSidebar: () => {},
    closeProductActionSidebar: () => {},
  });

interface ProductActionSidebarProviderProps {
  children: ReactNode;
}

export const ProductActionSidebarProvider: React.FC<
  ProductActionSidebarProviderProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [action, setAction] = useState<string | null>(null);

  const openProductActionSidebar = (id: string, act: string) => {
    setProductId(id);
    setAction(act);
    setIsOpen(true);
  };

  const closeProductActionSidebar = () => {
    setProductId(null);
    setAction(null);
    setIsOpen(false);
  };

  return (
    <ProductActionSidebarContext.Provider
      value={{
        isOpen,
        productId,
        action,
        openProductActionSidebar,
        closeProductActionSidebar,
      }}
    >
      {children}
    </ProductActionSidebarContext.Provider>
  );
};
