import { Search, X } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export function SearchInput({ value, onClear, ...props }: SearchInputProps) {
  return (
    <div className="search-input">
      <Search size={18} aria-hidden="true" />
      <input type="search" value={value} {...props} />
      {value && onClear ? (
        <button type="button" onClick={onClear} aria-label="Clear search">
          <X size={17} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
