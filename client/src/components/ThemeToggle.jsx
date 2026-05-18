import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative flex h-9 w-[4.25rem] shrink-0 items-center rounded-full border border-slate-300 bg-slate-100 p-0.5 transition-colors dark:border-slate-700 dark:bg-slate-800"
    >
      <span
        className={`absolute left-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-200 dark:bg-slate-600 ${
          isDark ? 'translate-x-[2.125rem]' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <svg className="h-4 w-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.05-2.464a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707zM3 10a1 1 0 01-1-1H1a1 1 0 110 2h1a1 1 0 01-1-1zm12.95 2.464a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </span>
      <span className="flex w-full justify-between px-2 text-[10px] font-medium uppercase tracking-wide">
        <span className={isDark ? 'text-slate-500' : 'text-slate-700'}>Light</span>
        <span className={isDark ? 'text-slate-300' : 'text-slate-400'}>Dark</span>
      </span>
    </button>
  );
}
