import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEnglishHome from '../utils/translations/English/englishHome.json';
import translationEnglishForm from '../utils/translations/English/englishForm.json';
import translationEnglishTravel from '../utils/translations/English/englishTravel.json';
import translationEnglishHeader from '../utils/translations/English/englishHeader.json';
import translationEnglishSocket from '../utils/translations/English/englishSocket.json';

import translationHungarianHome from '../utils/translations/Hungarian/hungarianHome.json';
import translationHungarianForm from '../utils/translations/Hungarian/hungarianForm.json';
import translationHungarianTravel from '../utils/translations/Hungarian/hungarianTravel.json';
import translationHungarianHeader from '../utils/translations/Hungarian/hungarianHeader.json';
import translationHungarianSocket from '../utils/translations/Hungarian/hungarianSocket.json';

const resources = {
  en: {
    home: translationEnglishHome,
    form: translationEnglishForm,
    travel: translationEnglishTravel,
    header: translationEnglishHeader,
    socket: translationEnglishSocket,
  },
  hu: {
    home: translationHungarianHome,
    form: translationHungarianForm,
    travel: translationHungarianTravel,
    header: translationHungarianHeader,
    socket: translationHungarianSocket,
  },
};

const language = window.localStorage.getItem('TRAVEL_APP_LANGUAGE') as string;

i18next.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: 'en',
});

export default i18next;
