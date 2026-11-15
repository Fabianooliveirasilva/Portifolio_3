import {
  siAjv,
  siClaude,
  siExpress,
  siGit,
  siGithub,
  siGithubactions,
  siHtml5,
  siJavascript,
  siJira,
  siJson,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPostman,
  siPython,
  siReact,
  siTypescript,
  siVuedotjs,
  type SimpleIcon,
} from 'simple-icons';
import devicon from '@iconify-json/devicon-plain/icons.json';

export interface TechIcon {
  viewBox: string;
  markup: string;
}

const fromSimple = ({ path }: SimpleIcon): TechIcon => ({
  viewBox: '0 0 24 24',
  markup: `<path fill="currentColor" d="${path}"/>`,
});
const fromDevicon = (name: keyof typeof devicon.icons): TechIcon => ({
  viewBox: '0 0 128 128',
  markup: devicon.icons[name].body,
});

const icons: Record<string, TechIcon> = {
  Ajv: fromSimple(siAjv),
  'C#': fromDevicon('csharp'),
  'Claude API': fromSimple(siClaude),
  CSS3: fromDevicon('css3'),
  Express: fromSimple(siExpress),
  'Express.js': fromSimple(siExpress),
  Git: fromSimple(siGit),
  GitHub: fromSimple(siGithub),
  'GitHub Actions': fromSimple(siGithubactions),
  HTML5: fromSimple(siHtml5),
  Java: fromDevicon('java'),
  JavaScript: fromSimple(siJavascript),
  Jira: fromSimple(siJira),
  JSON: fromSimple(siJson),
  MySQL: fromDevicon('mysql'),
  NestJS: fromSimple(siNestjs),
  'Next.js': fromSimple(siNextdotjs),
  'Node.js': fromSimple(siNodedotjs),
  Playwright: fromDevicon('playwright'),
  'Playwright MCP': fromDevicon('playwright'),
  PostgreSQL: fromSimple(siPostgresql),
  Postman: fromSimple(siPostman),
  Python: fromSimple(siPython),
  React: fromSimple(siReact),
  TypeScript: fromSimple(siTypescript),
  'Vue.js': fromSimple(siVuedotjs),
};

export const techIcon = (name: string): TechIcon | undefined => icons[name];
