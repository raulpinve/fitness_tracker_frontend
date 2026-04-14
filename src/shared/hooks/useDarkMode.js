import { useState, useEffect } from "react";

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    // 1. Prioridad: LocalStorage
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // 2. Fallback: Sistema
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // LA CLAVE: Forzamos la clase en el HTML
    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light"); // Limpieza extra
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light"); // Ayuda a debugear
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return { isDark, toggleDarkMode };
}
