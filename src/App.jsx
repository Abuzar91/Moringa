import React, { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import AdminRoute from "./components/AdminRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import OrderNotification from "./components/OrderNotification";

const HomePage = React.lazy(() => import("./pages/HomePage"));
const ProductsPage = React.lazy(() => import("./pages/ProductsPage"));
const ProductDetailPage = React.lazy(() => import("./pages/ProductDetailPage"));
const CartPage = React.lazy(() => import("./pages/CartPage"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = React.lazy(() => import("./pages/OrderSuccessPage"));
const ContactPage = React.lazy(() => import("./pages/ContactPage"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));
const Orders = React.lazy(() => import("./pages/Orders"));
const ShippingInfoPage = React.lazy(() => import("./pages/ShippingInfoPage"));
const ReturnsExchangesPage = React.lazy(() =>
  import("./pages/ReturnsExchangesPage")
);
const SoapGuidePage = React.lazy(() => import("./pages/SoapGuidePage"));
const FAQPage = React.lazy(() => import("./pages/FAQPage"));
const PrivacyPolicyPage = React.lazy(() => import("./pages/PrivacyPolicyPage"));

const AdminLayout = React.lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = React.lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = React.lazy(() => import("./pages/admin/AdminOrders"));
const AdminUsers = React.lazy(() => import("./pages/admin/AdminUsers"));
const AdminAnnouncements = React.lazy(() =>
  import("./pages/admin/AdminAnnouncements")
);
const AdminReviews = React.lazy(() => import("./pages/admin/AdminReviews"));

const LoadingContext = React.createContext();

const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = React.useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <LoadingSpinner fullScreen text="Loading..." />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => React.useContext(LoadingContext);

const PageLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading page...</p>
    </div>
  </div>
);

const AdminLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="h-8 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
        <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
      </div>
    </div>
  </div>
);

const PageWrapper = ({ children, showWhatsApp = true }) => (
  <>
    <Navbar />
    <Suspense fallback={<PageLoadingFallback />}>{children}</Suspense>
    <Footer />
    {showWhatsApp && <WhatsAppButton />}
  </>
);

const AdminPageWrapper = ({ children }) => (
  <AdminRoute>
    <Suspense fallback={<AdminLoadingFallback />}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  </AdminRoute>
);

function App() {
  return (
    <>
      <Helmet>
        <title>
          Am-Botonics - Premium Skincare Products | Natural Beauty Solutions
        </title>
        <meta
          name="description"
          content="Discover AM-Botnics premium skincare collection. Transform your skin with our natural face creams, body creams, and anti-aging solutions. Free delivery across Pakistan."
        />
        <link
          rel="preload"
          href="/api/products"
          as="fetch"
          crossOrigin="anonymous"
        />
      </Helmet>
      <Router>
        <AuthProvider>
          <LoadingProvider>
            <CartProvider>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route
                    path="/"
                    element={
                      <PageWrapper>
                        <HomePage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <PageWrapper>
                        <ProductsPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={
                      <PageWrapper>
                        <ProductDetailPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <PageWrapper>
                        <CartPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <PageWrapper>
                        <CheckoutPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <PageWrapper>
                        <Orders />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <PageWrapper>
                        <OrderSuccessPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <PageWrapper>
                        <ContactPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <PageWrapper showWhatsApp={false}>
                        <AuthPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/shipping-info"
                    element={
                      <PageWrapper>
                        <ShippingInfoPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/returns-exchanges"
                    element={
                      <PageWrapper>
                        <ReturnsExchangesPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/soap-guide"
                    element={
                      <PageWrapper>
                        <SoapGuidePage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <PageWrapper>
                        <FAQPage />
                      </PageWrapper>
                    }
                  />
                  <Route
                    path="/privacy-policy"
                    element={
                      <PageWrapper>
                        <PrivacyPolicyPage />
                      </PageWrapper>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminPageWrapper>
                        <AdminDashboard />
                      </AdminPageWrapper>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminPageWrapper>
                        <AdminProducts />
                      </AdminPageWrapper>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminPageWrapper>
                        <AdminOrders />
                      </AdminPageWrapper>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminPageWrapper>
                        <AdminUsers />
                      </AdminPageWrapper>
                    }
                  />
                  <Route
                    path="/admin/announcements"
                    element={
                      <AdminPageWrapper>
                        <AdminAnnouncements />
                      </AdminPageWrapper>
                    }
                  />
                  <Route
                    path="/admin/reviews"
                    element={
                      <AdminPageWrapper>
                        <AdminReviews />
                      </AdminPageWrapper>
                    }
                  />
                </Routes>

                {/* Global Components */}
                <Toaster position="top-right" />
                <OrderNotification />
              </div>
            </CartProvider>
          </LoadingProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
