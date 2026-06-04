import {type FieldErrorProps, FieldError as RACFieldError} from 'react-aria-components/FieldError';
import {Group, type GroupProps} from 'react-aria-components/Group';
import {type InputProps, Input as RACInput} from 'react-aria-components/Input';
import {type LabelProps, Label as RACLabel} from 'react-aria-components/Label';
import {Text, type TextProps} from 'react-aria-components/Text';

export function Label(props: LabelProps) {
  return (
    <RACLabel {...props} />
  );
}

export function Description(props: TextProps) {
  return (
    <Text {...props} slot="description" />
  );
}

export function FieldError(props: FieldErrorProps) {
  return (
    <RACFieldError {...props} />
  );
}


export function FieldGroup(props: GroupProps) {
  return (
    <Group {...props} />
  );
}

export function Input(props: InputProps) {
  return (
    <RACInput {...props} />
  );
}
