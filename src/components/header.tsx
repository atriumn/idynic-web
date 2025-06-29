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
import { Settings, Key, LogOut, ChevronDown, FileText, Brain, Briefcase } from 'lucide-react';
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
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div>
            <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-bold text-gray-900">Idynic Dashboard</h1>
              <p className="text-gray-600">Track your strategic identity and opportunities</p>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-4">
              <Link 
                href="/opportunities" 
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Briefcase className="h-4 w-4" />
                <span className="font-medium">Opportunities</span>
              </Link>
              <Link 
                href="/identity" 
                className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Brain className="h-4 w-4" />
                <span className="font-medium">Identity</span>
              </Link>
            </nav>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.attributes?.picture} alt={getUserDisplayName(user)} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {getUserDisplayName(user)}
                  </div>
                </div>
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
                  <Link href="/opportunities" className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Job Tracker</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/identity" className="flex items-center">
                    <Brain className="mr-2 h-4 w-4" />
                    <span>Identity Graph</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/evidence" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Evidence Records</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/api-keys" className="flex items-center">
                    <Key className="mr-2 h-4 w-4" />
                    <span>API Keys</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  variant="destructive"
                  className="flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}