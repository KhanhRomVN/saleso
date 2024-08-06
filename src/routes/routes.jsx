import HomePage from '~/pages/HomePage/HomePage'
import RegisterPage from '~/pages/RegisterPage'
import UsernameGooglePage from '~/pages/UsernameGooglePage'
import LoginPage from '~/pages/LoginPage'
import ProductPage from '~/pages/ProductPage'
import CartPage from '~/pages/CartPage/CartPage'
import DefaultLayout from '~/layout/defaultLayout'

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
    path: '/product/:productId',
    element: (
      <DefaultLayout>
        <ProductPage />
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
]

const privateRoutes = []

export { publicRoutes, privateRoutes }
