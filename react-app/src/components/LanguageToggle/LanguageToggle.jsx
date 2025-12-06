import { useLanguage } from '../../context/LanguageContext';

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <div className="lang-toggle">
      <button
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => lang !== 'en' && toggleLang()}
      >
        EN
      </button>
      <button
        className={`lang-btn ${lang === 'ar' ? 'active' : ''}`}
        onClick={() => lang !== 'ar' && toggleLang()}
      >
        عربي
      </button>
    </div>
  );
}
