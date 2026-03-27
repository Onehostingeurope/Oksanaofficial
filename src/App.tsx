import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./components/admin/AdminDashboard.tsx";
import AdminHero from "./components/admin/AdminHero.tsx";
import AdminAbout from "./components/admin/AdminAbout.tsx";
import AdminGallery from "./components/admin/AdminGallery.tsx";
import AdminMusic from "./components/admin/AdminMusic.tsx";
import AdminEvents from "./components/admin/AdminEvents.tsx";
import AdminMerch from "./components/admin/AdminMerch.tsx";
import AdminSettings from "./components/admin/AdminSettings.tsx";
import AdminNewsletter from "./components/admin/AdminNewsletter.tsx";
import AdminContact from "./components/admin/AdminContact.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="about" element={<AdminAbout />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="music" element={<AdminMusic />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="merch" element={<AdminMerch />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="messages" element={<AdminContact />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
