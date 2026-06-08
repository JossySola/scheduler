'use client'
import {type DialogProps, Dialog as RACDialog, Heading} from 'react-aria-components/Dialog';

export function Dialog(props: DialogProps) {
  return (
    <RACDialog {...props} />
  );
}

export {Heading};
