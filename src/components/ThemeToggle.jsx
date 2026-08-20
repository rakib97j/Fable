"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@heroui/react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="  flex items-center justify-center text-zinc-400 animate-pulse">
        <Moon className="w-4 h-4" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="light"
      isIconOnly
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative     text-zinc-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400  transition-all duration-200 focus:outline-none "
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-700 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </Button>
  );
}
