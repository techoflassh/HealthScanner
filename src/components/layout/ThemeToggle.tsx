"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      ) : (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
