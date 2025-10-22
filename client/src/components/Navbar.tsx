import { useAuth } from "@/_core/hooks/useAuth";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { FileText, LogOut, Menu, Plus, Sparkles, User, X, Palette } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Determine current page context
  const isHome = location === "/";
  const isDashboard = location === "/dashboard";
  const isCreating = location.includes("/create") || location.includes("/edit");
  const isViewing = location.match(/^\/proposal\/\d+$/);
  const isTemplates = location.includes("/templates");

  // Don't show navbar on public proposal view (client-facing)
  if (isViewing && !location.includes("/edit") && !location.includes("/analytics")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FileText className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">{APP_TITLE}</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {/* Dashboard Link */}
                {!isDashboard && !isCreating && (
                  <Link href="/dashboard">
                    <a className="text-sm font-medium hover:text-primary transition-colors">
                      Dashboard
                    </a>
                  </Link>
                )}

                {/* Templates Link */}
                {!isTemplates && !isCreating && (
                  <Link href="/templates">
                    <a className="text-sm font-medium hover:text-primary transition-colors">
                      Templates
                    </a>
                  </Link>
                )}

                {/* Create Proposal Dropdown */}
                {!isCreating && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" size="sm" className="gap-2">
                        <Plus className="w-4 h-4" />
                        Create Proposal
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href="/create-ai">
                          <a className="flex items-center gap-2 w-full cursor-pointer">
                            <Sparkles className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Generate with AI</div>
                              <div className="text-xs text-muted-foreground">
                                AI-powered proposal
                              </div>
                            </div>
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/templates">
                          <a className="flex items-center gap-2 w-full cursor-pointer">
                            <FileText className="w-4 h-4" />
                            <div>
                              <div className="font-medium">Use Template</div>
                              <div className="text-xs text-muted-foreground">
                                Start from industry template
                              </div>
                            </div>
                          </a>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden lg:inline">{user?.name || "Account"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/dashboard">
                        <a className="cursor-pointer w-full">Dashboard</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Link href="/settings/branding">
                        <a className="cursor-pointer w-full flex items-center">
                          <Palette className="w-4 h-4 mr-2" />
                          Brand Settings
                        </a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild variant="default" size="sm">
                <a href={getLoginUrl()}>Login</a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <a
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                </Link>
                <Link href="/templates">
                  <a
                    className="block px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Templates
                  </a>
                </Link>
                <div className="px-4 py-2 space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase">
                    Create Proposal
                  </div>
                  <Link href="/create-ai">
                    <a
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </a>
                  </Link>
                  <Link href="/templates">
                    <a
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4" />
                      Use Template
                    </a>
                  </Link>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="px-4 py-2 text-sm">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-accent rounded-md flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4">
                <Button asChild variant="default" size="sm" className="w-full">
                  <a href={getLoginUrl()}>Login</a>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

