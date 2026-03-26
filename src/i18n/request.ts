import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';
 
export default getRequestConfig(async () => {
  const store = await cookies();
  const locale = store.get('locale')?.value;

  if (locale && locale === "en" || locale === "es") {
    return {
      locale,
      messages: (await import(`../../messages/${locale}.json`)).default
    }
  } else {
    return {
      locale: "en",
      messages: (await import(`../../messages/${locale}.json`)).default
    }
  }
});