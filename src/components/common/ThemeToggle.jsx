import { useTheme } from '../../hooks/useTheme';
import { cx } from '../../utils/helpers';

export default function ThemeToggle({ floating = false }) {
  const { theme, toggleTheme } = useTheme();
  return <ThemeToggleInner floating={floating} theme={theme} toggleTheme={toggleTheme} />;
}

export { ThemeToggle };

function ThemeToggleInner({ floating, theme, toggleTheme }) {

  if (!floating) {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 text-on-surface-variant hover:text-primary rounded-full transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className="material-symbols-outlined">
          {theme === 'light' ? 'dark_mode' : 'light_mode'}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cx(
        'fixed bottom-6 left-6 z-[60] w-12 h-12 rounded-full bg-primary text-on-primary shadow-elevation2 flex items-center justify-center hover:scale-105 active:scale-95 transition-all'
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="material-symbols-outlined">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
}