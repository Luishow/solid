"use client";

import { useState, useEffect, useMemo } from "react";
import { Person, mockPeople } from "@/data/people";
import { saveToStorage, loadFromStorage } from "@/lib/storage";
import { toast } from "sonner";

const generateId = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).substring(2);
};

export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = loadFromStorage();
    setPeople(stored || mockPeople);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveToStorage(people);
    }
  }, [people, loading]);

  const addPerson = (person: Omit<Person, "id" | "createdAt">) => {
    const newPerson: Person = {
      ...person,
      id: generateId(),
      createdAt: new Date().toISOString(),
      history: [
        {
          id: generateId(),
          date: new Date().toISOString(),
          action: "Cadastro criado",
          user: "Admin"
        }
      ]
    };
    setPeople(prev => [newPerson, ...prev]);
    toast.success("Pessoa cadastrada com sucesso!");
    return newPerson.id;
  };

  const updatePerson = (id: string, updates: Partial<Person>) => {
    setPeople(prev => prev.map(person => 
      person.id === id 
        ? {
            ...person,
            ...updates,
            history: [
              ...(person.history || []),
              {
                id: generateId(),
                date: new Date().toISOString(),
                action: "Dados atualizados",
                user: "Admin"
              }
            ]
          }
        : person
    ));
    toast.success("Dados salvos com sucesso!");
  };

  const deletePerson = (id: string) => {
    setPeople(prev => prev.filter(person => person.id !== id));
    toast.success("Pessoa removida com sucesso!");
  };

  const bulkUpdateStatus = (ids: string[], status: "ativo" | "inativo") => {
    setPeople(prev => prev.map(person => 
      ids.includes(person.id) 
        ? {
            ...person,
            status,
            history: [
              ...(person.history || []),
              {
                id: generateId(),
                date: new Date().toISOString(),
                action: `Status alterado para ${status}`,
                user: "Admin"
              }
            ]
          }
        : person
    ));
    toast.success(`${ids.length} pessoa(s) ${status === "ativo" ? "ativada(s)" : "desativada(s)"} com sucesso!`);
  };

  const bulkDelete = (ids: string[]) => {
    setPeople(prev => prev.filter(person => !ids.includes(person.id)));
    toast.success(`${ids.length} pessoa(s) removida(s) com sucesso!`);
  };

  const duplicatePerson = (id: string) => {
    const person = people.find(p => p.id === id);
    if (person) {
      const duplicate: Person = {
        ...person,
        id: crypto.randomUUID(),
        name: `${person.name} (Cópia)`,
        email: `copia.${person.email}`,
        createdAt: new Date().toISOString(),
        history: [
          {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            action: "Cadastro duplicado",
            user: "Admin"
          }
        ]
      };
      setPeople(prev => [duplicate, ...prev]);
      toast.success("Pessoa duplicada com sucesso!");
      return duplicate.id;
    }
  };

  const stats = useMemo(() => {
    const total = people.length;
    const active = people.filter(p => p.status === "ativo").length;
    const inactive = people.filter(p => p.status === "inativo").length;
    const thisMonth = people.filter(p => {
      const created = new Date(p.createdAt);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    return { total, active, inactive, thisMonth };
  }, [people]);

  return {
    people,
    loading,
    stats,
    addPerson,
    updatePerson,
    deletePerson,
    bulkUpdateStatus,
    bulkDelete,
    duplicatePerson
  };
}