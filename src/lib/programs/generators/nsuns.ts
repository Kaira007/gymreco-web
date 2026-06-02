import type { GeneratedProgram, GeneratorInput } from '../types';
import { makeT, makeName, calcWeight, exWeightDefault, mainLift, slot } from '../helpers';

export function generateNSuns(input: GeneratorInput): GeneratedProgram {
  const { targetWeights: tw, equipment, locale, accessoryChoices: ac } = input;
  const t = makeT(locale);
  const n = makeName(locale);

  const hasDumbbell = equipment.includes('dumbbell');
  const hasMachine  = equipment.includes('machine');
  const hasCable    = equipment.includes('cable');

  const benchJa = mainLift(equipment, { barbell: 'ベンチプレス', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' });
  const squatJa = mainLift(equipment, { barbell: 'スクワット', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' });
  const deadJa  = mainLift(equipment, { barbell: 'デッドリフト', dumbbell: 'ダンベルRDL' });
  const pressJa = mainLift(equipment, { barbell: 'ショルダープレス', dumbbell: 'ダンベルショルダープレス' });

  const t1Note  = t('T1: 8セット+AMRAP。75/85/95/90/85/80/75/70/65%', 'T1: 8 sets+AMRAP. 75/85/95/90/85/80/75/70/65%');
  const t2Note  = t('T2: 補助リフト', 'T2: Supplemental lift');
  const varRep  = t('変動', 'Variable');

  const curlAcc = hasDumbbell ? 'ダンベルカール' : hasCable ? 'ケーブルカール' : 'バーベルカール';
  const pullAcc = hasMachine ? 'ラットプルダウン' : hasDumbbell ? 'ダンベルロウ' : 'チンニング';
  const tricAcc = hasCable ? 'ケーブルプッシュダウン' : 'ディップス';

  return {
    title: t('nSuns 5/3/1 高ボリュームプログラム', 'nSuns 5/3/1 High Volume Program'),
    weeklyPlan: [
      {
        dayName: 'Day 1',
        focus: t('ベンチ + ショルダープレス', 'Bench + OHP'),
        exercises: [
          { exerciseName: n(benchJa), recommendedSets: 9, recommendedReps: varRep, notes: t1Note, recommendedWeight: calcWeight(tw, benchJa, 0.90 * 0.85) },
          { exerciseName: n(pressJa), recommendedSets: 8, recommendedReps: varRep, notes: t2Note, recommendedWeight: calcWeight(tw, pressJa, 0.90 * 0.70) },
          ...(hasDumbbell ? [{ exerciseName: n(slot('shoulder_accessory', 'サイドレイズ', ac)), recommendedSets: 4, recommendedReps: '12-15', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, slot('shoulder_accessory', 'サイドレイズ', ac)) }] : []),
        ],
      },
      {
        dayName: 'Day 2',
        focus: t('スクワット + デッドリフト', 'Squat + Deadlift'),
        exercises: [
          { exerciseName: n(squatJa), recommendedSets: 9, recommendedReps: varRep, notes: t1Note, recommendedWeight: calcWeight(tw, squatJa, 0.90 * 0.85) },
          { exerciseName: n(mainLift(equipment, { barbell: 'デッドリフト（スモウ）', dumbbell: 'ダンベルRDL', machine: 'レッグカール' })), recommendedSets: 8, recommendedReps: varRep, notes: t2Note, recommendedWeight: calcWeight(tw, deadJa, 0.90 * 0.70) },
          ...(hasMachine ? [{ exerciseName: n(slot('hamstring_accessory', 'レッグカール', ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, slot('hamstring_accessory', 'レッグカール', ac)) }] : []),
        ],
      },
      {
        dayName: 'Day 3',
        focus: t('ショルダープレス + ベンチ', 'OHP + Bench'),
        exercises: [
          { exerciseName: n(pressJa), recommendedSets: 9, recommendedReps: varRep, notes: t1Note, recommendedWeight: calcWeight(tw, pressJa, 0.90 * 0.85) },
          { exerciseName: n(mainLift(equipment, { barbell: 'ベンチプレス（クローズ）', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' })), recommendedSets: 8, recommendedReps: varRep, notes: t2Note, recommendedWeight: calcWeight(tw, benchJa, 0.90 * 0.70) },
          { exerciseName: n(slot('bicep_accessory', curlAcc, ac)), recommendedSets: 4, recommendedReps: '10-12', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, slot('bicep_accessory', curlAcc, ac)) },
        ],
      },
      {
        dayName: 'Day 4',
        focus: t('デッドリフト + スクワット', 'Deadlift + Squat'),
        exercises: [
          { exerciseName: n(deadJa), recommendedSets: 9, recommendedReps: varRep, notes: t1Note, recommendedWeight: calcWeight(tw, deadJa, 0.90 * 0.85) },
          { exerciseName: n(mainLift(equipment, { barbell: 'スクワット（フロント）', dumbbell: 'ダンベルスクワット', machine: 'レッグプレス' })), recommendedSets: 8, recommendedReps: varRep, notes: t2Note, recommendedWeight: calcWeight(tw, squatJa, 0.90 * 0.70) },
          { exerciseName: n(slot('pull_accessory', pullAcc, ac)), recommendedSets: 4, recommendedReps: '8-12', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, slot('pull_accessory', pullAcc, ac)) },
        ],
      },
      {
        dayName: 'Day 5',
        focus: t('ベンチプレス + ショルダープレス', 'Bench + OHP'),
        exercises: [
          { exerciseName: n(mainLift(equipment, { barbell: 'ベンチプレス（インクライン）', dumbbell: 'ダンベルプレス', machine: 'チェストプレス' })), recommendedSets: 9, recommendedReps: varRep, notes: t1Note, recommendedWeight: calcWeight(tw, benchJa, 0.90 * 0.85) },
          { exerciseName: n(pressJa), recommendedSets: 8, recommendedReps: varRep, notes: t2Note, recommendedWeight: calcWeight(tw, pressJa, 0.90 * 0.70) },
          ...(hasCable ? [{ exerciseName: n('ケーブルフライ'), recommendedSets: 3, recommendedReps: '12-15', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, 'ケーブルフライ') }] : []),
          { exerciseName: n(slot('tricep_accessory', tricAcc, ac)), recommendedSets: 3, recommendedReps: '10-12', notes: t('アクセサリー', 'Accessory'), recommendedWeight: exWeightDefault(tw, slot('tricep_accessory', tricAcc, ac)) },
        ],
      },
    ],
    nutritionAdvice: t(
      '非常に高ボリュームのため、体重×2.2g以上のタンパク質と体重×5-7gの炭水化物を目安にしてください。トレーニング中のドリンクにBCAAやカーボを入れるのも有効です。',
      'Extremely high volume demands 2.2g+ protein and 5–7g carbs per kg bodyweight. Adding BCAAs or carbs to your intra-workout drink is beneficial.',
    ),
    recoveryAdvice: t(
      'セット数が多いため1回のトレーニングが長くなります。時間がない日はアクセサリー種目を減らしてOKです。十分な睡眠と水分補給を心がけてください。',
      'High set counts make sessions long. Feel free to cut accessory work on tight days. Prioritize adequate sleep and hydration.',
    ),
  };
}
