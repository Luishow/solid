"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Plus,
  User
} from "lucide-react";
import { usePeople } from "@/hooks/use-people";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const { people } = usePeople();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.role?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSelect = (callback: () => void) => {
    callback();
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Digite um comando ou busque..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        
        <CommandGroup heading="Páginas">
          <CommandItem onSelect={() => handleSelect(() => router.push("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => router.push("/people"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Lista de Pessoas</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => router.push("/people/new"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Nova Pessoa</span>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </CommandItem>
        </CommandGroup>

        {searchQuery && filteredPeople.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Pessoas">
              {filteredPeople.map((person) => (
                <CommandItem
                  key={person.id}
                  onSelect={() => handleSelect(() => router.push(`/people/${person.id}`))}
                >
                  <User className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{person.name}</span>
                    <span className="text-xs text-muted-foreground">{person.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}