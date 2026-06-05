export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light');

  const applyTheme = () => {
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', theme.value === 'dark');
      localStorage.setItem('theme', theme.value);
    }
  };

  const loadTheme = () => {
    if (!import.meta.client) {
      return;
    }

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      theme.value = savedTheme;
    }

    applyTheme();
  };

  const setTheme = (value: 'light' | 'dark') => {
    theme.value = value;
    applyTheme();
  };

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    loadTheme,
    setTheme,
    toggleTheme,
  };
};