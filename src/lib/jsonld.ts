import type { Lang } from '../i18n/ui';

const knowsLanguage: Record<Lang, string[]> = {
  'pt-br': ['pt', 'en', 'es'],
  es: ['pt', 'en', 'es'],
  en: ['pt', 'en', 'es'],
};

export function personJsonLd(lang: Lang, siteUrl: string, description: string) {
  const jobTitle = {
    'pt-br': 'Engenheiro de QA',
    es: 'Ingeniero de QA',
    en: 'QA engineer',
  }[lang];
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Fabiano Oliveira Silva',
    jobTitle,
    description,
    url: siteUrl,
    sameAs: [
      'https://www.linkedin.com/in/fabiano-silva-oliveira/',
      'https://github.com/Fabianooliveirasilva',
    ],
    knowsLanguage: knowsLanguage[lang],
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Universidade Cruzeiro do Sul (UNICSUL)',
      },
      { '@type': 'CollegeOrUniversity', name: 'UNIFATEC' },
    ],
  });
}
