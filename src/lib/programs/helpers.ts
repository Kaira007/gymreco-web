import type { Equipment, GeneratorInput, Locale } from './types';

// ── i18n ───────────────────────────────────────────────────────
export function makeT(locale: Locale) {
  return (ja: string, en: string): string => locale === 'ja' ? ja : en;
}

// ── Exercise name maps ─────────────────────────────────────────
const nameEnMap: Record<string, string> = {
  'ベンチプレス': 'Bench Press',
  'ダンベルプレス': 'Dumbbell Press',
  'スクワット': 'Squat',
  'ダンベルスクワット': 'Dumbbell Squat',
  'デッドリフト': 'Deadlift',
  'ダンベルRDL': 'Dumbbell RDL',
  'ルーマニアンデッドリフト': 'Romanian Deadlift',
  'ショルダープレス': 'Shoulder Press',
  'ダンベルショルダープレス': 'Dumbbell Shoulder Press',
  'バーベルロウ': 'Barbell Row',
  'ダンベルロウ': 'Dumbbell Row',
  'チンニング': 'Pull-up',
  'チンニング（逆手）': 'Chin-up',
  'ラットプルダウン': 'Lat Pulldown',
  'ケーブルロウ': 'Cable Row',
  'サイドレイズ': 'Lateral Raise',
  'ケーブルレイズ': 'Cable Lateral Raise',
  'ダンベルカール': 'Dumbbell Curl',
  'バーベルカール': 'Barbell Curl',
  'ケーブルカール': 'Cable Curl',
  'ケーブルプッシュダウン': 'Cable Pushdown',
  'トライセプスエクステンション': 'Tricep Extension',
  'ディップス': 'Dips',
  'クローズグリップベンチ': 'Close-Grip Bench Press',
  'レッグプレス': 'Leg Press',
  'レッグカール': 'Leg Curl',
  'スタンディングカーフレイズ': 'Standing Calf Raise',
  'ダンベルカーフレイズ': 'Dumbbell Calf Raise',
  'ブルガリアンスクワット': 'Bulgarian Split Squat',
  'ケーブルフライ': 'Cable Fly',
  'レッグレイズ': 'Leg Raise',
  'クランチ': 'Crunch',
  'ケーブルクランチ': 'Cable Crunch',
  'プランク': 'Plank',
  'プッシュアップ': 'Push-up',
  'チェストプレス': 'Chest Press',
  'デッドリフト（スモウ）': 'Sumo Deadlift',
  'ベンチプレス（インクライン）': 'Incline Bench Press',
  'ベンチプレス（クローズ）': 'Close-Grip Bench Press',
  'スクワット（フロント）': 'Front Squat',
  'パワークリーン': 'Power Clean',
  'ヒップスラスト': 'Hip Thrust',
  'グッドモーニング': 'Good Morning',
  'フェイスプル': 'Face Pull',
  'ロープフェイスプル': 'Rope Face Pull',
  'ケーブルフライ（インクライン）': 'Incline Cable Fly',
  'ダンベルフライ': 'Dumbbell Fly',
  'スカルクラッシャー': 'Skull Crusher',
  'ハンマーカール': 'Hammer Curl',
  'プリーチャーカール': 'Preacher Curl',
  'ケーブルカール（インクライン）': 'Incline Cable Curl',
  'レッグエクステンション': 'Leg Extension',
  'ハックスクワット': 'Hack Squat',
  'シーテッドカーフレイズ': 'Seated Calf Raise',
  'アブローラー': 'Ab Roller',
  'ハイロウ（ケーブル）': 'Cable Woodchop',
  'ランジ': 'Lunge',
};

export function makeName(locale: Locale) {
  return (ja: string): string => locale === 'ja' ? ja : (nameEnMap[ja] ?? ja);
}

// ── Weight helpers ─────────────────────────────────────────────
export function roundToPlate(w: number): number {
  return Math.floor(w / 2.5) * 2.5;
}

/**
 * Dart の initial_weight_service.dart _big4Ratios に完全対応した
 * 種目→ Big4 キー のマッピング。
 * キー: 'bench' | 'squat' | 'dead' | 'press'
 */
const liftKeyMap: Record<string, keyof NonNullable<GeneratorInput['targetWeights']>> = {
  // ── Bench-based ────────────────────────────────────────
  'ベンチプレス': 'bench',
  'ベンチプレス（インクライン）': 'bench',
  'ベンチプレス（クローズ）': 'bench',
  'クローズグリップベンチ': 'bench',
  'チェストプレス': 'bench',
  'ダンベルプレス': 'bench',
  'ケーブルフライ': 'bench',
  'ディップス': 'bench',           // Dart: bench × 0.70（自重ではない）
  'ケーブルプッシュダウン': 'bench',
  'トライセプスエクステンション': 'bench',
  'スカルクラッシャー': 'bench',
  'バーベルカール': 'bench',
  'ダンベルカール': 'bench',
  'ケーブルカール': 'bench',
  'ハンマーカール': 'bench',
  'プリーチャーカール': 'bench',
  'ケーブルカール（インクライン）': 'bench',
  // ── Squat-based ────────────────────────────────────────
  'スクワット': 'squat',
  'ダンベルスクワット': 'squat',
  'スクワット（フロント）': 'squat',
  'レッグプレス': 'squat',
  'ハックスクワット': 'squat',
  'ブルガリアンスクワット': 'squat',
  'レッグエクステンション': 'squat',
  'レッグカール': 'squat',          // Dart: squat × 0.30（dead ではない）
  'スタンディングカーフレイズ': 'squat', // Dart: squat × 0.50
  'ダンベルカーフレイズ': 'squat',       // Dart: squat × 0.50
  'ランジ': 'squat',
  'パワークリーン': 'squat',
  // ── Deadlift-based ─────────────────────────────────────
  'デッドリフト': 'dead',
  'デッドリフト（スモウ）': 'dead',
  'ダンベルRDL': 'dead',
  'ルーマニアンデッドリフト': 'dead',
  'バーベルロウ': 'dead',
  'ダンベルロウ': 'dead',           // Dart: deadlift × 0.35（bench ではない）
  'ラットプルダウン': 'dead',       // Dart: deadlift × 0.45（bench ではない）
  'ケーブルロウ': 'dead',           // Dart: deadlift × 0.45（bench ではない）
  // ── Shoulder Press-based ───────────────────────────────
  'ショルダープレス': 'press',
  'ダンベルショルダープレス': 'press',
  'サイドレイズ': 'press',
  'ケーブルレイズ': 'press',
};

/**
 * Dart の _big4Ratios を完全コピーしたデフォルト重量比率。
 * exWeightDefault() がこのマップを使って重量を計算する。
 */
const defaultRatioMap: Record<string, number> = {
  // Squat-based
  'レッグプレス': 2.00,
  'スクワット（フロント）': 0.85,
  'ブルガリアンスクワット': 0.50,
  'レッグエクステンション': 0.35,
  'レッグカール': 0.30,
  'スタンディングカーフレイズ': 0.50,
  'ダンベルカーフレイズ': 0.50,
  'ランジ': 0.50,
  'ダンベルスクワット': 0.40,
  'パワークリーン': 0.65,
  // Deadlift-based
  'ルーマニアンデッドリフト': 0.65,
  'デッドリフト（スモウ）': 0.90,
  'ダンベルRDL': 0.50,
  'バーベルロウ': 0.55,
  'ダンベルロウ': 0.35,
  'ラットプルダウン': 0.45,
  'ケーブルロウ': 0.45,
  // Bench-based
  'ベンチプレス（インクライン）': 0.85,
  'ベンチプレス（クローズ）': 0.85,
  'クローズグリップベンチ': 0.85,
  'チェストプレス': 0.90,
  'ダンベルプレス': 0.55,
  'ケーブルフライ': 0.30,
  'ディップス': 0.70,
  'ケーブルプッシュダウン': 0.35,
  'トライセプスエクステンション': 0.30,
  'スカルクラッシャー': 0.30,
  'バーベルカール': 0.33,
  'ダンベルカール': 0.28,
  'ケーブルカール': 0.30,
  'ハンマーカール': 0.28,
  'プリーチャーカール': 0.30,
  'ケーブルカール（インクライン）': 0.28,
  // Shoulder Press-based
  'ダンベルショルダープレス': 0.55,
  'サイドレイズ': 0.30,
  'ケーブルレイズ': 0.25,
};

/** 自重種目（チンニング系・プッシュアップ・体幹等）*/
export const BODYWEIGHT_NAMES = new Set([
  'チンニング', 'チンニング（逆手）', 'プッシュアップ', 'プランク',
  'レッグレイズ', 'クランチ', 'アブローラー',
  // ディップスは Dart で bench×0.70 → 自重扱いしない
]);

export function get1RM(tw: GeneratorInput['targetWeights'], jaName: string): number | undefined {
  if (!tw) return undefined;
  const key = liftKeyMap[jaName];
  if (!key) return undefined;
  return tw[key];
}

export function calcWeight(tw: GeneratorInput['targetWeights'], jaName: string, pct: number): number | undefined {
  const rm = get1RM(tw, jaName);
  if (rm == null) return undefined;
  return roundToPlate(rm * pct);
}

/**
 * Dart の _big4Ratios に基づくデフォルト重量を返す。
 * - 自重種目 → 0
 * - defaultRatioMap にある種目 → calcWeight(tw, jaName, ratio)
 * - 未登録 → undefined（"—"表示）
 * アクセサリー種目に使用。メイン種目はプログラム固有の % を使う calcWeight を使う。
 */
export function exWeightDefault(
  tw: GeneratorInput['targetWeights'],
  jaName: string,
): number | undefined {
  if (BODYWEIGHT_NAMES.has(jaName)) return 0;
  const ratio = defaultRatioMap[jaName];
  if (ratio == null) return undefined;
  return calcWeight(tw, jaName, ratio);
}

/** 後方互換。自重なら 0、そうでなければ calcWeight(pct 指定)。 */
export function exWeight(
  tw: GeneratorInput['targetWeights'],
  jaName: string,
  pct: number,
): number | undefined {
  if (BODYWEIGHT_NAMES.has(jaName)) return 0;
  return calcWeight(tw, jaName, pct);
}

export function addOffset(base: number | undefined, offset: number): number | undefined {
  if (base == null) return undefined;
  if (offset === 0) return base;
  return roundToPlate(base + offset);
}

// ── Equipment selection ────────────────────────────────────────
export function mainLift(
  equipment: Equipment[],
  opts: { barbell: string; dumbbell: string; machine?: string; cable?: string; chinning?: string }
): string {
  if (equipment.includes('barbell')) return opts.barbell;
  if (equipment.includes('dumbbell')) return opts.dumbbell;
  if (opts.machine && equipment.includes('machine')) return opts.machine;
  if (opts.cable && equipment.includes('cable')) return opts.cable;
  if (opts.chinning && equipment.includes('chinning')) return opts.chinning;
  return opts.dumbbell;
}

export function slot(key: string, defaultExercise: string, choices?: Record<string, string>): string {
  return choices?.[key] ?? defaultExercise;
}

// ── Default equipment (barbell + dumbbell) ────────────────────
export const DEFAULT_EQUIPMENT: Equipment[] = ['barbell', 'dumbbell'];
