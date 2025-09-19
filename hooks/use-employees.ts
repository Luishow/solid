"use client";

import { useState, useEffect } from "react";
import { Employee, mockEmployees, getEmployeeStats } from "@/data/employees";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento dos dados
    const loadEmployees = () => {
      setLoading(true);
      
      // Simula uma chamada de API
      setTimeout(() => {
        const savedEmployees = localStorage.getItem("employees");
        if (savedEmployees) {
          setEmployees(JSON.parse(savedEmployees));
        } else {
          setEmployees(mockEmployees);
          localStorage.setItem("employees", JSON.stringify(mockEmployees));
        }
        setLoading(false);
      }, 500);
    };

    loadEmployees();
  }, []);

  const saveEmployees = (newEmployees: Employee[]) => {
    localStorage.setItem("employees", JSON.stringify(newEmployees));
  };

  const addEmployee = (employee: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
    
    return newEmployee;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    const updatedEmployees = employees.map(emp =>
      emp.id === id 
        ? { ...emp, ...updates, updatedAt: new Date().toISOString() }
        : emp
    );
    
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
  };

  const deleteEmployee = (id: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    saveEmployees(updatedEmployees);
  };

  const duplicateEmployee = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      const duplicated = addEmployee({
        ...employee,
        name: `${employee.name} (Cópia)`,
        email: `copia.${employee.email}`,
        employeeId: `${employee.employeeId}_COPY`,
      });
      return duplicated;
    }
  };

  const deactivateEmployee = (id: string) => {
    updateEmployee(id, { status: "inativo" });
  };

  const activateEmployee = (id: string) => {
    updateEmployee(id, { status: "ativo" });
  };

  const setEmployeeOnLeave = (id: string, type: "licenca" | "ferias") => {
    updateEmployee(id, { status: type });
  };

  const updatePerformanceRating = (id: string, rating: number, notes?: string) => {
    updateEmployee(id, { 
      performanceRating: rating, 
      lastReview: new Date().toISOString(),
      notes: notes || undefined
    });
  };

  const stats = getEmployeeStats(employees);

  return {
    employees,
    loading,
    stats,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    duplicateEmployee,
    deactivateEmployee,
    activateEmployee,
    setEmployeeOnLeave,
    updatePerformanceRating
  };
}


