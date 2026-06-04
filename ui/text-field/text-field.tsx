
import {
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult
} from 'react-aria-components/TextField';
import {Description, FieldError, Input, Label } from '../field/field';

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function TextField({label, description, errorMessage, ...props}: TextFieldProps) {
  return (
    <AriaTextField {...props}>
      {label && <Label>{label}</Label>}
      <Input />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
