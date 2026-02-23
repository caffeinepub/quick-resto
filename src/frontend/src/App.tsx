import { createRouter, createRoute, createRootRoute, RouterProvider } from '@tanstack/react-router';
import RestaurantListingPage from './pages/RestaurantListingPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import Layout from './components/Layout';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: RestaurantListingPage,
});

const detailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/restaurant/$restaurantName',
  component: RestaurantDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation/$orderId',
  component: OrderConfirmationPage,
});

const orderHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/orders',
  component: OrderHistoryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  detailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
  orderHistoryRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
