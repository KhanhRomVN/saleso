import ProductGrid from "@/components/ProductGrid";
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
import Slider from "@/components/Slider";

const FlashsaleAPI = `${BACKEND_URI}/product/flash-sale`;
const mainBannerBody = {
  type: "banner",
  ratio: "16:5",
};

const categoryBody = {
  type: "category",
  ratio: "16:9",
};

const extraBannerBody = {
  type: "banner",
  ratio: "16:5",
};

const cardBody = {
  type: "card",
  ratio: "1:1",
};

interface HomePageProps {
  openCart: (productId: string) => void;
}

function HomePage({ openCart }: HomePageProps) {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <Slider
          api="http://localhost:8080/gallery/filter"
          body={mainBannerBody}
          itemPerSlide={1}
          noActionArrow={false}
        />
        <p className="pl-5 text-xl">Top Categories</p>
        <Slider
          api="http://localhost:8080/gallery/filter"
          body={categoryBody}
          itemPerSlide={4}
        />
      </div>

      <ProductGrid
        title="Flashsale"
        api={FlashsaleAPI}
        grid="1x4"
        openCart={openCart}
      />
      <div className="flex justify-center items-center">
        <div className="w-[75%]">
          <Slider
            api="http://localhost:8080/gallery/filter"
            body={extraBannerBody}
            itemPerSlide={1}
            noActionArrow={false}
          />
        </div>
        <div className="w-[25%]">
          {" "}
          <Slider
            api="http://localhost:8080/gallery/filter"
            body={cardBody}
            itemPerSlide={1}
            noActionArrow={false}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
