
import { Character, RoleId } from '../types';

export type CheckResult = 'CRITICAL_SUCCESS' | 'SUCCESS' | 'FAILURE' | 'CRITICAL_FAILURE';

export interface RollOutcome {
  roleId: RoleId;
  skillName: string;
  difficulty: number;
  roll: number;
  modifier: number;
  total: number;
  result: CheckResult;
}

// 模拟《极乐迪斯科》的 2d6 掷骰系统
export const performSkillCheck = (character: Character, difficulty: number = 8): RollOutcome => {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;
  const roll = die1 + die2;
  
  // 修正值：等级越高，修正越高
  const modifier = (character.level - 1) * 2;
  const total = roll + modifier;

  let result: CheckResult = 'FAILURE';
  
  // 大成功/大失败判定
  if (die1 === 6 && die2 === 6) result = 'CRITICAL_SUCCESS';
  else if (die1 === 1 && die2 === 1) result = 'CRITICAL_FAILURE';
  else if (total >= difficulty) result = 'SUCCESS';
  else result = 'FAILURE';

  return {
    roleId: character.id,
    skillName: character.skillType.split(' / ')[1],
    difficulty,
    roll,
    modifier,
    total,
    result
  };
};

// 决定当前谁该出来进行“判定”
export const selectCheckCharacters = (characters: Record<string, Character>, count: number = 1): Character[] => {
  const charArray = Object.values(characters);
  // 按照等级权重进行加权随机选择，或者简单随机
  return charArray.sort(() => Math.random() - 0.5).slice(0, count);
};
