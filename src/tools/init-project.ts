import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderTemplate } from '../utils/template-engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates');

export interface InitProjectOptions {
  projectDir: string;
  projectName: string;
  techStack: string;
  buildCmd: string;
  testCmd: string;
  lintCmd: string;
  teamName: string;
}

export interface InitProjectResult {
  created: string[];
  skipped: string[];
}

function copyTemplateFile(
  srcPath: string,
  destPath: string,
  variables: Record<string, string>,
  created: string[],
  skipped: string[],
  relPath: string,
): void {
  if (fs.existsSync(destPath)) {
    skipped.push(relPath);
    return;
  }

  const content = fs.readFileSync(srcPath, 'utf-8');
  const rendered = renderTemplate(content, variables);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, rendered, 'utf-8');
  created.push(relPath);
}

function walkDir(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

export async function initProject(options: InitProjectOptions): Promise<InitProjectResult> {
  const { projectDir, projectName, techStack, buildCmd, testCmd, lintCmd, teamName } = options;
  const today = new Date().toISOString().slice(0, 10);

  const variables: Record<string, string> = {
    PROJECT_NAME: projectName,
    TECH_STACK: techStack,
    BUILD_CMD: buildCmd,
    TEST_CMD: testCmd,
    LINT_CMD: lintCmd,
    TEAM_NAME: teamName,
    LAST_UPDATED: today,
    CREATED_DATE: today,
  };

  const created: string[] = [];
  const skipped: string[] = [];

  // Process .tpl files -> strip .tpl extension
  const claudeTplSrc = path.join(TEMPLATES_DIR, 'CLAUDE.md.tpl');
  const claudeDest = path.join(projectDir, 'CLAUDE.md');
  copyTemplateFile(claudeTplSrc, claudeDest, variables, created, skipped, 'CLAUDE.md');

  const agentsTplSrc = path.join(TEMPLATES_DIR, 'AGENTS.md.tpl');
  const agentsDest = path.join(projectDir, 'AGENTS.md');
  copyTemplateFile(agentsTplSrc, agentsDest, variables, created, skipped, 'AGENTS.md');

  // Copy skills
  const skillsTemplateDir = path.join(TEMPLATES_DIR, 'skills');
  for (const srcFile of walkDir(skillsTemplateDir)) {
    const relToSkills = path.relative(skillsTemplateDir, srcFile);
    const destFile = path.join(projectDir, '.ai', 'skills', relToSkills);
    const relPath = path.join('.ai/skills', relToSkills).replace(/\\/g, '/');
    copyTemplateFile(srcFile, destFile, variables, created, skipped, relPath);
  }

  // Copy git hooks
  const hooksTemplateDir = path.join(TEMPLATES_DIR, 'githooks');
  for (const srcFile of walkDir(hooksTemplateDir)) {
    const relToHooks = path.relative(hooksTemplateDir, srcFile);
    const destFile = path.join(projectDir, '.githooks', relToHooks);
    const relPath = path.join('.githooks', relToHooks).replace(/\\/g, '/');
    copyTemplateFile(srcFile, destFile, variables, created, skipped, relPath);
  }

  return { created, skipped };
}

export function formatInitResult(result: InitProjectResult): string {
  const lines: string[] = [];
  const total = result.created.length;

  lines.push(`✅ 初始化完成，已创建 ${total} 个文件：`);
  for (const f of result.created) {
    lines.push(`  - ${f}`);
  }

  if (result.skipped.length > 0) {
    lines.push('⚠️  以下文件已存在，已跳过：');
    for (const f of result.skipped) {
      lines.push(`  - ${f}`);
    }
  }

  lines.push('');
  lines.push('下一步：补充 CLAUDE.md 中的项目架构描述部分');

  return lines.join('\n');
}
