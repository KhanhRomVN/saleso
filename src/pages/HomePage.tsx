import ProductGrid from "@/components/ProductGrid";
import Slider from "@/components/Slider";
import { Clock, Star } from "lucide-react";

const FlashsaleAPI = `/product/flash-sale`;
const TopSellingAPI = `/product/top-sell`;
const mainBannerBody = {
  type: "banner",
  ratio: "16:5",
};

const categoryBody = {
  type: "category",
  ratio: "16:9",
};

function HomePage() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Slider
          api="/gallery/filter"
          body={mainBannerBody}
          itemPerSlide={1}
          noActionArrow={true}
        />
        <p className="pl-5 text-xl">Top Categories</p>
        <Slider
          api="/gallery/filter"
          body={categoryBody}
          itemPerSlide={4}
          noActionArrow={true}
        />
      </div>
      <ProductGrid
        title={
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span className="text-xl">Flashsale</span>
          </div>
        }
        api={FlashsaleAPI}
        grid="1x4"
      />
      <ProductGrid
        title={
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <span className="text-xl">HotSale</span>
          </div>
        }
        api={TopSellingAPI}
        grid="1x4"
      />
    </div>
  );
}

export default HomePage;
