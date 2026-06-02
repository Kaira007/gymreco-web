import type { GeneratedProgram, GeneratorInput, DayPlan } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift, slot } from '../helpers';

export function generateWendler531(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale, accessoryChoices: ac } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasDumbbell = equipment.includes('dumbbell');
  const hasMachine = equipment.includes('machine');

  const pressJa = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const benchJa = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const deadJa  = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルRDL' });
  const squatJa = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });

  const bbbNote = t('BBB補助: TM×50-60%', 'BBB accessory: TM×50-60%');

  const weekReps  = ['5/5/5+', '3/3/3+', '5/3/1+', '5/5/5'];
  const weekTop   = [0.765, 0.81, 0.855, 0.54];
  const weekBBB   = [true, true, true, false];
  const weekNote  = [
    t('5/5/5+ (TM×65/75/85%)', '5/5/5+ (TM×65/75/85%)'),
    t('3/3/3+ (TM×70/80/90%)', '3/3/3+ (TM×70/80/90%)'),
    t('5/3/1+ (TM×75/85/95%)', '5/3/1+ (TM×75/85/95%)'),
    t('ディロード: TM×40/50/60%', 'Deload: TM×40/50/60%'),
  ];

  const days: DayPlan[] = [];

  for (let week = 1; week <= 4; week++) {
    const i = week - 1;
    const w = `Week ${week} - `;
    const reps = weekReps[i];
    const topPct = weekTop[i];
    const hasBBB = weekBBB[i];
    const mainNote = weekNote[i];

    const hamstringAcc = mainLift(equipment, { barbell: 'ルーマニアンデッドリフト', dumbbell: 'ダンベルRDL', machine: 'レッグカール' });
    const pullAcc = hasMachine ? 'ラットプルダウン' : 'ダンベルロウ';
    const curlAcc = mainLift(equipment, { barbell: 'バーベルカール', dumbbell: 'ダンベルカール', cable: 'ケーブルカール' });

    days.push(
      {
        dayName: `${w}Day 1`,
        focus: n(pressJa),
        exercises: [
          { exerciseName: n(pressJa), recommendedSets: 3, recommendedReps: reps, notes: mainNote, recommendedWeight: calcWeight(tw, pressJa, topPct) },
          ...(hasBBB ? [{ exerciseName: n(pressJa), recommendedSets: 5, recommendedReps: '10', notes: bbbNote, recommendedWeight: calcWeight(tw, pressJa, 0.50) }] : []),
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 3, recommendedReps: '12-15', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
          ...((hasMachine || hasDumbbell) ? [{ exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('プル系アクセサリー', 'Pull accessory'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) }] : []),
        ],
      },
      {
        dayName: `${w}Day 2`,
        focus: n(deadJa),
        exercises: [
          { exerciseName: n(deadJa), recommendedSets: 3, recommendedReps: reps, notes: mainNote, recommendedWeight: calcWeight(tw, deadJa, topPct) },
          ...(hasBBB ? [{ exerciseName: n(deadJa), recommendedSets: 5, recommendedReps: '10', notes: bbbNote, recommendedWeight: calcWeight(tw, deadJa, 0.50) }] : []),
          { exerciseName: n(slot('hamstring_accessory', hamstringAcc, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('ハムストリング強化', 'Hamstring strengthening'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', hamstringAcc, ac)) },
          { exerciseName: n(slot('core_accessory', 'レッグレイズ', ac)), recommendedSets: 3, recommendedReps: '15', notes: t('腹筋アクセサリー', 'Core accessory'), recommendedWeight: exWeightDefault(tw, slot('core_accessory', 'レッグレイズ', ac)) },
        ],
      },
      {
        dayName: `${w}Day 3`,
        focus: n(benchJa),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 3, recommendedReps: reps, notes: mainNote, recommendedWeight: calcWeight(tw, benchJa, topPct) },
          ...(hasBBB ? [{ exerciseName: n(benchJa), recommendedSets: 5, recommendedReps: '10', notes: bbbNote, recommendedWeight: calcWeight(tw, benchJa, 0.50) }] : []),
          ...(hasDumbbell ? [{ exerciseName: n(slot('chest_accessory', 'ダンベルプレス', ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, slot('chest_accessory', 'ダンベルプレス', ac)) }] : []),
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('二頭筋アクセサリー', 'Bicep accessory'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
        ],
      },
      {
        dayName: `${w}Day 4`,
        focus: n(squatJa),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 3, recommendedReps: reps, notes: mainNote, recommendedWeight: calcWeight(tw, squatJa, topPct) },
          ...(hasBBB ? [{ exerciseName: n(squatJa), recommendedSets: 5, recommendedReps: '10', notes: bbbNote, recommendedWeight: calcWeight(tw, squatJa, 0.50) }] : []),
          ...(hasMachine ? [
            { exerciseName: n('レッグカール'), recommendedSets: 3, recommendedReps: '10-12', notes: t('ハムストリング', 'Hamstrings'), recommendedWeight: exWeightDefault(tw, 'レッグカール') },
            { exerciseName: n('スタンディングカーフレイズ'), recommendedSets: 4, recommendedReps: '15', notes: t('カーフ', 'Calves'), recommendedWeight: exWeightDefault(tw, 'スタンディングカーフレイズ') },
          ] : []),
        ],
      },
    );
  }

  return {
    title: t('Wendler 5/3/1 筋力向上プログラム', 'Wendler 5/3/1 Strength Program'),
    weeklyPlan: days,
    nutritionAdvice: t(
      '筋力向上が目標のため、体重×1.8-2.2gのタンパク質を確保しましょう。トレーニング日は炭水化物を多めに摂り、パフォーマンスを最大化してください。',
      'Aim for 1.8–2.2g protein per kg bodyweight. Increase carb intake on training days to maximize performance.',
    ),
    recoveryAdvice: t(
      '各メイン種目は週1回です。補助種目で追い込みすぎないよう注意してください。4週目はディロード週として重量を落としましょう。',
      'Each main lift is trained once per week. Avoid pushing accessory work to failure. Week 4 is a deload — reduce weights.',
    ),
  };
}
