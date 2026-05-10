'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface AuthInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon?: string;
  error?: string[];
  defaultValue?: string;
  readOnly?: boolean;
  rightLabel?: { text: string; href: string };
}

export default function AuthInput({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  icon,
  error,
  defaultValue,
  readOnly = false,
  rightLabel,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="group relative">
      <div className="flex justify-between items-end mb-1.5 px-1">
        <label
          htmlFor={id}
          className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant"
        >
          {label}
        </label>
        {rightLabel && (
          <a
            className="text-[10px] font-bold tracking-wide text-[#8a6b32] hover:text-[#3d2e28] transition-colors"
            href={rightLabel.href}
          >
            {rightLabel.text}
          </a>
        )}
      </div>
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#827471] text-[20px] transition-colors group-focus-within:text-[#3d2e28]">
            {icon}
          </span>
        )}
        <input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          defaultValue={defaultValue}
          readOnly={readOnly}
          className={`w-full bg-[#f8f6f4] border-none rounded-xl py-4 ${
            icon ? 'pl-12' : 'pl-4'
          } ${
            isPassword ? 'pr-12' : 'pr-4'
          } text-[15px] font-medium text-[#3d2e28] focus:ring-2 focus:ring-[#3d2e28]/10 transition-all placeholder:text-[#a0938f] ${
            readOnly ? 'opacity-60 cursor-not-allowed' : ''
          } ${error && error.length > 0 ? 'ring-2 ring-error/30' : ''}`}
        />
        {isPassword && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#827471] hover:text-[#3d2e28] transition-colors"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span className="material-symbols-outlined">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        )}
      </div>
      {error && error.length > 0 && (
        <p className="mt-1.5 ml-1 text-xs text-error font-medium">
          {(t as any)[error[0]] || error[0]}
        </p>
      )}
    </div>
  );
}
