import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift } from '../helpers';

export function generateTexasMethod(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasBarbell  = equipment.includes('barbell');
  const hasMachine  = equipment.includes('machine');
  const hasDumbbell = equipment.includes('dumbbell');

  const squatJa = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const benchJa = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const pressJa = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const deadJa  = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルRDL' });
  const cleanJa = mainLift(equipment, { barbell: 'パワークリーン', dumbbell: 'ダンベルロウ', machine: 'ラットプルダウン' });

  return {
    title: t('Texas Method ストレングスプログラム', 'Texas Method Strength Program'),
    weeklyPlan: [
      {
        dayName: t('Day 1（Volume Day）', 'Day 1 (Volume Day)'),
        focus: t('ボリュームデー 5×5', 'Volume Day 5×5'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 5, recommendedReps: '5', notes: t('5RMの90%（1RMの約77%）。ボリューム日は量を稼ぐ', '90% of 5RM (~77% 1RM). Volume day: accumulate reps'), recommendedWeight: calcWeight(tw, squatJa, 0.77) },
          { exerciseName: n(benchJa), recommendedSets: 5, recommendedReps: '5', notes: t('5RMの90%', '90% of 5RM'), recommendedWeight: calcWeight(tw, benchJa, 0.77) },
          { exerciseName: n(deadJa),  recommendedSets: 1, recommendedReps: '5', notes: t('デッドは1セット。5RMの90%', '1 set deadlift at 90% of 5RM'), recommendedWeight: calcWeight(tw, deadJa, 0.77) },
        ],
      },
      {
        dayName: t('Day 2（Recovery Day）', 'Day 2 (Recovery Day)'),
        focus: t('リカバリーデー 軽負荷', 'Recovery Day (Light)'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 2, recommendedReps: '5', notes: t('Volume Dayの80%（1RMの約62%）。回復促進', '80% of Volume Day (~62% 1RM). Promote recovery'), recommendedWeight: calcWeight(tw, squatJa, 0.62) },
          { exerciseName: n(pressJa), recommendedSets: 3, recommendedReps: '5', notes: t('ベンチと交互に。軽〜中重量', 'Alternates with bench. Light to moderate weight'), recommendedWeight: calcWeight(tw, pressJa, 0.70) },
          ...((hasMachine || hasDumbbell) ? [{ exerciseName: n(hasMachine ? 'ラットプルダウン' : 'ダンベルロウ'), recommendedSets: 3, recommendedReps: '8-12', notes: t('背中のアクセサリー', 'Back accessory'), recommendedWeight: exWeightDefault(tw, hasMachine ? 'ラットプルダウン' : 'ダンベルロウ') }] : []),
          { exerciseName: n('レッグレイズ'), recommendedSets: 3, recommendedReps: '15', notes: t('腹筋', 'Core'), recommendedWeight: exWeightDefault(tw, 'レッグレイズ') },
        ],
      },
      {
        dayName: t('Day 3（Intensity Day）', 'Day 3 (Intensity Day)'),
        focus: t('インテンシティデー 1×5 PR', 'Intensity Day 1×5 PR'),
        isMaxDay: true,
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 1, recommendedReps: '5', notes: t('自己ベスト更新を目指す！毎週少しずつ伸ばす', 'Go for a PR! Increase weight each week'), recommendedWeight: calcWeight(tw, squatJa, 0.87) },
          { exerciseName: n(benchJa), recommendedSets: 1, recommendedReps: '5', notes: t('5RMのPRを狙う', 'Aim for a 5RM PR'), recommendedWeight: calcWeight(tw, benchJa, 0.87) },
          { exerciseName: n(cleanJa), recommendedSets: 5, recommendedReps: '3', notes: hasBarbell ? t('パワークリーン。爆発的に。1RMの70%', 'Power Clean. Explosive reps at 70% 1RM') : t('代替: ロウ系種目', 'Substitute: rowing movement'), recommendedWeight: calcWeight(tw, deadJa, 0.70) },
        ],
      },
    ],
    nutritionAdvice: t(
      'Volume Dayのために体重×2g以上のタンパク質と十分な炭水化物が必要です。Intensity Day前日は特にしっかり食べてPR更新に備えましょう。',
      'Volume Day demands 2g+ protein per kg and ample carbs. Eat especially well the day before Intensity Day to set new PRs.',
    ),
    recoveryAdvice: t(
      'Recovery Day（軽い日）を飛ばさないでください。超回復のサイクルで毎週PRを更新するプログラムです。進歩が止まったら5-10%重量を落としてリセットしましょう。',
      "Never skip Recovery Day (light day). The program relies on the supercompensation cycle to set weekly PRs. If progress stalls, reset by dropping 5–10%.",
    ),
  };
}
