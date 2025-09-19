export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "administrativo" | "manager" | "jogador" | "staff";
  game?: string;
  createdAt: string;
  updatedAt: string;
}

export const mockUsers: AppUser[] = [
  {
    id: "u1",
    name: "Administrador",
    email: "admin@empresa.com",
    role: "administrativo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "u2",
    name: "Gerente de Operações",
    email: "manager@empresa.com",
    role: "manager",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const games = [
  "League of Legends",
  "Valorant",
  "CS:GO",
  "FIFA",
  "Fortnite",
  "Dota 2",
  "Free Fire",
];


