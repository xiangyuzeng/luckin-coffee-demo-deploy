'use client';

import { useTranslation } from '@/lib/i18n/LanguageContext';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 border-t border-gray-200">
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <a
            href="#"
            className="text-gray-500 transition-colors hover:text-[#1A3C8B]"
          >
            {t('footer.about')}
          </a>
          <a
            href="#"
            className="text-gray-500 transition-colors hover:text-[#1A3C8B]"
          >
            {t('footer.terms')}
          </a>
          <a
            href="#"
            className="text-gray-500 transition-colors hover:text-[#1A3C8B]"
          >
            {t('footer.privacy')}
          </a>
          <a
            href="#"
            className="text-gray-500 transition-colors hover:text-[#1A3C8B]"
          >
            {t('footer.support')}
          </a>
        </div>
        <p className="text-sm text-gray-400">
          &copy; {t('footer.copyright')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
