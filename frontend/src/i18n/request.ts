import { getRequestConfig } from 'next-intl/server';
import { getMergedMessages } from '@/lib/i18n';

export default getRequestConfig(async () => {
  const locale = 'en';
  return {
    locale,
    messages: getMergedMessages(locale),
  };
});
