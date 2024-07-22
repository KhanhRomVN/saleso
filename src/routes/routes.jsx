//* Public Page
import HomePage from '~/pages/HomePage'

//* Auth Page
import RegisterPage from '~/pages/RegisterPage'
import UsernameGooglePage from '~/pages/UsernameGooglePage'
import LoginPage from '~/pages/LoginPage'

//* Shopping Page
import MyProductPage from '~/pages/MyProductPage/MyProductPage'
import ProductPage from '~/pages/ProductPage/ProductPage'
import CartPage from '~/pages/CartPage/CartPage'

//* Other Page
import ChatPage from '~/pages/ChatPage/ChatPage'
import FriendPage from '~/pages/FriendPage/FriendPage'
import CheckoutPage from '~/pages/CheckoutPage'
import BasicOrderPage from '~/pages/BasicOrderPage'
import OrderPage from '~/pages/OrderPage/OrderPage'

//* Setting Page
import UserProfile from '~/pages/SettingPage/UserProfile'
import SocialMediaFeatures from '~/pages/SettingPage/SocialMediaFeatures'
import Notifications from '~/pages/SettingPage/Notifications'
import Others from '~/pages/SettingPage/Others'

//* Admin Page

//* Layout Component
import DefaultLayout from '~/layout/defaultLayout'
import NoFooterLayout from '~/layout/noFooterLayout'
import NoHeaderAndFooterLayout from '~/layout/noHeaderAndFooterLayout'

const publicRoutes = [
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register/username/:sub',
    element: <UsernameGooglePage />,
  },
  {
    path: '/',
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    ),
  },
  {
    path: '/cart',
    element: (
      <DefaultLayout>
        <CartPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/friend',
    element: (
      <DefaultLayout>
        <FriendPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/chat',
    element: (
      <NoHeaderAndFooterLayout>
        <ChatPage />
      </NoHeaderAndFooterLayout>
    ),
  },
  {
    path: '/my-product',
    element: (
      <DefaultLayout>
        <MyProductPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/product/:prod_id',
    element: (
      <DefaultLayout>
        <ProductPage />
      </DefaultLayout>
    ),
  },
  {
    path: '/setting/user-profile',
    element: (
      <NoFooterLayout>
        <UserProfile />
      </NoFooterLayout>
    ),
  },
  {
    path: '/setting/social-media',
    element: (
      <NoFooterLayout>
        <SocialMediaFeatures />
      </NoFooterLayout>
    ),
  },
  {
    path: '/setting/notifications',
    element: (
      <NoFooterLayout>
        <Notifications />
      </NoFooterLayout>
    ),
  },
  {
    path: '/setting/others',
    element: (
      <NoFooterLayout>
        <Others />
      </NoFooterLayout>
    ),
  },
  {
    path: '/checkout',
    element: (
      <NoFooterLayout>
        <CheckoutPage />
      </NoFooterLayout>
    ),
  },
  {
    path: '/checkout/basic-order',
    element: (
      <NoFooterLayout>
        <BasicOrderPage />
      </NoFooterLayout>
    ),
  },
  {
    path: '/order',
    element: (
      <DefaultLayout>
        <OrderPage />
      </DefaultLayout>
    ),
  },
]

const privateRoutes = []

export { publicRoutes, privateRoutes }
