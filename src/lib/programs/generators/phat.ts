import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift, slot } from '../helpers';

export function generatePHAT(input: GeneratorInput): GeneratedProgram {
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
    title: t('PHAT パワー肥大適応トレーニング', 'PHAT Power Hypertrophy Adaptive Training'),
    weeklyPlan: [
      {
        dayName: 'Day 1',
        focus: t('Upper Body Power（上半身パワー）', 'Upper Body Power'),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 3, recommendedReps: '3-5', notes: t('パワーセット。高重量で神経系を刺激', 'Power sets. Heavy load to stimulate nervous system'), recommendedWeight: calcWeight(tw, benchJa, 0.87) },
          { exerciseName: n(rowJa), recommendedSets: 3, recommendedReps: '3-5', notes: t('背中のパワー', 'Back power'), recommendedWeight: exWeightDefault(tw, rowJa) },
          { exerciseName: n(pressJa), recommendedSets: 2, recommendedReps: '6-10', notes: t('補助パワー', 'Supplemental power'), recommendedWeight: calcWeight(tw, pressJa, 0.78) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 2, recommendedReps: '6-10', notes: t('広背筋', 'Lats'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 3, recommendedReps: '6-10', notes: t('二頭筋', 'Biceps'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
          { exerciseName: n(slot('tricep_accessory', tricAcc, ac)), recommendedSets: 3, recommendedReps: '6-10', notes: t('三頭筋', 'Triceps'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', tricAcc, ac)) },
        ],
      },
      {
        dayName: 'Day 2',
        focus: t('Lower Body Power（下半身パワー）', 'Lower Body Power'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 3, recommendedReps: '3-5', notes: t('パワーセット。高重量', 'Power sets. Heavy weight'), recommendedWeight: calcWeight(tw, squatJa, 0.87) },
          { exerciseName: n(deadJa),  recommendedSets: 3, recommendedReps: '3-5', notes: t('デッドのパワー', 'Deadlift power'), recommendedWeight: calcWeight(tw, deadJa, 0.87) },
          ...(hasMachine ? [
            { exerciseName: n('レッグプレス'), recommendedSets: 2, recommendedReps: '6-10', notes: t('追加ボリューム', 'Additional volume'), recommendedWeight: calcWeight(tw, 'レッグプレス', 0.70) },
            { exerciseName: n(slot('hamstring_accessory', 'レッグカール', ac)), recommendedSets: 2, recommendedReps: '6-10', notes: t('ハムストリング', 'Hamstrings'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', 'レッグカール', ac)) },
          ] : []),
          { exerciseName: n(calfJa), recommendedSets: 3, recommendedReps: '6-10', notes: t('カーフ', 'Calves'), recommendedWeight: exWeightDefault(tw, calfJa) },
        ],
      },
      {
        dayName: 'Day 3',
        focus: t('Back & Shoulders Hypertrophy（背中・肩肥大）', 'Back & Shoulders Hypertrophy'),
        exercises: [
          { exerciseName: n(rowJa), recommendedSets: 3, recommendedReps: '8-12', notes: t('スピードセット6レップ+ハイレップ', 'Speed set 6 reps + high reps'), recommendedWeight: exWeightDefault(tw, rowJa) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 3, recommendedReps: '8-12', notes: t('広背筋の幅', 'Lat width'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
          ...(hasCable ? [{ exerciseName: n('ケーブルロウ'), recommendedSets: 3, recommendedReps: '12-15', notes: t('背中の厚み', 'Back thickness'), recommendedWeight: exWeightDefault(tw, 'ケーブルロウ') }] : []),
          { exerciseName: n(hasDumbbell ? 'ダンベルショルダープレス' : 'ショルダープレス'), recommendedSets: 3, recommendedReps: '8-12', notes: t('肩プレス', 'Shoulder press'), recommendedWeight: calcWeight(tw, pressJa, 0.65) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 3, recommendedReps: '12-20', notes: t('肩幅', 'Shoulder width'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
        ],
      },
      {
        dayName: 'Day 4',
        focus: t('Legs Hypertrophy（脚肥大）', 'Legs Hypertrophy'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 3, recommendedReps: '8-12', notes: t('スピードセット6レップ+ハイレップ', 'Speed set 6 reps + high reps'), recommendedWeight: calcWeight(tw, squatJa, 0.65) },
          { exerciseName: n(rdlJa),   recommendedSets: 3, recommendedReps: '8-12', notes: t('ハムストリング', 'Hamstrings'), recommendedWeight: exWeightDefault(tw, rdlJa) },
          { exerciseName: n(hasDumbbell ? 'ブルガリアンスクワット' : 'レッグプレス'), recommendedSets: 3, recommendedReps: '12-15', notes: t('片脚種目', 'Unilateral exercise'), recommendedWeight: hasDumbbell ? exWeightDefault(tw, 'ブルガリアンスクワット') : calcWeight(tw, 'レッグプレス', 0.65) },
          ...(hasMachine ? [{ exerciseName: n(slot('hamstring_accessory', 'レッグカール', ac)), recommendedSets: 3, recommendedReps: '12-15', notes: t('ハム単独', 'Hamstring isolation'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', 'レッグカール', ac)) }] : []),
          { exerciseName: n(calfJa), recommendedSets: 4, recommendedReps: '15-20', notes: t('カーフ', 'Calves'), recommendedWeight: exWeightDefault(tw, calfJa) },
        ],
      },
      {
        dayName: 'Day 5',
        focus: t('Chest & Arms Hypertrophy（胸・腕肥大）', 'Chest & Arms Hypertrophy'),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 3, recommendedReps: '8-12', notes: t('スピードセット6レップ+ハイレップ', 'Speed set 6 reps + high reps'), recommendedWeight: calcWeight(tw, benchJa, 0.65) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('chest_accessory', 'ダンベルプレス', ac)), recommendedSets: 3, recommendedReps: '8-12', notes: t('インクライン推奨', 'Incline recommended'), recommendedWeight: exWeightDefault(tw, slot('chest_accessory', 'ダンベルプレス', ac)) }] : []),
          ...(hasCable ? [{ exerciseName: n('ケーブルフライ'), recommendedSets: 3, recommendedReps: '12-15', notes: t('胸の仕上げ', 'Chest finisher'), recommendedWeight: exWeightDefault(tw, 'ケーブルフライ') }] : []),
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 3, recommendedReps: '12-15', notes: t('二頭筋肥大', 'Bicep hypertrophy'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
          { exerciseName: n(slot('tricep_accessory', hasCable ? 'ケーブルプッシュダウン' : 'ディップス', ac)), recommendedSets: 3, recommendedReps: '12-15', notes: t('三頭筋肥大', 'Tricep hypertrophy'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', hasCable ? 'ケーブルプッシュダウン' : 'ディップス', ac)) },
        ],
      },
    ],
    nutritionAdvice: t(
      'Layne Norton考案の高頻度プログラムです。体重×2.2g以上のタンパク質を確保し、カロリーはメンテナンス+500kcalが推奨です。パワー日前は炭水化物を特に多めに摂りましょう。',
      "Layne Norton's high-frequency program. Aim for 2.2g+ protein per kg and maintenance +500 kcal. Load up on carbs the day before power days.",
    ),
    recoveryAdvice: t(
      '週5日のハードなプログラムのため、回復が鍵です。パワー日と肥大日の間にスピードセット（肥大日の最初の種目で軽重量×高速）を入れることで神経系と筋肥大の両方を刺激します。睡眠7-8時間を確保してください。',
      'Recovery is key in this demanding 5-day program. Speed sets (light weight, fast reps on the first hypertrophy-day exercise) stimulate both the nervous system and hypertrophy. Ensure 7–8 hours of sleep.',
    ),
  };
}
