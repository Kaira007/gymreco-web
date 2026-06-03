export interface ExercisePrescription {
  exerciseName: string;
  recommendedSets: number;
  recommendedReps: string;
  notes?: string;
  recommendedWeight?: number;
}

export interface DayPlan {
  dayName: string;
  focus: string;
  exercises: ExercisePrescription[];
  isMaxDay?: boolean;
}

export interface GeneratedProgram {
  title: string;
  weeklyPlan: DayPlan[];
  nutritionAdvice: string;
  recoveryAdvice: string;
}

export type Locale = 'ja' | 'en';
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'chinning';

export interface GeneratorInput {
  targetWeights?: { bench?: number; squat?: number; dead?: number; press?: number };
  equipment: Equipment[];
  locale: Locale;
  /** Smolov Jr only */
  smolovTarget?: 'bench' | 'squat' | 'both';
  /** Optional accessory slot overrides */
  accessoryChoices?: Record<string, string>;
}

export interface FaqItem {
  questionJa: string;
  answerJa: string;
  questionEn: string;
  answerEn: string;
}

export interface ProgramMeta {
  slug: string;
  nameJa: string;
  nameEn: string;
  descJa: string;
  descEn: string;
  /** SEO向けページタイトル（H1 / title タグ用） */
  seoTitleJa: string;
  seoTitleEn: string;
  /** SEO向けメタ description */
  seoDescJa: string;
  seoDescEn: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  category: 'beginner' | 'strength' | 'hypertrophy';
  durationWeeks?: number;
  intensityRange?: string;
  /** 関連プログラムのスラッグ（内部リンク用） */
  relatedSlugs: string[];
  /** FAQPage スキーマ + HTML アコーディオン用 */
  faq: FaqItem[];
  /** このプログラムに向いている人（コンテンツ SEO 用） */
  targetAudienceJa: string;
  targetAudienceEn: string;
}
