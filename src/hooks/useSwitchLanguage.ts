import clientTranslationInstance from '@/lib/i18n';

const useSwitchLanguage = (langeId: string) => {
//   return (languageId) => clientTranslationInstance.changeLanguage(languageId);
    clientTranslationInstance.changeLanguage(langeId);
};

export default useSwitchLanguage;