import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateSetup } from '../tools/validate-setup.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('validateSetup', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('reports all missing files when project is empty', () => {
    const result = validateSetup(tmpDir);
    expect(result.missing.length).toBeGreaterThan(0);
    expect(result.missing).toContain('CLAUDE.md');
    expect(result.missing).toContain('AGENTS.md');
    expect(result.missing).toContain('.githooks/pre-commit');
    expect(result.passed).toBe(false);
  });

  it('reports present files correctly', () => {
    // Create CLAUDE.md only
    fs.writeFileSync(path.join(tmpDir, 'CLAUDE.md'), '# CLAUDE');
    const result = validateSetup(tmpDir);
    expect(result.present).toContain('CLAUDE.md');
    expect(result.missing).toContain('AGENTS.md');
  });

  it('passes when all required files exist', () => {
    // Create all required files
    const requiredFiles = [
      'CLAUDE.md',
      'AGENTS.md',
      '.ai/skills/task-prompt-generator/skill.md',
      '.ai/skills/code-review-validation/skill.md',
      '.ai/skills/workflow-enforcer/skill.md',
      '.ai/skills/project-init/skill.md',
      '.ai/skills/code-style-constraints/skill.md',
      '.ai/skills/index.json',
      '.ai/agents/roles/code-implementer.md',
      '.ai/agents/roles/code-reviewer.md',
      '.ai/agents/roles/debugger.md',
      '.ai/agents/roles/test-writer.md',
      '.ai/prompts/WORKFLOW_ENFORCEMENT_GUIDE.md',
      '.ai/workflow/checklists/tdd-process.md',
      '.githooks/pre-commit',
      '.githooks/pre-push',
      '.githooks/commit-msg',
      '.githooks/post-merge',
      '.claude/settings.json',
      '.claude/hooks/session-workflow-reminder.sh',
      '.claude/hooks/pre-bash-guard.sh',
    ];
    for (const file of requiredFiles) {
      const fullPath = path.join(tmpDir, file);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, 'content');
    }
    const result = validateSetup(tmpDir);
    expect(result.missing).toHaveLength(0);
    expect(result.passed).toBe(true);
  });
});
