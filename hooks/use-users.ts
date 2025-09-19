"use client";

import { useEffect, useState } from "react";
import { AppUser, mockUsers } from "@/data/users";

export function useUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      setLoading(true);
      setTimeout(() => {
        const saved = localStorage.getItem("app_users");
        if (saved) setUsers(JSON.parse(saved));
        else {
          setUsers(mockUsers);
          localStorage.setItem("app_users", JSON.stringify(mockUsers));
        }
        setLoading(false);
      }, 200);
    };
    load();
  }, []);

  const persist = (list: AppUser[]) => {
    localStorage.setItem("app_users", JSON.stringify(list));
  };

  const addUser = (user: Omit<AppUser, "id" | "createdAt" | "updatedAt">) => {
    const newUser: AppUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newUser, ...users];
    setUsers(updated);
    persist(updated);
    return newUser;
  };

  const deleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    persist(updated);
  };

  return { users, loading, addUser, deleteUser };
}


