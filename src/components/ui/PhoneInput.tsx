import React from 'react';
import styles from './PhoneInput.module.css';

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

export default function PhoneInput({
  value,
  onChange,
  error,
  label,
  className,
  ...props
}: PhoneInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    
    // Prevent starting with 0 if possible, standard Saudi numbers are 9 digits (e.g. 5xxxxxxxx)
    if (val.startsWith('0')) {
      val = val.substring(1);
    }
    
    // Max length for Saudi phone without 0 is 9 digits
    if (val.length <= 9) {
      onChange(val);
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputContainer} ${error ? styles.hasError : ''} ${props.disabled ? styles.disabled : ''}`} dir="ltr">
        <div className={styles.prefix}>+966</div>
        <div className={styles.divider} />
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          onChange={handleChange}
          className={styles.input}
          placeholder="5xxxxxxxx"
          {...props}
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
