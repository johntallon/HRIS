import React, { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useMsal } from "@/hooks/use-msal"; // Added import for MSAL hook
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import SearchBar from "@/components/search-bar";
import LoginButton from "@/components/LoginButton";
import {
  Users,
  LayoutDashboard,
  NetworkIcon,
  LogOut,
  Settings as SettingsIcon,
  Menu,
} from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { accounts } = useMsal(); // Added to get account information

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-sidebar transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-sidebar-foreground">HRIS</h1>
          )}
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
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              {sidebarOpen && "Dashboard"}
            </Button>
          </Link>
          <Link href="/employees">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              {sidebarOpen && "Employees"}
            </Button>
          </Link>
          <Link href="/org-chart">
            <Button variant="ghost" className="w-full justify-start">
              <NetworkIcon className="h-4 w-4 mr-2" />
              {sidebarOpen && "Org Chart"}
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start">
              <SettingsIcon className="h-4 w-4 mr-2" />
              {sidebarOpen && "Settings"}
            </Button>
          </Link>
        </nav>

        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => logout({ postLogoutRedirectUri: window.location.origin })} // Added postLogoutRedirectUri
          >
            <LogOut className="h-4 w-4 mr-2" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <SearchBar />
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">
                Welcome
                {accounts && accounts[0] && `, ${accounts[0].name}`}{" "}

              </h1>
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}