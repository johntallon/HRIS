import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SearchBar from "@/components/search-bar";
import {
  Users,
  LayoutDashboard,
  NetworkIcon,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-sidebar transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen && <h1 className="text-xl font-bold text-sidebar-foreground">HRIS</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              {sidebarOpen && "Dashboard"}
            </Button>
          </Link>
          <Link href="/employees">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2" />
              {sidebarOpen && "Employees"}
            </Button>
          </Link>
          <Link href="/org-chart">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <NetworkIcon className="h-4 w-4 mr-2" />
              {sidebarOpen && "Org Chart"}
            </Button>
          </Link>
        </nav>

        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <SearchBar />
            <h1 className="text-xl font-semibold">Welcome{user?.username ? `, ${user.username}` : ''}</h1>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}