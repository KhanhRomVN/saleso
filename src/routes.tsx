import RegisterPage from "./pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import ProductPage from "./pages/ProductPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import SearchPage from "./pages/SearchPage";
import DefaultLayout from "@/layout/defaultLayout";
import PaymentPage from "./pages/PaymentPage";
// Setting
import SettingLayout from "./layout/settingLayout";
import AccountContentPage from "./pages/Setting/AccountContentPage";
import AddressContentPage from "./pages/Setting/AddressContentPage";
import OrderContentPage from "./pages/Setting/OrderContentPage";
import PaymentContentPage from "./pages/Setting/PaymentContentPage";
import NotificationContentPage from "./pages/Setting/NotificationContentPage";
import MessageContentPage from "./pages/Setting/MessageContentPage";
import OtherContentPage from "./pages/Setting/OtherContentPage";

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
    path: "/checkout/:session_id",
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
    path: "/setting/account",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <AccountContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/address",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <AddressContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/payment",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <PaymentContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/notification",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <NotificationContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/message",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <MessageContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/message/:conversation_id",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <MessageContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },

  {
    path: "/setting/order",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <OrderContentPage />
        </SettingLayout>
      </DefaultLayout>
    ),
  },
  {
    path: "/setting/other",
    element: (
      <DefaultLayout>
        <SettingLayout>
          <OtherContentPage />
        </SettingLayout>
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
    path: "/payment/:session_id",
    element: (
      <DefaultLayout>
        <PaymentPage />
      </DefaultLayout>
    ),
  },
];

export { publicRoutes };
