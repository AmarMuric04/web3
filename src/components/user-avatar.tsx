"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  MapPin,
  Phone,
  Calendar,
  Wallet,
  Copy,
  ExternalLink,
  Shield,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useGetSingleUserQuery } from "@/services/user";

export function UserAvatar() {
  const { data: userData, isLoading, error } = useGetSingleUserQuery();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress] = useState(
    "0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C"
  );

  const user = userData?.results[0];

  const handleConnectWallet = () => {
    // Simulate wallet connection
    setIsWalletConnected(!isWalletConnected);
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  if (isLoading) {
    return <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />;
  }

  if (error || !user) {
    return (
      <Avatar className="h-10 w-10">
        <AvatarFallback>?</AvatarFallback>
      </Avatar>
    );
  }

  const fullName = `${user.name.first} ${user.name.last}`;
  const initials = `${user.name.first[0]}${user.name.last[0]}`.toUpperCase();
  const location = `${user.location.city}, ${user.location.country}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={user.picture.large || "/placeholder.svg"}
              alt={fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isWalletConnected && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-0" align="end" forceMount>
        {/* User Profile Header */}
        <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-b">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage
                src={user.picture.large || "/placeholder.svg"}
                alt={fullName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{fullName}</h3>
                <Badge variant="secondary" className="text-xs">
                  {user.nat}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                @{user.login.username}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{user.dob.age}y</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Wallet</span>
            </div>
            <Badge
              variant={isWalletConnected ? "default" : "secondary"}
              className="text-xs"
            >
              {isWalletConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {isWalletConnected ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-background rounded-md border">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-mono truncate">{walletAddress}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyWalletAddress}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                >
                  <CreditCard className="h-3 w-3 mr-1" />
                  Portfolio
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleConnectWallet}
                  className="h-8 text-xs"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleConnectWallet}
              className="w-full h-9 text-sm"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Contact Info */}
        <div className="p-4 border-b">
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-0">
            Contact Information
          </DropdownMenuLabel>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{user.email}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate">{user.phone}</p>
                <p className="text-xs text-muted-foreground">Phone</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-3 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Shield className="mr-3 h-4 w-4" />
            <span>Privacy & Security</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <ExternalLink className="mr-3 h-4 w-4" />
            <span>Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
            <LogOut className="mr-3 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
