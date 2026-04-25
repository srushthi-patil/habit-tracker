import { useEffect, useState } from "react";

const KEY = "ht.theme.v1";
type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem(KEY)) as Theme | null;
    return saved ?? "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}
