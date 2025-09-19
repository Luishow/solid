import { Person } from "@/data/people";

const STORAGE_KEY = "people-ui";

export function saveToStorage(people: Person[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
}

export function loadFromStorage(): Person[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error);
    return null;
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Erro ao limpar localStorage:", error);
  }
}