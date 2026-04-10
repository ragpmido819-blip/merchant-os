import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Layout from "@/components/Layout";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Orders from "@/pages/Orders";
import Products from "@/pages/Products";
import Customers from "@/pages/Customers";
import Inbox from "@/pages/Inbox";
import Analytics from "@/pages/Analytics";
import Shipping from "@/pages/Shipping";
import Returns from "@/pages/Returns";
import Team from "@/pages/Team";
import Growth from "@/pages/Growth";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/orders" component={Orders} />
        <Route path="/products" component={Products} />
        <Route path="/customers" component={Customers} />
        <Route path="/inbox" component={Inbox} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/shipping" component={Shipping} />
        <Route path="/returns" component={Returns} />
        <Route path="/team" component={Team} />
        <Route path="/growth" component={Growth} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="mos-ui-theme">
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
