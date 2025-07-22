// components/SelectMulti.tsx
import React from 'react';
import ReactSelect, { Props as SelectProps } from 'react-select';
import { cn } from '@/lib/utils'; 

type Option = {
  label: string;
  value: string;
};

interface SelectMultiProps extends SelectProps<Option, true> {
  label?: string;
  inputId?: string;
  hasError?: boolean;
}

const SelectMulti: React.FC<SelectMultiProps> = ({
  label,
  inputId = 'react-select-multi',
  hasError = false,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium',
            hasError ? 'text-destructive' : 'text-foreground'
          )}
        >
          {label}
        </label>
      )}
      <ReactSelect
        inputId={inputId}
        className="w-full"
        classNamePrefix="react-select"
        isMulti
        {...props}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--input))',
            borderRadius: 'var(--radius)',
            minHeight: '2.5rem',
            '&:hover': {
              borderColor: 'hsl(var(--input))',
            },
            boxShadow: 'none',
          }),
          input: (base) => ({
            ...base,
            color: 'hsl(var(--foreground))',
            margin: 0,
            padding: 0,
          }),
          valueContainer: (base) => ({
            ...base,
            padding: '0.5rem 0.75rem',
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: 'hsl(var(--secondary))',
            borderRadius: 'var(--radius)',
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: 'hsl(var(--secondary-foreground))',
            padding: '0.25rem 0.5rem',
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'hsl(var(--secondary-foreground))',
            ':hover': {
              backgroundColor: 'hsl(var(--secondary-hover))',
              color: 'hsl(var(--secondary-foreground))',
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'hsl(var(--accent))' : 'transparent',
            color: state.isFocused
              ? 'hsl(var(--accent-foreground))'
              : 'hsl(var(--foreground))',
            ':active': {
              backgroundColor: 'hsl(var(--accent))',
              color: 'hsl(var(--accent-foreground))',
            },
          }),
          placeholder: (base) => ({
            ...base,
            color: 'hsl(var(--muted-foreground))',
          }),
        }}
      />
    </div>
  );
};

export default SelectMulti;
