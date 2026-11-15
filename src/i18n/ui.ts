export const languages = { 'pt-br': 'PT', es: 'ES', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pt-br';
export const langs = Object.keys(languages) as Lang[];

export const htmlLang: Record<Lang, string> = {
  'pt-br': 'pt-BR',
  es: 'es',
  en: 'en',
};
export const ogLocale: Record<Lang, string> = {
  'pt-br': 'pt_BR',
  es: 'es_ES',
  en: 'en_US',
};

export const ui = {
  'pt-br': {
    skip: 'Pular para o conteúdo',
    language: 'Idioma',
    sections: 'Seções',
    nav: {
      education: 'Formação',
      skills: 'Habilidades',
      work: 'Trabalho',
      qa: 'O que faço',
      path: 'Trajetória',
      contact: 'Contato',
    },
    siteTitle: 'Fabiano Oliveira Silva, engenheiro de QA',
    notFoundTitle: 'Página não encontrada',
    notFoundText: 'O endereço não existe ou mudou.',
    notFoundLink: 'Voltar ao início',
    pause: 'Pausar vídeo',
    play: 'Reproduzir vídeo',
    video: 'Vídeo',
    whatsapp: {
      label: 'Falar no WhatsApp',
      message: 'Olá, Fabiano! Vi seu portfólio e gostaria de conversar.',
    },
  },
  es: {
    skip: 'Saltar al contenido',
    language: 'Idioma',
    sections: 'Secciones',
    nav: {
      education: 'Formación',
      skills: 'Habilidades',
      work: 'Trabajo',
      qa: 'Qué hago',
      path: 'Trayectoria',
      contact: 'Contacto',
    },
    siteTitle: 'Fabiano Oliveira Silva, ingeniero de QA',
    notFoundTitle: 'Página no encontrada',
    notFoundText: 'La dirección no existe o ha cambiado.',
    notFoundLink: 'Volver al inicio',
    pause: 'Pausar vídeo',
    play: 'Reproducir vídeo',
    video: 'Vídeo',
    whatsapp: {
      label: 'Hablar por WhatsApp',
      message: '¡Hola, Fabiano! He visto tu portafolio y me gustaría hablar.',
    },
  },
  en: {
    skip: 'Skip to content',
    language: 'Language',
    sections: 'Sections',
    nav: {
      education: 'Education',
      skills: 'Skills',
      work: 'Work',
      qa: 'What I do',
      path: 'Background',
      contact: 'Contact',
    },
    siteTitle: 'Fabiano Oliveira Silva, QA engineer',
    notFoundTitle: 'Page not found',
    notFoundText: 'The address does not exist or has moved.',
    notFoundLink: 'Back to home',
    pause: 'Pause video',
    play: 'Play video',
    video: 'Video',
    whatsapp: {
      label: 'Chat on WhatsApp',
      message: 'Hi Fabiano! I saw your portfolio and would like to talk.',
    },
  },
} satisfies Record<Lang, Record<string, string | Record<string, string>>>;

export const path = (lang: Lang) => (lang === defaultLang ? '/' : `/${lang}/`);
