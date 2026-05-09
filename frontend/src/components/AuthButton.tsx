'use client';

interface AuthButtonProps {
  text: string;
  pending?: boolean;
}

export default function AuthButton({ text, pending = false }: AuthButtonProps) {
  return (
    <button
      className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold tracking-widest uppercase text-xs shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      type="submit"
      disabled={pending}
    >
      {pending && (
        <svg
          className="animate-spin h-4 w-4 text-on-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {pending ? '処理中...' : text}
    </button>
  );
}
