/**
 * Every piece of visible copy on the site lives here.
 * Edit freely: components read from these objects and never hard-code text.
 *
 * House style: use a plain hyphen "-" for ranges and joins (no long dashes).
 */

export type Category = "AI/ML" | "Full-stack" | "Computer Vision";

export type CoverKind =
  | "heatmap"
  | "tracking"
  | "graph"
  | "finance"
  | "insurance"
  | "goals"
  | "molecule"
  | "triage"
  | "report"
  | "sentiment"
  | "billing"
  | "aquifer"
  | "review"
  | "hand";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  impact: string;
  stack: string[];
  categories: Category[];
  /** Small angled tech-category tag on the card corner. */
  label?: string;
  cover: CoverKind;
  github?: string;
  live?: string;
  /** Optional real screenshot at public/images/projects/<slug>.webp|png. Leave undefined to use the generated cover. */
  image?: string;
}

export const site = {
  name: "Mrithika K",
  firstName: "Mrithika",
  role: "AI/ML + Full-stack Engineer",
  /** Used in the header between 768px and 1279px where the full role would be cut off. */
  roleShort: "AI/ML + Full-stack",
  based: "Chennai, India",
  coords: "13.08°N 80.27°E",
  url: "https://mrithika-portfolio.vercel.app",
  email: "mrithikakumar1112@gmail.com",
  /** Drop resume.pdf into /public, then flip this to true to show the Resume buttons. */
  resumeReady: false,
  resume: "/resume.pdf",
  description:
    "Mrithika K is an AI/ML engineer and full-stack developer from Chennai who builds machine learning systems that ship as real, deployed products.",
};

/** The four links revealed by the "Say Hey" card in Contact (also used in the mobile menu). */
export const socials = [
  { id: "github", label: "GitHub", href: "https://github.com/Mrithikahub", ariaLabel: "GitHub profile (opens in a new tab)" },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mrithika-kumar-a12865316",
    ariaLabel: "LinkedIn profile (opens in a new tab)",
  },
  { id: "discord", label: "Discord", copy: "mrithika0552", ariaLabel: "Copy Discord username mrithika0552" },
  { id: "gmail", label: "Gmail", href: "mailto:mrithikakumar1112@gmail.com", ariaLabel: "Email mrithikakumar1112@gmail.com" },
] as const;

/** Coding profiles: shown only as small mono links in the footer. */
export const codingProfiles = [
  { label: "LeetCode", href: "https://leetcode.com/u/Mrithi_Tech" },
  { label: "HackerRank", href: "https://www.hackerrank.com/profile/mrithikakumar111" },
] as const;

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const loader = {
  lines: ["> initializing portfolio", "> loading models", "> mounting interface"],
  done: "ready",
};

export const hero = {
  greeting: ["Hey,", "I'm"],
  name: "Mrithika.",
  taglines: ["I build AI systems that ship", "I turn models into products", "I like hard problems"],
  stackPrefix: "stack",
  stack: ["Python", "PyTorch", "YOLOv8", "FastAPI", "React", "TypeScript", "BigQuery", "LangChain"],
  status: "Open to internships & full-time roles · Ready to relocate",
  statusTimezone: "IST",
  ctas: {
    work: "View work",
    resume: "Resume",
    contact: "Contact",
  },
  signoff: "Build something cool today :)",
  chips: ["YOLOv8", "FastAPI", "LLMs / RAG", "React"],
  avatarAlt: "3D avatar of Mrithika waving from her desk, with a laptop, a plant and a bookshelf behind her",
  /** Glass panel on the avatar card: rows type in after the intro. */
  panel: {
    title: "mrithika.whoami()",
    rows: [
      ["role", "AI/ML + Full-stack"],
      ["batch", "B.Tech CSE CORE, 2024-2028"],
      ["based", "Chennai, India"],
      ["status", "open to work"],
    ] as [string, string][],
    footer: { key: "ready_to_relocate", value: "true" },
  },
  scrollCue: "Scroll",
  /** Decorative code that streams behind the avatar card. Real snippets from the projects. */
  codeStream: [
    'model = YOLO("yolov8n.pt")',
    "results = model.track(frame, persist=True)",
    "tracker.update(detections)",
    "plates = reader.readtext(crop)",
    "H, _ = cv2.findHomography(src_pts, dst_pts)",
    "speed = dist_m / dt * 3.6  # km/h",
    "if speed > limit: flag(track_id)",
    '@app.post("/predict")',
    "async def predict(req: SiteRequest):",
    "return {\"score\": float(p)}",
    "xgb.fit(X_train, y_train)",
    "explainer = shap.TreeExplainer(model)",
    "shap_values = explainer(X_test)",
    "roc_auc_score(y, p)  # 0.89",
    'ee.ImageCollection("COPERNICUS/S2_SR")',
    ".filterDate(start, end).median()",
    "ndvi = img.normalizedDifference([\"B8\", \"B4\"])",
    "retriever.get_relevant_documents(q)",
    "chain = prompt | llm | parser",
    "docs = vectorizer.transform([query])",
    "label = triage(ticket)  # route",
    'client.query("SELECT * FROM crimes")',
    "df = cudf.read_parquet(path)",
    "model = Sequential([Bidirectional(LSTM(64))])",
    "model.compile(optimizer=\"adam\")",
    "landmarks = hands.process(rgb)",
    "const [theme, setTheme] = useState()",
    "export default function App() {",
    "await fetch(`/api/goals/${id}`)",
    "app.listen(PORT, () => log(\"up\"))",
    'router.post("/otp/reset", resetOtp)',
    "const total = items.reduce(sum, 0)",
    "payout = policy.trigger(rainfall)",
    'ollama.chat(model="meditron")',
    "for chunk in splitter.split(doc):",
    "with torch.no_grad():",
    "git commit -m \"ship it\"",
  ],
};

export const transitions = {
  about: {
    title: "About",
    phrase: "from notebooks to production",
    note: "the person behind the pipelines",
  },
  work: {
    title: "Work",
    phrase: "models that leave the lab",
    note: "selected builds, deployed and in use",
  },
  experience: {
    title: "Experience",
    phrase: "shipped inside real teams",
    note: "internships across rail, research and remote sensing",
  },
  contact: {
    title: "Contact",
    phrase: "let's build the next one",
    note: "my inbox is open",
  },
};

export const about = {
  index: "01 / ABOUT",
  heading: "I build things that leave the notebook.",
  paragraphs: [
    "In my first week of college I walked into a two-day web workshop out of curiosity and walked out with a site I had built myself. I haven't stopped building since.",
    "Today I work across machine learning and full-stack engineering. What I enjoy most is the last mile: taking a model that scores well in a notebook and turning it into a deployed product with an API, an interface and people using it.",
    "My first solo international trip, Chennai to London, taught me to back myself in unfamiliar places.",
    "Away from the keyboard I write fiction and short pieces, and I'm slowly learning how markets and investing work.",
  ],
  education: {
    degree: "B.Tech, Computer Science and Engineering",
    school: "SRM Institute of Science and Technology, Kattankulathur",
    years: "2024 - 2028",
  },
  imageAlt: "3D avatar of Mrithika seen from behind, coding on a laptop at a sunlit desk",
  photoAlt: "Mrithika in London, standing in front of the Houses of Parliament",
  photoHintHover: "Hover to meet the human behind the code",
  photoHintTap: "Tap to meet the human behind the code",
  photoShown: "the human behind the code ✦",
  stats: [
    // Projects count is derived from the lists below, so it stays true as you add work.
    { value: 0, suffix: "", label: "projects shipped", derive: "projects" as const },
    { value: 3, suffix: "", label: "internships" },
    { value: 9, suffix: "", label: "hackathons" },
  ],
};

export const work = {
  index: "02 / WORK",
  heading: "Featured work",
  allHeading: "All projects",
  filters: ["All", "AI/ML", "Full-stack", "Computer Vision"] as const,
  cursorLabel: "View",
  emptyState: "No projects in this category yet.",
};

export const featured: Project[] = [
  {
    slug: "solarsite",
    title: "Solarsite",
    summary: "Global solar site suitability prediction from satellite and terrain data.",
    impact: "ROC-AUC 0.89 globally vs 0.62 for the AHP baseline, trained on 8,213 real solar plants.",
    stack: ["Google Earth Engine", "XGBoost", "SHAP", "FastAPI", "React"],
    categories: ["AI/ML", "Full-stack"],
    label: "Geo ML",
    cover: "heatmap",
    github: "https://github.com/Mrithikahub/solar-site-suitability",
    live: "https://solar-site-suitability.vercel.app",
  },
  {
    slug: "traffic-violation-detection",
    title: "AI Traffic Violation Detection",
    summary:
      "Vehicle tracking, licence plate OCR and homography speed estimation feeding a rule engine for overspeeding, wrong-side driving, lane changes and tailgating.",
    impact: "Live plate detection on any uploaded video, deployed on Streamlit Cloud and Modal. Research paper in progress.",
    stack: ["YOLOv8", "ByteTrack", "EasyOCR", "OpenCV", "Streamlit", "Modal"],
    categories: ["AI/ML", "Computer Vision"],
    label: "Vision",
    cover: "tracking",
    github: "https://github.com/Mrithikahub/traffic-violation-detection",
  },
  {
    slug: "velocitycivic",
    title: "VelocityCivic",
    summary: "Decision intelligence platform on Chicago crime data, built solo with BigQuery, Groq LLaMA 3.1 and RAPIDS cuDF.",
    impact: "An LLM analyst turns plain-English questions into answers drawn from the data.",
    stack: ["BigQuery", "Groq LLaMA 3.1", "RAPIDS cuDF", "Streamlit"],
    categories: ["AI/ML"],
    label: "AI / Data",
    cover: "graph",
    github: "https://github.com/Mrithikahub/velocitycivic",
  },
  {
    slug: "spendchakra",
    title: "SpendChakra",
    summary:
      "Personal finance app for Indian families: expenses, product expiry alerts, budgets, savings goals and investment suggestions.",
    impact: "Designed around how Indian households actually track money and groceries.",
    stack: ["React Native", "Expo", "TypeScript"],
    categories: ["Full-stack"],
    label: "Mobile",
    cover: "finance",
    github: "https://github.com/Mrithikahub/spendchakra",
  },
];

export const projects: Project[] = [
  {
    slug: "triggerpe",
    title: "TriggerPe",
    summary: "Parametric income insurance for gig workers that pays out automatically when extreme weather hits.",
    impact: "Weather data triggers payouts automatically, so workers never have to file a claim.",
    stack: ["FastAPI", "Next.js", "scikit-learn"],
    categories: ["AI/ML", "Full-stack"],
    label: "ML / FinTech",
    cover: "insurance",
    github: "https://github.com/Mrithikahub/triggerpe",
  },
  {
    slug: "atomquest",
    title: "AtomQuest",
    summary: "Goal setting and tracking portal with a React frontend and a Node.js API on Turso SQLite.",
    impact: "Deployed end to end, frontend on Vercel and API on Render.",
    stack: ["React", "Vite", "Node.js", "Turso SQLite"],
    categories: ["Full-stack"],
    label: "Full-stack",
    cover: "goals",
    github: "https://github.com/Mrithikahub/atomquest-portal",
    live: "https://atomquest-portal-black.vercel.app",
  },
  {
    slug: "evodoc",
    title: "EvoDoc",
    summary: "Drug safety engine that flags interactions, allergy conflicts and contraindications for a patient profile.",
    impact: "Meditron LLM via Ollama with a curated rule-set fallback, deployed on Railway.",
    stack: ["FastAPI", "Meditron", "Ollama"],
    categories: ["AI/ML"],
    label: "LLM / Health",
    cover: "molecule",
    github: "https://github.com/Mrithikahub/evodoc-drug-safety-engine",
  },
  {
    slug: "rag-triage-agent",
    title: "RAG Triage Agent",
    summary: "Terminal agent that triages real support tickets across three product ecosystems.",
    impact: "TF-IDF retrieval feeds Mistral, which routes each ticket using only the support corpus.",
    stack: ["Python", "TF-IDF", "Mistral", "RAG"],
    categories: ["AI/ML"],
    label: "LLM / RAG",
    cover: "triage",
    github: "https://github.com/Mrithikahub/hackerrank-orchestrate-may26",
  },
  {
    slug: "sar-automation",
    title: "SAR Automation System",
    summary: "Generates structured SAR reports from user inputs with retrieval-augmented generation.",
    impact: "A Streamlit app that turns form inputs into a consistent, structured report.",
    stack: ["Python", "RAG", "Streamlit"],
    categories: ["AI/ML"],
    label: "GenAI",
    cover: "report",
    github: "https://github.com/Mrithikahub/sar-automation-system",
  },
  {
    slug: "twitter-sentiment",
    title: "Twitter Sentiment Analysis",
    summary: "Head-to-head comparison of LSTM, Bi-LSTM and GRU models for tweet sentiment.",
    impact: "Best model reached about 84.9% accuracy during my research internship.",
    stack: ["TensorFlow", "Keras", "LSTM", "GRU"],
    categories: ["AI/ML"],
    label: "NLP",
    cover: "sentiment",
  },
  {
    slug: "hand-gesture-recognition",
    title: "Real-Time Hand Gesture Recognition",
    summary: "A to Z sign alphabet recognition from a webcam using hand landmarks.",
    impact: "MediaPipe landmarks feeding SVM and LSTM classifiers in real time (team project).",
    stack: ["MediaPipe", "OpenCV", "SVM", "LSTM"],
    categories: ["AI/ML", "Computer Vision"],
    label: "Vision",
    cover: "hand",
  },
  {
    slug: "lawn-gst-billing",
    title: "LAWN GST Billing System",
    summary: "Full-stack GST billing with staff login, OTP password reset and an admin dashboard.",
    impact: "Built for the IT department at ICF, Indian Railways.",
    stack: ["React", "Vite", "Node.js", "Express", "Oracle XE"],
    categories: ["Full-stack"],
    label: "Full-stack",
    cover: "billing",
  },
  {
    slug: "hidden-aquifer-mapper",
    title: "Hidden Aquifer Mapper",
    summary: "Predicts likely groundwater locations from geospatial and environmental sensor data.",
    impact: "Supports more targeted, sustainable groundwater exploration.",
    stack: ["Python", "scikit-learn", "GIS"],
    categories: ["AI/ML"],
    label: "Geo ML",
    cover: "aquifer",
    github: "https://github.com/Mrithikahub/hidden-aquifer-mapper",
  },
  {
    slug: "compliance-reviewer",
    title: "Skill-Based Assignment Compliance Reviewer",
    summary: "Local-first agentic reviewer that checks assignments against a skill rubric.",
    impact: "Runs fully on-device with Qwen via Ollama, built as a Responsible AI team project.",
    stack: ["Qwen", "Ollama", "FastAPI", "LangChain", "Streamlit"],
    categories: ["AI/ML"],
    label: "Agentic AI",
    cover: "review",
  },
];

export const experience = {
  index: "03 / EXPERIENCE",
  heading: "Where I've worked",
  items: [
    {
      org: "ICF, Indian Railways",
      role: "IT Department Intern",
      period: "Jun 2026",
      points: [
        "Built six Python financial reporting tools, migrating them off legacy PHP and Oracle.",
        "Designed and shipped the full-stack LAWN GST billing system.",
      ],
      tags: ["Python", "Oracle", "React", "Node.js"],
    },
    {
      org: "AIQuantum Smart Solutions",
      role: "AI/ML Research Intern",
      period: "May - Jul 2026",
      points: [
        "Researched under Dr. Shyam Lal (NITK).",
        "Built and compared LSTM, Bi-LSTM and GRU sentiment models.",
      ],
      tags: ["TensorFlow", "NLP", "Deep learning"],
    },
    {
      org: "India Space Academy",
      role: "Remote Sensing and GIS Intern",
      period: "Jan 2026",
      points: ["Analysed vegetation health with NDVI from satellite imagery."],
      tags: ["Remote sensing", "NDVI", "GIS"],
    },
  ],
};

export const skills = {
  index: "04 / STACK",
  heading: "Tools I reach for",
  groups: [
    { name: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "SQL", "C"] },
    { name: "AI/ML", items: ["PyTorch", "TensorFlow", "scikit-learn", "XGBoost", "YOLOv8", "OpenCV", "LangChain", "SHAP"] },
    { name: "Backend", items: ["FastAPI", "Node.js", "Express", "Flask", "REST APIs"] },
    { name: "Frontend", items: ["React", "Next.js", "Vite", "Tailwind CSS", "React Native"] },
    { name: "Databases", items: ["PostgreSQL", "MySQL", "Oracle", "SQLite", "BigQuery"] },
    { name: "Cloud/Tools", items: ["AWS", "Google Cloud", "Docker", "Git", "Vercel", "Streamlit"] },
  ],
};

export interface Cert {
  name: string;
  issuer: string;
  date: string;
  /** Initials badge used when no logo file exists. */
  mark: string;
  /** Logo file name (without extension) in src/assets/logos/. */
  logo?: string;
  status: "verified" | "progress";
  /** Certificate file in public/certificates/ (PDF or image). Previews are built by `npm run images`. */
  file?: string;
  /** Number of pages rendered into public/certificates/previews/. */
  pages?: number;
}

export const certifications = {
  index: "05 / CERTS",
  heading: "Certifications and training",
  verified: "Verified",
  inProgress: "In progress",
  viewHint: "View certificate",
  items: [
    {
      name: "Google Cloud Gen AI Academy APAC 2026, Cohort 2",
      issuer: "Google Cloud",
      date: "Jul 2026",
      mark: "GC",
      status: "verified",
      file: "googlecludgenai.pdf",
    },
    {
      name: "AWS AI & ML Scholars 2026",
      issuer: "Amazon Web Services × Udacity",
      date: "Jun 2026",
      mark: "AWS",
      logo: "AwsAIMLScholar",
      status: "verified",
      file: "AWS AI Practitioner Challenge Certificate.pdf",
    },
    { name: "NPTEL Elite: Java", issuer: "IIT Kharagpur", date: "Jul–Oct 2025", mark: "NPTEL", logo: "nptel", status: "verified", file: "nptel-java.pdf" },
    { name: "NPTEL Elite: DBMS", issuer: "IIT Kharagpur", date: "Jan–Mar 2026", mark: "NPTEL", logo: "nptel", status: "verified", file: "nptel-dbms.pdf" },
    {
      name: "PHIL102: Introduction to Critical Thinking and Logic",
      issuer: "Saylor University",
      date: "Apr 2026",
      mark: "SA",
      logo: "sayloracademy",
      status: "verified",
      file: "logicalandanalyticalthinking.pdf",
      pages: 2,
    },
    {
      name: "Networking Basics",
      issuer: "Cisco Networking Academy",
      date: "Oct 2026",
      mark: "CISCO",
      logo: "cisco",
      status: "verified",
      file: "Networking_Basics_certificate_Cisco.pdf",
    },
    {
      name: "Networking Devices and Initial Configuration",
      issuer: "Cisco Networking Academy",
      date: "Oct 2026",
      mark: "CISCO",
      logo: "cisco",
      status: "verified",
      file: "Networking_Devices_and_Initial_Configuration_cisco.pdf",
    },
    { name: "AI/ML Program", issuer: "CDAC, MEPZ", date: "Expected Nov 2026", mark: "CDAC", logo: "cdac", status: "progress" },
    { name: "AWS Cloud Practitioner", issuer: "Amazon Web Services", date: "Expected Nov 2026", mark: "AWS", logo: "awsprogress", status: "progress" },
  ] satisfies Cert[] as Cert[],
};

export const community = {
  index: "06 / COMMUNITY",
  heading: "Clubs and community",
  clubs: [
    {
      name: "SRMIST ACM Student Chapter",
      initials: "ACM",
      role: "Creatives Member",
      logo: "club1",
      detail: "I design visuals and content for chapter events, and volunteered with Sevalaya through the chapter.",
    },
    {
      name: "SRMIST ACM Women Chapter",
      initials: "ACM-W",
      role: "Creatives Member",
      logo: "club2",
      detail: "I create visuals and content for ACM-W events and workshops.",
    },
  ],
  volunteering: {
    name: "NSS (National Service Scheme)",
    initials: "NSS",
    role: "Volunteer",
    period: "Sep 2024 – Dec 2024",
    logo: "nss",
    label: "Volunteering",
  },
};

export const contact = {
  index: "07 / CONTACT",
  heading: "Say Hey!",
  body: "Internships, full-time roles, research collaborations or a build idea. I'm ready to relocate. Write to me, I read everything.",
  card: {
    label: "SAY HEY",
    groupLabel: "Social links",
    copiedDiscord: "Discord username copied",
  },
  copyLabel: "Copy email",
  copied: "Email copied",
  copyFailed: "Couldn't copy. Select the text instead.",
  avatarAlt: "3D avatar of Mrithika waving with both hands",
  footer: {
    copyright: "© Mrithika K",
    built: "Built with React + Vite",
    corner: "PORTFOLIO",
    backToTop: "Back to top",
  },
};

export const notFound = {
  code: "404",
  line: "> route not found",
  body: "This page doesn't exist, or it moved.",
  cta: "Back home",
};

/** Fill derived stats (kept at the bottom so the project lists exist first). */
for (const stat of about.stats as { value: number; derive?: "projects" }[]) {
  if (stat.derive === "projects") stat.value = featured.length + projects.length;
}
