import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift, slot } from '../helpers';

export function generateGZCL(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale, accessoryChoices: ac } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasDumbbell = equipment.includes('dumbbell');
  const hasMachine  = equipment.includes('machine');
  const hasCable    = equipment.includes('cable');

  const squatJa = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const benchJa = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const deadJa  = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルRDL' });
  const pressJa = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const t1Note  = t('T1: 高重量。1RMの85-90%', 'T1: Heavy, 85–90% 1RM');

  const hamAcc     = mainLift(equipment, { barbell: 'ルーマニアンデッドリフト', dumbbell: 'ダンベルRDL', machine: 'レッグカール' });
  const curlAcc   = hasDumbbell ? 'ダンベルカール' : hasCable ? 'ケーブルカール' : 'バーベルカール';
  const pullAcc   = hasMachine ? 'ラットプルダウン' : hasCable ? 'ケーブルロウ' : hasDumbbell ? 'ダンベルロウ' : 'チンニング';
  const tricAcc   = hasCable ? 'ケーブルプッシュダウン' : 'ディップス';
  const t2TricAcc = mainLift(equipment, { barbell: 'クローズグリップベンチ', dumbbell: 'トライセプスエクステンション', cable: 'ケーブルプッシュダウン' });

  return {
    title: t('GZCL 3層構造ストレングスプログラム', 'GZCL 3-Tier Strength Program'),
    weeklyPlan: [
      {
        dayName: 'Day 1',
        focus: t('スクワット日', 'Squat Day'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 5, recommendedReps: '3', notes: t1Note, recommendedWeight: calcWeight(tw, squatJa, 0.875) },
          { exerciseName: n(hamAcc), recommendedSets: 3, recommendedReps: '10', notes: t('T2: 中重量・中レップ', 'T2: Moderate weight & reps'), recommendedWeight: exWeightDefault(tw, hamAcc) },
          ...(hasMachine ? [{ exerciseName: n(slot('hamstring_accessory', 'レッグカール', ac)), recommendedSets: 3, recommendedReps: '15', notes: t('T3: 軽重量・高レップ', 'T3: Light weight, high reps'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', 'レッグカール', ac)) }] : []),
          { exerciseName: n(hasDumbbell ? 'ダンベルカーフレイズ' : 'スタンディングカーフレイズ'), recommendedSets: 3, recommendedReps: '15', notes: t('T3: カーフ', 'T3: Calves'), recommendedWeight: exWeightDefault(tw, hasDumbbell ? 'ダンベルカーフレイズ' : 'スタンディングカーフレイズ') },
        ],
      },
      {
        dayName: 'Day 2',
        focus: t('ベンチプレス日', 'Bench Day'),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 5, recommendedReps: '3', notes: t1Note, recommendedWeight: calcWeight(tw, benchJa, 0.875) },
          { exerciseName: n(t2TricAcc), recommendedSets: 3, recommendedReps: '10', notes: t('T2: 三頭筋強化', 'T2: Tricep strength'), recommendedWeight: exWeightDefault(tw, t2TricAcc) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 3, recommendedReps: '15', notes: t('T3: 肩', 'T3: Shoulders'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 3, recommendedReps: '15', notes: t('T3: 二頭筋', 'T3: Biceps'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
        ],
      },
      {
        dayName: 'Day 3',
        focus: t('デッドリフト日', 'Deadlift Day'),
        exercises: [
          { exerciseName: n(deadJa), recommendedSets: 5, recommendedReps: '3', notes: t1Note, recommendedWeight: calcWeight(tw, deadJa, 0.875) },
          { exerciseName: n(mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' })), recommendedSets: 3, recommendedReps: '10', notes: t('T2: スクワット軽め', 'T2: Light squat'), recommendedWeight: calcWeight(tw, squatJa, 0.65) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 3, recommendedReps: '15', notes: t('T3: 背中', 'T3: Back'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
          { exerciseName: n(slot('core_accessory', 'レッグレイズ', ac)), recommendedSets: 3, recommendedReps: '15', notes: t('T3: 腹筋', 'T3: Core'), recommendedWeight: exWeightDefault(tw, slot('core_accessory', 'レッグレイズ', ac)) },
        ],
      },
      {
        dayName: 'Day 4',
        focus: t('ショルダープレス日', 'OHP Day'),
        exercises: [
          { exerciseName: n(pressJa), recommendedSets: 5, recommendedReps: '3', notes: t1Note, recommendedWeight: calcWeight(tw, pressJa, 0.875) },
          { exerciseName: n(benchJa), recommendedSets: 3, recommendedReps: '10', notes: t('T2: ベンチ軽め', 'T2: Light bench'), recommendedWeight: calcWeight(tw, benchJa, 0.65) },
          ...(hasCable ? [{ exerciseName: n('ケーブルフライ'), recommendedSets: 3, recommendedReps: '15', notes: t('T3: 胸仕上げ', 'T3: Chest finisher'), recommendedWeight: exWeightDefault(tw, 'ケーブルフライ') }] : []),
          { exerciseName: n(slot('tricep_accessory', tricAcc, ac)), recommendedSets: 3, recommendedReps: '15', notes: t('T3: 三頭筋', 'T3: Triceps'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', tricAcc, ac)) },
        ],
      },
    ],
    nutritionAdvice: t(
      '筋力と筋量の両方を狙うプログラムです。体重×2gのタンパク質を確保し、トレーニング日はカロリーを多めに摂りましょう。',
      'This program targets both strength and muscle size. Hit 2g protein per kg bodyweight and eat more calories on training days.',
    ),
    recoveryAdvice: t(
      'T1（高重量低レップ）で無理をしないでください。T3（高レップ）は追い込んでOKです。4-6週ごとにディロード週を入れましょう。',
      "Don't push T1 (heavy, low-rep) to failure. T3 (high-rep) can be pushed harder. Insert a deload week every 4–6 weeks.",
    ),
  };
}
