"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Command,
  User,
  Settings,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CommandPalette } from "@/components/shared/command-palette";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function Header({ onSearch, searchPlaceholder = "Buscar..." }: HeaderProps) {
  const { setTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Handle Cmd+K shortcut
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandOpen(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="flex items-center justify-between h-full px-6">
          {/* Search */}
          <div className="flex items-center flex-1 max-w-lg">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-16 w-full"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setCommandOpen(true)}
              className="ml-2 p-2"
            >
              <Command className="w-4 h-4 text-yellow-400" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* New Person Button */}
            <Link href="/people/new">
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4 text-yellow-400" />
                Nova Pessoa
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2"
            >
              <Sun className="h-4 w-4 text-yellow-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 text-yellow-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      A
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@company.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4 text-yellow-400" />
                  Perfil
                </DropdownMenuItem>
                <Link href="/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4 text-yellow-400" />
                    Configurações
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Link href="/auth/sign-in">
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4 text-yellow-400" />
                    Sair
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </>
  );
}