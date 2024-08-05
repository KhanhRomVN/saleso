import HomePage from '~/pages/HomePage'
import RegisterPage from '~/pages/RegisterPage'
import UsernameGooglePage from '~/pages/UsernameGooglePage'
import LoginPage from '~/pages/LoginPage'
//* Layout
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
]

const privateRoutes = []

export { publicRoutes, privateRoutes }
