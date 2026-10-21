export function useTheme() {
  const isDark = useState<boolean>("bovisoft_theme_dark", () => false);

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem("bovisoft_theme");
      if (savedTheme) {
        isDark.value = savedTheme === "dark";
      } else {
        isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      applyTheme();
    }
  };

  const applyTheme = () => {
    if (import.meta.client) {
      const themeName = isDark.value ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", themeName);
      localStorage.setItem("bovisoft_theme", themeName);
    }
  };

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
  };

  return {
    isDark: readonly(isDark),
    toggleTheme,
    initTheme,
  };
}
