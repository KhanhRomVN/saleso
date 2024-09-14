/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { postPublic } from "@/utils/authUtils";

interface SliderItem {
  _id: string;
  image_uri: string;
  path: string;
}

interface SliderProps {
  api: string;
  body?: Record<string, unknown>;
  itemPerSlide?: number;
  autoPlay?: boolean;
  noActionArrow?: boolean;
  itemWidth?: string;
}

const Slider: React.FC<SliderProps> = ({
  api,
  body = {},
  itemPerSlide = 1,
  autoPlay = true,
  noActionArrow = true,
  itemWidth = "100%",
}) => {
  const [items, setItems] = useState<SliderItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await postPublic<{ images: SliderItem[] }>(api, body);
        setItems(response.images);
      } catch (error) {
        console.error("Error fetching slider items:", error);
      }
    };

    fetchItems();
  }, [api, body]);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: itemPerSlide,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: Math.max(1, itemPerSlide - 1),
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const CustomButtonGroup = ({ next, previous }: any) => (
    <div className="custom-button-group absolute top-1/2 w-full">
      <Button
        className="custom-button-left absolute left-4 -translate-y-1/2 bg-background_secondary py-0 px-2"
        onClick={previous}
      >
        <ChevronLeft className="text-white rounded-lg " />
      </Button>
      <Button
        className="custom-button-right absolute right-4 -translate-y-1/2 bg-background_secondary py-0 px-2"
        onClick={next}
      >
        <ChevronRight className="text-white rounded-lg" />
      </Button>
    </div>
  );

  return (
    <div className="px-4 relative">
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={autoPlay}
        autoPlaySpeed={3000}
        customButtonGroup={noActionArrow ? <CustomButtonGroup /> : undefined}
        arrows={false}
        className="z-0"
        itemClass={itemPerSlide > 1 ? "px-2" : ""}
      >
        {items.map((item) => (
          <motion.div
            key={item._id}
            className="cursor-pointer"
            style={{ width: itemWidth }}
            onClick={() => navigate(item.path)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={item.image_uri}
              alt="Slider Item"
              className="w-full h-auto object-cover rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;
