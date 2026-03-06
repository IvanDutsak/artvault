import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import ArtworkDetail from "./pages/ArtworkDetail";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import About from "./pages/About";
import ViewInRoom from "./pages/ViewInRoom";
import Gallery3D from "./pages/Gallery3D";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import LoadingScreen from "./components/LoadingScreen";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/gallery3d" component={Gallery3D} />
      <Route path="/artwork/:id" component={ArtworkDetail} />
      <Route path="/artwork/:id/room" component={ViewInRoom} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/cart" component={Cart} />
      <Route path="/about" component={About} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

import SmoothScroll from "./components/SmoothScroll";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CartProvider>
          <FavoritesProvider>
            <TooltipProvider>
              <LoadingScreen isLoading={isLoading} />
              <CustomCursor />
              <ScrollProgress />
              <BackToTop />
              <Toaster
                toastOptions={{
                  style: {
                    background: "oklch(0.15 0.005 285)",
                    border: "1px solid oklch(0.75 0.12 85 / 30%)",
                    color: "oklch(0.95 0.01 85)",
                    fontFamily: "var(--font-ui)",
                  },
                }}
              />
              <div className="grain-overlay">
                <SmoothScroll>
                  <Router />
                </SmoothScroll>
              </div>
            </TooltipProvider>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
