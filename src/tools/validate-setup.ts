import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ValidationResult {
  present: string[];
  missing: string[];
  passed: boolean;
}

const REQUIRED_FILES = [
  'CLAUDE.md',
  'AGENTS.md',
  '.ai/skills/task-prompt-generator/skill.md',
  '.ai/skills/code-review-validation/skill.md',
  '.ai/skills/workflow-enforcer/skill.md',
  '.githooks/pre-commit',
  '.githooks/pre-push',
  '.githooks/commit-msg',
];

export function validateSetup(dir: string): ValidationResult {
  const present: string[] = [];
  const missing: string[] = [];

  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
      present.push(file);
    } else {
      missing.push(file);
    }
  }

  return {
    present,
    missing,
    passed: missing.length === 0,
  };
}

export function formatValidationResult(result: ValidationResult): string {
  const lines: string[] = [];

  for (const file of result.present) {
    lines.push(`✅ ${file.padEnd(45)} 存在`);
  }
  for (const file of result.missing) {
    lines.push(`❌ ${file.padEnd(45)} 缺失`);
  }

  lines.push('');
  if (result.passed) {
    lines.push('✅ 所有检查项均通过，项目 AI 开发规范配置完整。');
  } else {
    lines.push(`发现 ${result.missing.length} 项问题，建议重新运行 init_project 修复。`);
  }

  return lines.join('\n');
}
