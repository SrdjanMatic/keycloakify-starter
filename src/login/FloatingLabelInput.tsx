import { useState, type ReactNode, type InputHTMLAttributes } from "react";

interface FloatingLabelInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value"> {
  label: string;
  value: string;
  error?: boolean;
  rightElement?: ReactNode;
}

export default function FloatingLabelInput({
  label,
  value,
  onFocus,
  onBlur,
  disabled,
  className,
  error,
  rightElement,
  ...rest
}: FloatingLabelInputProps) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  const classes = [
    "floating-input",
    isFloating && "floating-input--active",
    focused && "floating-input--focused",
    disabled && "floating-input--disabled",
    error && "floating-input--error",
    rightElement && "floating-input--has-right",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <label className="floating-input__label">{label}</label>
      <input
        value={value}
        disabled={disabled}
        className="floating-input__field"
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {rightElement}
    </div>
  );
}
