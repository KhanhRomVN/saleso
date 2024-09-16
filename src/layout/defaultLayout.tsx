import React from "react";
import MainHeader from "@/components/MainHeader";
import UtilityHeader from "@/components/UtilityHeader";
import MenuHeader from "@/components/MenuHeader";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full fixed top-0 z-50 bg-background_secondary shadow-md"
      >
        <UtilityHeader />
        <MainHeader />
        <MenuHeader />
      </motion.div>
      <div className="flex flex-1 pb-10">
        <main className="flex-1 overflow-y-hidden pt-[88px] sm:pt-[128px] px-4 sm:px-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
