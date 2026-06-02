import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift } from '../helpers';

export function generateStrongLifts(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const squat = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const bench = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const row   = mainLift(equipment, { barbell: 'バーベルロウ', dumbbell: 'ダンベルロウ', machine: 'ラットプルダウン', cable: 'ケーブルロウ' });
  const press = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const dead  = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルRDL' });

  return {
    title: t('StrongLifts 5×5 ストレングスプログラム', 'StrongLifts 5×5 Strength Program'),
    weeklyPlan: [
      {
        dayName: t('Day 1（Workout A）', 'Day 1 (Workout A)'),
        focus: t('スクワット/ベンチ/ロウ', 'Squat/Bench/Row'),
        exercises: [
          { exerciseName: n(squat), recommendedSets: 5, recommendedReps: '5', notes: t('毎回2.5kg増やす。ウォームアップ後のワークセット', 'Add 2.5kg each session. Work sets after warm-up'), recommendedWeight: calcWeight(tw, squat, 0.60) },
          { exerciseName: n(bench), recommendedSets: 5, recommendedReps: '5', notes: t('毎回2.5kg増やす', 'Add 2.5kg each session'), recommendedWeight: calcWeight(tw, bench, 0.60) },
          { exerciseName: n(row),   recommendedSets: 5, recommendedReps: '5', notes: t('毎回2.5kg増やす', 'Add 2.5kg each session'), recommendedWeight: exWeightDefault(tw, row) },
        ],
      },
      {
        dayName: t('Day 2（Workout B）', 'Day 2 (Workout B)'),
        focus: t('スクワット/プレス/デッド', 'Squat/Press/Deadlift'),
        exercises: [
          { exerciseName: n(squat), recommendedSets: 5, recommendedReps: '5', notes: t('毎回2.5kg増やす', 'Add 2.5kg each session'), recommendedWeight: calcWeight(tw, squat, 0.60) },
          { exerciseName: n(press), recommendedSets: 5, recommendedReps: '5', notes: t('毎回2.5kg増やす', 'Add 2.5kg each session'), recommendedWeight: calcWeight(tw, press, 0.60) },
          { exerciseName: n(dead),  recommendedSets: 1, recommendedReps: '5', notes: t('毎回5kg増やす。1セットのみ', 'Add 5kg each session. 1 work set only'), recommendedWeight: calcWeight(tw, dead, 0.60) },
        ],
      },
      {
        dayName: t('Day 3（Workout A）', 'Day 3 (Workout A)'),
        focus: t('スクワット/ベンチ/ロウ', 'Squat/Bench/Row'),
        exercises: [
          { exerciseName: n(squat), recommendedSets: 5, recommendedReps: '5', notes: t('A/B/Aの繰り返し。翌週はB/A/B', 'A/B/A rotation. Next week B/A/B'), recommendedWeight: calcWeight(tw, squat, 0.60) },
          { exerciseName: n(bench), recommendedSets: 5, recommendedReps: '5', notes: t('前回から+2.5kg', '+2.5kg from last session'), recommendedWeight: calcWeight(tw, bench, 0.60) },
          { exerciseName: n(row),   recommendedSets: 5, recommendedReps: '5', notes: t('前回から+2.5kg', '+2.5kg from last session') },
        ],
      },
    ],
    nutritionAdvice: t(
      '筋力向上と筋量増加のため、体重×1.6-2gのタンパク質を摂取しましょう。毎回重量が増えるプログラムのため、十分なカロリー摂取が重要です。',
      'Aim for 1.6–2g protein per kg bodyweight for strength and muscle gains. Sufficient calorie intake is crucial since you add weight every session.',
    ),
    recoveryAdvice: t(
      'トレーニング間に最低1日の休息を取りましょう。毎回2.5kgずつ重量を増やし、3回連続で失敗したら10%重量を落としてやり直してください。',
      'Take at least one rest day between sessions. Add 2.5kg each session. If you fail 3 times in a row, deload by 10% and reset.',
    ),
  };
}
