import { Link } from "@tanstack/react-router";
import { Bitcoin, Menu, X } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border/40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 z-50"
            onClick={closeMobileMenu}
          >
            <Bitcoin className="h-8 w-8 text-orange-600" />
            <span className="text-2xl font-bold text-foreground">Murga</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium relative group"
            >
              Markets
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/$coinId/details"
              params={{ coinId: "bitcoin" }}
              className="text-foreground/70 hover:text-foreground transition-colors font-medium relative group"
            >
              Trading
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              to="/favorites"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium relative group"
            >
              Favorites
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          <div className="hidden md:flex gap-2 items-center">
            <ModeToggle />
            <UserAvatar />
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-4 pb-4 border-t border-border/40 pt-4">
            <Link
              to="/dashboard"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-lg hover:bg-muted/50 flex items-center justify-between group"
              onClick={closeMobileMenu}
            >
              <span>Markets</span>
              <div className="w-2 h-2 rounded-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/$coinId/details"
              params={{ coinId: "bitcoin" }}
              className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-lg hover:bg-muted/50 flex items-center justify-between group"
              onClick={closeMobileMenu}
            >
              <span>Trading</span>
              <div className="w-2 h-2 rounded-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/favorites"
              className="text-foreground/70 hover:text-foreground transition-colors font-medium py-2 px-4 rounded-lg hover:bg-muted/50 flex items-center justify-between group"
              onClick={closeMobileMenu}
            >
              <span>Favorites</span>
              <div className="w-2 h-2 rounded-full bg-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <div className="border-t border-border/40 pt-4 mt-4">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-muted-foreground">Account</span>
                <UserAvatar />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
