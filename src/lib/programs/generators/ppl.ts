import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift, slot } from '../helpers';

export function generatePPL(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale, accessoryChoices: ac } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasDumbbell = equipment.includes('dumbbell');
  const hasMachine  = equipment.includes('machine');
  const hasCable    = equipment.includes('cable');
  const hasChinning = equipment.includes('chinning');

  const benchJa   = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const pressJa   = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });
  const squatJa   = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const rdlJa     = mainLift(equipment, { barbell: 'ルーマニアンデッドリフト', dumbbell: 'ダンベルRDL', machine: 'レッグカール' });
  const deadJa    = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルロウ', machine: 'ラットプルダウン' });
  const rowJa     = mainLift(equipment, { barbell: 'バーベルロウ', dumbbell: 'ダンベルロウ', machine: 'ラットプルダウン', cable: 'ケーブルロウ' });
  const pullAcc   = hasChinning ? 'チンニング' : hasMachine ? 'ラットプルダウン' : hasCable ? 'ケーブルロウ' : 'ダンベルロウ';
  const curlAcc   = mainLift(equipment, { barbell: 'バーベルカール', dumbbell: 'ダンベルカール', cable: 'ケーブルカール' });
  const tricepAcc = hasCable ? 'ケーブルプッシュダウン' : 'トライセプスエクステンション';
  const calfJa    = hasDumbbell ? 'ダンベルカーフレイズ' : 'スタンディングカーフレイズ';

  return {
    title: t('PPL (Push/Pull/Legs) 6日間プログラム', 'PPL (Push/Pull/Legs) 6-Day Program'),
    weeklyPlan: [
      {
        dayName: 'Day 1',
        focus: t('Push（胸・肩・三頭）', 'Push (Chest/Shoulders/Triceps)'),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 4, recommendedReps: '5', notes: t('メイン種目: 高重量', 'Main lift: heavy weight'), recommendedWeight: calcWeight(tw, benchJa, 0.80) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('chest_accessory', 'ダンベルプレス', ac)), recommendedSets: 3, recommendedReps: '8-12', notes: t('可動域を意識', 'Focus on range of motion'), recommendedWeight: exWeightDefault(tw, slot('chest_accessory', 'ダンベルプレス', ac)) }] : []),
          { exerciseName: n(pressJa), recommendedSets: 3, recommendedReps: '8-12', notes: t('肩のメイン種目', 'Shoulder main lift'), recommendedWeight: calcWeight(tw, pressJa, 0.70) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 4, recommendedReps: '12-15', notes: t('三角筋中部', 'Medial deltoid'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
          { exerciseName: n(slot('tricep_accessory', tricepAcc, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('三頭筋', 'Triceps'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', tricepAcc, ac)) },
        ],
      },
      {
        dayName: 'Day 2',
        focus: t('Pull（背中・二頭）', 'Pull (Back/Biceps)'),
        exercises: [
          { exerciseName: n(deadJa), recommendedSets: 3, recommendedReps: '5', notes: t('メイン種目: 高重量', 'Main lift: heavy weight'), recommendedWeight: calcWeight(tw, deadJa, 0.80) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 4, recommendedReps: '8-12', notes: t('広背筋', 'Lats'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
          { exerciseName: n(rowJa), recommendedSets: 3, recommendedReps: '8-12', notes: t('背中の厚み', 'Back thickness'), recommendedWeight: exWeightDefault(tw, rowJa) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('bicep_accessory', 'ダンベルカール', ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('二頭筋', 'Biceps'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', 'ダンベルカール', ac)) }] : []),
          ...(hasCable ? [{ exerciseName: n(slot('bicep_accessory', 'ケーブルカール', ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('二頭筋仕上げ', 'Bicep finisher'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', 'ケーブルカール', ac)) }] : []),
        ],
      },
      {
        dayName: 'Day 3',
        focus: t('Legs（脚）', 'Legs'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 4, recommendedReps: '5', notes: t('メイン種目: 高重量', 'Main lift: heavy weight'), recommendedWeight: calcWeight(tw, squatJa, 0.80) },
          ...(hasMachine ? [{ exerciseName: n('レッグプレス'), recommendedSets: 3, recommendedReps: '8-12', notes: t('追加ボリューム', 'Additional volume'), recommendedWeight: calcWeight(tw, 'レッグプレス', 0.70) }] : []),
          { exerciseName: n(rdlJa), recommendedSets: 3, recommendedReps: '8-12', notes: t('ハムストリング', 'Hamstrings'), recommendedWeight: exWeightDefault(tw, rdlJa) },
          ...(hasMachine ? [
            { exerciseName: n(slot('hamstring_accessory', 'レッグカール', ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('ハム単独', 'Hamstring isolation'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', 'レッグカール', ac)) },
            { exerciseName: n('スタンディングカーフレイズ'), recommendedSets: 4, recommendedReps: '12-15', notes: t('カーフ', 'Calves'), recommendedWeight: exWeightDefault(tw, 'スタンディングカーフレイズ') },
          ] : []),
        ],
      },
      {
        dayName: 'Day 4',
        focus: t('Push（胸・肩・三頭）', 'Push (Chest/Shoulders/Triceps)'),
        exercises: [
          { exerciseName: n(pressJa), recommendedSets: 4, recommendedReps: '5', notes: t('メイン種目: 高重量', 'Main lift: heavy weight'), recommendedWeight: calcWeight(tw, pressJa, 0.80) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('chest_accessory', 'ダンベルプレス', ac)), recommendedSets: 3, recommendedReps: '8-12', notes: t('インクラインで実施推奨', 'Incline recommended'), recommendedWeight: exWeightDefault(tw, slot('chest_accessory', 'ダンベルプレス', ac)) }] : []),
          ...(hasCable ? [{ exerciseName: n('ケーブルフライ'), recommendedSets: 3, recommendedReps: '12-15', notes: t('胸のストレッチ', 'Chest stretch'), recommendedWeight: exWeightDefault(tw, 'ケーブルフライ') }] : []),
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 4, recommendedReps: '12-15', notes: t('三角筋中部', 'Medial deltoid'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
          { exerciseName: n(slot('tricep_accessory', hasCable ? 'ケーブルプッシュダウン' : hasDumbbell ? 'トライセプスエクステンション' : 'ディップス', ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('三頭筋', 'Triceps'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', hasCable ? 'ケーブルプッシュダウン' : hasDumbbell ? 'トライセプスエクステンション' : 'ディップス', ac)) },
        ],
      },
      {
        dayName: 'Day 5',
        focus: t('Pull（背中・二頭）', 'Pull (Back/Biceps)'),
        exercises: [
          { exerciseName: n(rowJa), recommendedSets: 4, recommendedReps: '8-12', notes: t('メイン種目', 'Main lift'), recommendedWeight: exWeightDefault(tw, rowJa) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 3, recommendedReps: '8-12', notes: t('広背筋', 'Lats'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
          ...(hasCable ? [{ exerciseName: n('ケーブルロウ'), recommendedSets: 3, recommendedReps: '10-12', notes: t('背中の厚み', 'Back thickness'), recommendedWeight: exWeightDefault(tw, 'ケーブルロウ') }] : []),
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('二頭筋', 'Biceps'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
          ...(hasChinning ? [{ exerciseName: n('チンニング（逆手）'), recommendedSets: 3, recommendedReps: t('限界まで', 'To failure'), notes: t('背中+二頭仕上げ', 'Back + bicep finisher'), recommendedWeight: exWeightDefault(tw, 'チンニング（逆手）') }] : []),
        ],
      },
      {
        dayName: 'Day 6',
        focus: t('Legs（脚）', 'Legs'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 3, recommendedReps: '8-12', notes: t('中重量・ハイレップ', 'Moderate weight, high reps'), recommendedWeight: calcWeight(tw, squatJa, 0.65) },
          { exerciseName: n(rdlJa), recommendedSets: 4, recommendedReps: '8-12', notes: t('ハムメイン', 'Hamstring focus'), recommendedWeight: calcWeight(tw, rdlJa, 0.60) },
          { exerciseName: n(hasDumbbell ? 'ブルガリアンスクワット' : 'レッグプレス'), recommendedSets: 3, recommendedReps: '10-12', notes: t('片脚ずつ', 'Unilateral'), recommendedWeight: hasDumbbell ? exWeightDefault(tw, 'ブルガリアンスクワット') : calcWeight(tw, 'レッグプレス', 0.65) },
          ...(hasMachine ? [{ exerciseName: n('レッグカール'), recommendedSets: 3, recommendedReps: '10-12', notes: t('ハム単独', 'Hamstring isolation'), recommendedWeight: exWeightDefault(tw, 'レッグカール') }] : []),
          { exerciseName: n(calfJa), recommendedSets: 4, recommendedReps: '15-20', notes: t('カーフ', 'Calves'), recommendedWeight: exWeightDefault(tw, calfJa) },
        ],
      },
    ],
    nutritionAdvice: t(
      '高頻度トレーニングのため、体重×2g以上のタンパク質と十分なカロリーが必要です。各食事でタンパク質を均等に分配しましょう。',
      'High-frequency training demands 2g+ protein per kg bodyweight and sufficient calories. Distribute protein evenly across meals.',
    ),
    recoveryAdvice: t(
      '週6日のため回復が重要です。睡眠を7-8時間確保し、ストレッチやフォームローラーを活用してください。疲労が蓄積したら1日余分に休みましょう。',
      'Training 6 days/week makes recovery critical. Ensure 7–8 hours of sleep and use stretching/foam rolling. Take an extra rest day if fatigue accumulates.',
    ),
  };
}
