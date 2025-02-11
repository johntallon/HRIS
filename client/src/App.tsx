import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "@/pages/dashboard";
import EmployeeManagement from "@/pages/employee-management";
import EmployeeFormPage from "@/pages/employee-form-page";
import OrgChart from "@/pages/org-chart";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import AuthPage from "@/pages/auth-page";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={AuthPage} />
      <Layout>
        <Switch>
          <Route path="/" component={Dashboard} />
        <Route path="/employees" component={EmployeeManagement} />
        <Route path="/employees/:id" component={EmployeeFormPage} />
        <Route path="/org-chart" component={OrgChart} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
        </Switch>
      </Layout>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;