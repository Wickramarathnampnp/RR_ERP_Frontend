import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

interface FieldShellProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FieldShellProps) {
  const helpId = `${htmlFor}-help`;
  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {error ? (
        <p className="field__message field__message--error" id={helpId} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field__message" id={helpId}>{hint}</p>
      ) : null}
    </div>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField({ label, id, error, hint, required, className = '', ...props }, ref) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    return (
      <FieldShell
        label={label}
        htmlFor={inputId}
        error={error}
        hint={hint}
        required={required}
      >
        <input
          id={inputId}
          ref={ref}
          className={`input ${className}`.trim()}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${inputId}-help` : undefined}
          required={required}
          {...props}
        />
      </FieldShell>
    );
  },
);

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    { label, id, error, hint, required, placeholder = 'Select an option', children, ...props },
    ref,
  ) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (
      <FieldShell
        label={label}
        htmlFor={selectId}
        error={error}
        hint={hint}
        required={required}
      >
        <select
          id={selectId}
          ref={ref}
          className="input"
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${selectId}-help` : undefined}
          required={required}
          {...props}
        >
          <option value="">{placeholder}</option>
          {children}
        </select>
      </FieldShell>
    );
  },
);

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField({ label, id, error, hint, required, ...props }, ref) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    return (
      <FieldShell
        label={label}
        htmlFor={textareaId}
        error={error}
        hint={hint}
        required={required}
      >
        <textarea
          id={textareaId}
          ref={ref}
          className="input input--textarea"
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${textareaId}-help` : undefined}
          required={required}
          {...props}
        />
      </FieldShell>
    );
  },
);
