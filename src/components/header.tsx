'use client';

import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { logout, user } = useAuth();

  const getUserInitials = (user: { username?: string; attributes?: Record<string, string> }) => {
    const email = user?.attributes?.email || user?.username;
    if (!email) return 'U';
    
    const name = user?.attributes?.given_name && user?.attributes?.family_name 
      ? `${user.attributes.given_name} ${user.attributes.family_name}`
      : email;
    
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = (user: { username?: string; attributes?: Record<string, string> }) => {
    if (user?.attributes?.given_name && user?.attributes?.family_name) {
      return `${user.attributes.given_name} ${user.attributes.family_name}`;
    }
    return user?.attributes?.email || user?.username || 'User';
  };

  const getUserEmail = (user: { username?: string; attributes?: Record<string, string> }) => {
    return user?.attributes?.email || user?.username || '';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Idynic</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/identity" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Identity Graph
            </Link>
            <Link href="/tools" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Tools
            </Link>
            <Link href="/opportunities" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
              Opportunities
            </Link>
          </nav>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.attributes?.picture} alt={getUserDisplayName(user)} />
                <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                  {getUserInitials(user)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserDisplayName(user)}</p>
                  <p className="text-xs leading-none text-muted-foreground">{getUserEmail(user)}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/evidence">Evidence Records</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/api-keys">API Keys</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-600 focus:text-red-600"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}