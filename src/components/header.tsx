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
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function Header() {
  const { logout, user } = useAuth();
  
  // Get user's personal stats
  const { data: identity } = useQuery({
    queryKey: ['identity'],
    queryFn: api.identity.getIdentityGraph,
    enabled: !!user,
  });
  
  const traits = Array.isArray(identity?.traits) ? identity.traits : [];
  const evidenceCount = identity?.evidenceCount || 0;

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
          {/* Logo & Global Stats */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <img
                src="/logo.png"
                alt="Idynic"
                className="h-8 w-auto"
              />
            </Link>
            
            {/* Global Stats - Clean & Minimal */}
            <div className="hidden lg:flex items-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#137dc5] rounded-full"></div>
                <span className="font-medium text-[#137dc5]">2.47M</span>
                <span>traits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium text-purple-600">18.2k</span>
                <span>opportunities</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/identity" className="group px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600 hover:shadow-sm">
              <span className="transition-transform duration-300 inline-block">Identity Graph</span>
            </Link>
            <Link href="/tools" className="group px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-600 hover:shadow-sm">
              <span className="transition-transform duration-300 inline-block">Tools</span>
            </Link>
            <Link href="/opportunities" className="group px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 hover:shadow-sm">
              <span className="transition-transform duration-300 inline-block">Opportunities</span>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-[#137dc5] hover:shadow-sm">
                <span className="transition-transform duration-300">Visualizations</span>
                <ChevronDown className="h-3 w-3 ml-1 group-hover:rotate-180 transition-transform duration-300" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-xl border-0 rounded-xl p-2">
                <DropdownMenuItem asChild>
                  <Link href="/visualizations/skill-gaps" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-orange-50 hover:text-orange-600 transition-all duration-200">
                    Skill Gaps
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/visualizations/clusters" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-green-50 hover:text-green-600 transition-all duration-200">
                    Clusters
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/visualizations/proficiency" className="flex items-center px-3 py-2 rounded-lg text-sm hover:bg-purple-50 hover:text-purple-600 transition-all duration-200">
                    Proficiency
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserDisplayName(user)}</p>
                  <p className="text-xs leading-none text-muted-foreground">{getUserEmail(user)}</p>
                </div>
              </DropdownMenuLabel>
              
              {/* Personal Stats */}
              <div className="px-2 py-3 border-y border-gray-100 my-1">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-[#137dc5]">{traits?.length || 0}</div>
                    <div className="text-xs text-gray-600">your traits</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-600">{evidenceCount || 0}</div>
                    <div className="text-xs text-gray-600">your evidence</div>
                  </div>
                </div>
              </div>
              
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