import {
  siC,
  siDocker,
  siExpress,
  siFastapi,
  siFlask,
  siGit,
  siGooglebigquery,
  siGooglecloud,
  siJavascript,
  siLangchain,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpencv,
  siOpenjdk,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siScikitlearn,
  siSqlite,
  siStreamlit,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siUltralytics,
  siVercel,
  siVite,
  type SimpleIcon,
} from "simple-icons";

/**
 * Skill name (as written in content.ts) to its Simple Icons logo.
 * Names without an official logo in Simple Icons (XGBoost, SHAP, SQL, Oracle, AWS, REST APIs)
 * are left out on purpose; they render as a mono initials badge instead.
 */
export const techIcons: Record<string, SimpleIcon> = {
  Python: siPython,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  Java: siOpenjdk,
  C: siC,
  PyTorch: siPytorch,
  TensorFlow: siTensorflow,
  "scikit-learn": siScikitlearn,
  YOLOv8: siUltralytics,
  OpenCV: siOpencv,
  LangChain: siLangchain,
  FastAPI: siFastapi,
  "Node.js": siNodedotjs,
  Express: siExpress,
  Flask: siFlask,
  React: siReact,
  "Next.js": siNextdotjs,
  Vite: siVite,
  "Tailwind CSS": siTailwindcss,
  "React Native": siReact,
  PostgreSQL: siPostgresql,
  MySQL: siMysql,
  SQLite: siSqlite,
  BigQuery: siGooglebigquery,
  "Google Cloud": siGooglecloud,
  Docker: siDocker,
  Git: siGit,
  Vercel: siVercel,
  Streamlit: siStreamlit,
};

/** Two- or three-letter fallback mark for skills without a logo. */
export function initials(name: string): string {
  const clean = name.replace(/[^A-Za-z0-9 ]/g, " ").trim();
  const words = clean.split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return clean.slice(0, clean.length <= 3 ? clean.length : 2).toUpperCase();
}
