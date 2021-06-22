import i18n               from 'i18next';
import {initReactI18next} from 'react-i18next';
import enTranslation      from './translation_en.json';
import jaTranslation      from './translation_jp.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    lng: 'ja',
    fallbackLng: 'ja',
    debug: true,

    interpolation: {
      escapeValue: false,
    },

    react: {
      wait: true,
    },
    resources: resources,
  });

export default i18n;
