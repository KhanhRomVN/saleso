import RegisterPage from "./pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import ProductPage from "./pages/ProductPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import SettingPage from "./pages/SettingPage";
import SearchPage from "./pages/SearchPage";
import CategoriesSearch from "./pages/CategoriesSearch";
import DefaultLayout from "@/layout/defaultLayout";

const publicRoutes = [
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    ),
  },
  {
    path: "/product/:product_id",
    element: (
      <DefaultLayout>
        <ProductPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/wishlist",
    element: (
      <DefaultLayout>
        <WishlistPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/cart",
    element: (
      <DefaultLayout>
        <CartPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/checkout",
    element: (
      <DefaultLayout>
        <CheckoutPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/order-success",
    element: (
      <DefaultLayout>
        <OrderSuccessPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/setting",
    element: (
      <DefaultLayout>
        <SettingPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/search/:value",
    element: (
      <DefaultLayout>
        <SearchPage />
      </DefaultLayout>
    ),
  },
  {
    path: "/categories/:id/:category_name",
    element: (
      <DefaultLayout>
        <CategoriesSearch />
      </DefaultLayout>
    ),
  },
];

export { publicRoutes };
