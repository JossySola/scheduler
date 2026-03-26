"use client";
import {I18nProvider} from 'react-aria-components';
import {NextIntlClientProvider} from 'next-intl';

export function ClientProviders( {lang, children } : { 
  lang: string, 
  children: React.ReactNode }) {
  return (
    <I18nProvider locale={lang}>
      <NextIntlClientProvider>
        {children}
      </NextIntlClientProvider>
    </I18nProvider>
  );
}