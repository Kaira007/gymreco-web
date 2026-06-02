import type { GeneratedProgram, GeneratorInput, DayPlan, ExercisePrescription } from '../types';
import { makeT, makeName, calcWeight, addOffset, mainLift } from '../helpers';

export function generateSmolovJr(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale, smolovTarget = 'both' } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const benchLift = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const squatLift = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });

  const includeBench = smolovTarget === 'bench' || smolovTarget === 'both';
  const includeSquat = smolovTarget === 'squat' || smolovTarget === 'both';
  const focusLift = smolovTarget === 'squat' ? squatLift : benchLift;

  const days: DayPlan[] = [];

  for (let week = 1; week <= 3; week++) {
    const offsetKg = (week - 1) * 5;
    const offsetSuffix = offsetKg > 0 ? ` +${offsetKg}kg` : '';
    const w = `Week ${week} - `;

    const makeEx = (
      liftJa: string,
      sets: number,
      reps: string,
      pct: number,
      firstNote?: string,
    ): ExercisePrescription => ({
      exerciseName: n(liftJa),
      recommendedSets: sets,
      recommendedReps: reps,
      notes: week === 1 && firstNote
        ? firstNote
        : t(`1RMの${pct * 100}%${offsetSuffix}`, `${pct * 100}% 1RM${offsetSuffix}`),
      recommendedWeight: addOffset(calcWeight(tw, liftJa, pct), offsetKg),
    });

    const firstWeekBenchNote = t('1RMの70%で開始。毎週2.5-5kg増やす', 'Start at 70% 1RM. Add 2.5–5kg each week');

    days.push(
      {
        dayName: `${w}Day 1`,
        focus: `${n(focusLift)} 6×6`,
        exercises: [
          ...(includeBench ? [makeEx(benchLift, 6, '6', 0.70, firstWeekBenchNote)] : []),
          ...(includeSquat ? [makeEx(squatLift, 6, '6', 0.70)] : []),
        ],
      },
      {
        dayName: `${w}Day 2`,
        focus: `${n(focusLift)} 7×5`,
        exercises: [
          ...(includeBench ? [makeEx(benchLift, 7, '5', 0.75)] : []),
          ...(includeSquat ? [makeEx(squatLift, 7, '5', 0.75)] : []),
        ],
      },
      {
        dayName: `${w}Day 3`,
        focus: `${n(focusLift)} 8×4`,
        exercises: [
          ...(includeBench ? [makeEx(benchLift, 8, '4', 0.80)] : []),
          ...(includeSquat ? [makeEx(squatLift, 8, '4', 0.80)] : []),
        ],
      },
      {
        dayName: `${w}Day 4`,
        focus: `${n(focusLift)} 10×3`,
        exercises: [
          ...(includeBench ? [makeEx(benchLift, 10, '3', 0.85)] : []),
          ...(includeSquat ? [makeEx(squatLift, 10, '3', 0.85)] : []),
        ],
      },
    );
  }

  // 1RM test day
  days.push({
    dayName: t('1RMテスト日', '1RM Test Day'),
    focus: t('1RM MAX更新挑戦', '1RM Max Attempt'),
    isMaxDay: true,
    exercises: [
      ...(includeBench ? [{
        exerciseName: n(benchLift),
        recommendedSets: 1,
        recommendedReps: '1',
        notes: t('十分なウォームアップ後に1RM挑戦。前回の1RMより2.5-5kg重く設定', 'After thorough warm-up, attempt 1RM. Set 2.5–5kg above previous 1RM'),
        recommendedWeight: addOffset(calcWeight(tw, benchLift, 1.05), 0),
      }] : []),
      ...(includeSquat ? [{
        exerciseName: n(squatLift),
        recommendedSets: 1,
        recommendedReps: '1',
        notes: t('十分なウォームアップ後に1RM挑戦。前回の1RMより2.5-5kg重く設定', 'After thorough warm-up, attempt 1RM. Set 2.5–5kg above previous 1RM'),
        recommendedWeight: addOffset(calcWeight(tw, squatLift, 1.05), 0),
      }] : []),
    ],
  });

  const titleMap = {
    bench: t('Smolov Jr ベンチプレス特化プログラム', 'Smolov Jr Bench Press Specialization Program'),
    squat: t('Smolov Jr スクワット特化プログラム', 'Smolov Jr Squat Specialization Program'),
    both: t('Smolov Jr ベンチプレス/スクワット特化プログラム', 'Smolov Jr Bench/Squat Specialization Program'),
  };

  return {
    title: titleMap[smolovTarget],
    weeklyPlan: days,
    nutritionAdvice: t(
      '高強度・高頻度プログラムのため、体重×2.2g以上のタンパク質と十分な炭水化物が必須です。トレーニング前後の栄養補給を特に重視してください。クレアチン5g/日の摂取も推奨します。',
      'High intensity, high frequency program requires 2.2g+ protein per kg bodyweight and ample carbs. Prioritize pre/post-workout nutrition. 5g/day creatine is also recommended.',
    ),
    recoveryAdvice: t(
      '3週間の高強度プログラムです。睡眠は最低8時間確保してください。関節への負担が大きいため、ウォームアップを入念に行い、痛みがある場合は即座に中断してください。',
      'This is a 3-week high-intensity program. Ensure at least 8 hours of sleep. Joint stress is high — warm up thoroughly and stop immediately if you feel pain.',
    ),
  };
}
