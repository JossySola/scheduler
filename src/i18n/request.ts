import {getRequestConfig} from 'next-intl/server';
import { cookies, headers } from 'next/headers';
 
export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value;
  const acceptLanguage = (await headers()).get('accept-language');
  const lang = acceptLanguage?.split(/[,;]/)[0] || 'en'; 

  if (locale && (locale === "en" || locale === "es")) {
    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default
    }
  } else if (lang && (lang === "en" || lang === "es")) {
    return {
      locale: lang,
      messages: (await import(`../../messages/${lang}.json`)).default
    }
  } else {
    return {
      locale: lang,
      messages: (await import(`../../messages/en.json`)).default
    }
  }
});