import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift, slot } from '../helpers';

export function generatePHUL(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale, accessoryChoices: ac } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasDumbbell = equipment.includes('dumbbell');
  const hasMachine  = equipment.includes('machine');
  const hasCable    = equipment.includes('cable');
  const hasChinning = equipment.includes('chinning');

  const benchJa = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const pressJa = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const squatJa = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const deadJa  = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルRDL', machine: 'レッグカール' });
  const rdlJa   = mainLift(equipment, { barbell: 'ルーマニアンデッドリフト', dumbbell: 'ダンベルRDL', machine: 'レッグカール' });
  const rowJa   = mainLift(equipment, { barbell: 'バーベルロウ', dumbbell: 'ダンベルロウ', machine: 'ラットプルダウン', cable: 'ケーブルロウ' });
  const calfJa  = hasDumbbell ? 'ダンベルカーフレイズ' : 'スタンディングカーフレイズ';

  const curlAcc = hasDumbbell ? 'ダンベルカール' : hasCable ? 'ケーブルカール' : 'バーベルカール';
  const tricAcc = hasCable ? 'ケーブルプッシュダウン' : 'トライセプスエクステンション';
  const pullAcc = hasChinning ? 'チンニング' : hasMachine ? 'ラットプルダウン' : hasCable ? 'ケーブルロウ' : 'ダンベルロウ';

  return {
    title: t('PHUL パワー&肥大プログラム', 'PHUL Power & Hypertrophy Program'),
    weeklyPlan: [
      {
        dayName: 'Day 1',
        focus: t('Upper Power（上半身パワー）', 'Upper Power'),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 4, recommendedReps: '3-5', notes: t('高重量・低レップ。パワー日のメイン', 'Heavy weight, low reps. Power day main lift'), recommendedWeight: calcWeight(tw, benchJa, 0.87) },
          { exerciseName: n(rowJa), recommendedSets: 4, recommendedReps: '3-5', notes: t('背中のパワー種目', 'Back power lift'), recommendedWeight: exWeightDefault(tw, rowJa) },
          { exerciseName: n(pressJa), recommendedSets: 3, recommendedReps: '5-8', notes: t('肩のコンパウンド', 'Shoulder compound'), recommendedWeight: calcWeight(tw, pressJa, 0.82) },
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 3, recommendedReps: '6-10', notes: t('二頭筋', 'Biceps'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
          { exerciseName: n(slot('tricep_accessory', tricAcc, ac)), recommendedSets: 3, recommendedReps: '6-10', notes: t('三頭筋', 'Triceps'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', tricAcc, ac)) },
        ],
      },
      {
        dayName: 'Day 2',
        focus: t('Lower Power（下半身パワー）', 'Lower Power'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 4, recommendedReps: '3-5', notes: t('高重量・低レップ。脚のメイン', 'Heavy weight, low reps. Leg main lift'), recommendedWeight: calcWeight(tw, squatJa, 0.87) },
          { exerciseName: n(deadJa),  recommendedSets: 4, recommendedReps: '3-5', notes: t('後ろの鎖のパワー種目', 'Posterior chain power lift'), recommendedWeight: calcWeight(tw, deadJa, 0.87) },
          ...(hasMachine ? [
            { exerciseName: n('レッグプレス'), recommendedSets: 3, recommendedReps: '10-15', notes: t('ボリューム追加', 'Additional volume'), recommendedWeight: calcWeight(tw, 'レッグプレス', 0.70) },
            { exerciseName: n(slot('hamstring_accessory', 'レッグカール', ac)), recommendedSets: 3, recommendedReps: '6-10', notes: t('ハムストリング', 'Hamstrings'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', 'レッグカール', ac)) },
          ] : []),
          { exerciseName: n(calfJa), recommendedSets: 4, recommendedReps: '6-10', notes: t('カーフ', 'Calves'), recommendedWeight: exWeightDefault(tw, calfJa) },
        ],
      },
      {
        dayName: 'Day 3',
        focus: t('Upper Hypertrophy（上半身肥大）', 'Upper Hypertrophy'),
        exercises: [
          { exerciseName: n(slot('chest_accessory', hasDumbbell ? 'ダンベルプレス' : 'ベンチプレス', ac)), recommendedSets: 4, recommendedReps: '8-12', notes: t('インクライン推奨。肥大日', 'Incline recommended. Hypertrophy day'), recommendedWeight: calcWeight(tw, benchJa, 0.65) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 4, recommendedReps: '8-12', notes: t('広背筋', 'Lats'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
          ...(hasCable ? [{ exerciseName: n('ケーブルフライ'), recommendedSets: 3, recommendedReps: '12-15', notes: t('胸のアイソレーション', 'Chest isolation'), recommendedWeight: exWeightDefault(tw, 'ケーブルフライ') }] : []),
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 4, recommendedReps: '12-15', notes: t('三角筋中部', 'Medial deltoid'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 3, recommendedReps: '12-15', notes: t('二頭筋・高レップ', 'Biceps, high reps'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
          { exerciseName: n(slot('tricep_accessory', hasCable ? 'ケーブルプッシュダウン' : 'ディップス', ac)), recommendedSets: 3, recommendedReps: '12-15', notes: t('三頭筋・高レップ', 'Triceps, high reps'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', hasCable ? 'ケーブルプッシュダウン' : 'ディップス', ac)) },
        ],
      },
      {
        dayName: 'Day 4',
        focus: t('Lower Hypertrophy（下半身肥大）', 'Lower Hypertrophy'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 4, recommendedReps: '8-12', notes: t('中重量・高レップ。肥大日', 'Moderate weight, high reps. Hypertrophy day'), recommendedWeight: calcWeight(tw, squatJa, 0.65) },
          { exerciseName: n(rdlJa),   recommendedSets: 4, recommendedReps: '8-12', notes: t('ハムストリング', 'Hamstrings'), recommendedWeight: exWeightDefault(tw, rdlJa) },
          { exerciseName: n(hasDumbbell ? 'ブルガリアンスクワット' : 'レッグプレス'), recommendedSets: 3, recommendedReps: '10-15', notes: t('片脚ずつ', 'Unilateral'), recommendedWeight: hasDumbbell ? exWeightDefault(tw, 'ブルガリアンスクワット') : calcWeight(tw, 'レッグプレス', 0.65) },
          ...(hasMachine ? [{ exerciseName: n(slot('hamstring_accessory', 'レッグカール', ac)), recommendedSets: 3, recommendedReps: '10-15', notes: t('ハム単独', 'Hamstring isolation'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', 'レッグカール', ac)) }] : []),
          { exerciseName: n(calfJa), recommendedSets: 4, recommendedReps: '15-20', notes: t('カーフ・高レップ', 'Calves, high reps'), recommendedWeight: exWeightDefault(tw, calfJa) },
        ],
      },
    ],
    nutritionAdvice: t(
      'パワー日と肥大日の2種類があるため、パワー日は炭水化物を多めに、肥大日はタンパク質（体重×2g以上）を特に意識しましょう。カロリーはメンテナンス+300-500kcalが目安です。',
      'With separate power and hypertrophy days, prioritize carbs on power days and protein (2g+ per kg) on hypertrophy days. Target maintenance +300–500 kcal.',
    ),
    recoveryAdvice: t(
      '上半身と下半身を交互に行うため、同じ部位は中2-3日空きます。パワー日の翌日は軽めの有酸素やストレッチで回復を促しましょう。',
      'Alternating upper and lower body leaves 2–3 days between same-muscle sessions. Use light cardio or stretching the day after power sessions to aid recovery.',
    ),
  };
}
