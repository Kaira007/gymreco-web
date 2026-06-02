import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift } from '../helpers';

export function generateStartingStrength(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasBarbell = equipment.includes('barbell');
  const squat = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const bench = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const press = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const dead  = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルRDL' });
  const clean = mainLift(equipment, { barbell: 'パワークリーン', dumbbell: 'ダンベルロウ', machine: 'ラットプルダウン' });

  return {
    title: t('Starting Strength リニアプログレッション', 'Starting Strength Linear Progression'),
    weeklyPlan: [
      {
        dayName: t('Day 1（Workout A）', 'Day 1 (Workout A)'),
        focus: t('スクワット/ベンチ/デッド', 'Squat/Bench/Deadlift'),
        exercises: [
          { exerciseName: n(squat), recommendedSets: 3, recommendedReps: '5', notes: t('毎回2.5kg増やす。全トレで必ず実施', 'Add 2.5kg each session. Performed every workout'), recommendedWeight: calcWeight(tw, squat, 0.60) },
          { exerciseName: n(bench), recommendedSets: 3, recommendedReps: '5', notes: t('毎回2.5kg増やす', 'Add 2.5kg each session'), recommendedWeight: calcWeight(tw, bench, 0.60) },
          { exerciseName: n(dead),  recommendedSets: 1, recommendedReps: '5', notes: t('1ワークセット。毎回5kg増やす', '1 work set. Add 5kg each session'), recommendedWeight: calcWeight(tw, dead, 0.60) },
        ],
      },
      {
        dayName: t('Day 2（Workout B）', 'Day 2 (Workout B)'),
        focus: t('スクワット/プレス/クリーン', 'Squat/Press/Clean'),
        exercises: [
          { exerciseName: n(squat), recommendedSets: 3, recommendedReps: '5', notes: t('毎回2.5kg増やす', 'Add 2.5kg each session'), recommendedWeight: calcWeight(tw, squat, 0.60) },
          { exerciseName: n(press), recommendedSets: 3, recommendedReps: '5', notes: t('毎回1-2.5kg増やす', 'Add 1–2.5kg each session'), recommendedWeight: calcWeight(tw, press, 0.60) },
          { exerciseName: n(clean), recommendedSets: 5, recommendedReps: '3', notes: hasBarbell ? t('パワー系。フォーム重視', 'Power movement. Focus on form') : t('代替種目', 'Substitute exercise'), recommendedWeight: exWeightDefault(tw, clean) },
        ],
      },
      {
        dayName: t('Day 3（Workout A）', 'Day 3 (Workout A)'),
        focus: t('スクワット/ベンチ/デッド', 'Squat/Bench/Deadlift'),
        exercises: [
          { exerciseName: n(squat), recommendedSets: 3, recommendedReps: '5', notes: t('A/B/Aの繰り返し。翌週はB/A/B', 'A/B/A rotation. Next week B/A/B'), recommendedWeight: calcWeight(tw, squat, 0.60) },
          { exerciseName: n(bench), recommendedSets: 3, recommendedReps: '5', notes: t('前回から+2.5kg', '+2.5kg from last session'), recommendedWeight: calcWeight(tw, bench, 0.60) },
          { exerciseName: n(dead),  recommendedSets: 1, recommendedReps: '5', notes: t('前回から+5kg', '+5kg from last session'), recommendedWeight: calcWeight(tw, dead, 0.60) },
        ],
      },
    ],
    nutritionAdvice: t(
      '毎回重量が増えるプログラムのため、十分なカロリーとタンパク質（体重×1.6-2g）が必須です。ガリガリ体型なら牛乳1日1L（GOMAD）も検討してください。',
      'Since you add weight every session, sufficient calories and 1.6–2g protein per kg are essential. Underweight lifters may consider GOMAD (1 gallon of milk a day).',
    ),
    recoveryAdvice: t(
      'シンプルだが非常にハードなプログラムです。トレーニング間は必ず1日以上休みましょう。睡眠8時間以上を確保し、フォームの練習を怠らないでください。',
      'Simple but very demanding. Always rest at least one day between sessions. Get 8+ hours of sleep and never neglect form practice.',
    ),
  };
}
