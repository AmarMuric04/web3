import { Link } from "@tanstack/react-router";
import { Bitcoin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-foreground/40 bg-background py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Bitcoin className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-foreground">Murga</span>
            </div>
            <p className="text-foreground/70 mb-4">
              Professional cryptocurrency trading platform with
              institutional-grade security and compliance.
            </p>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-4">Trading</h3>
            <ul className="space-y-2 text-foreground/70">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Spot Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Futures
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Options
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  API Trading
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-4">
              Institutional
            </h3>
            <ul className="space-y-2 text-foreground/70">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Prime Brokerage
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Custody Services
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  OTC Trading
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  White Label
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-foreground/70">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  API Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  System Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-foreground/70">
          <p>
            &copy; {new Date().getFullYear()} CryptoVault. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-foreground transition-colors">
              Risk Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
