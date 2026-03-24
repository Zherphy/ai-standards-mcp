import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initProject } from '../tools/init-project.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('initProject', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'init-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('creates CLAUDE.md with rendered placeholders', async () => {
    const result = await initProject({
      projectDir: tmpDir,
      projectName: 'TestProject',
      techStack: 'go',
      buildCmd: 'go build ./...',
      testCmd: 'go test ./...',
      lintCmd: 'golangci-lint run',
      teamName: 'Test Team',
    });

    const claudeMdPath = path.join(tmpDir, 'CLAUDE.md');
    expect(fs.existsSync(claudeMdPath)).toBe(true);
    const content = fs.readFileSync(claudeMdPath, 'utf-8');
    expect(content).toContain('TestProject');
    expect(content).toContain('go build ./...');
    expect(content).not.toContain('[PROJECT_NAME]');
    expect(result.created).toContain('CLAUDE.md');
  });

  it('creates all skill files', async () => {
    await initProject({
      projectDir: tmpDir,
      projectName: 'TestProject',
      techStack: 'node',
      buildCmd: 'npm run build',
      testCmd: 'npm test',
      lintCmd: 'npm run lint',
      teamName: 'Dev Team',
    });

    expect(fs.existsSync(path.join(tmpDir, '.ai/skills/task-prompt-generator/skill.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, '.ai/skills/code-review-validation/skill.md'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, '.ai/skills/workflow-enforcer/skill.md'))).toBe(true);
  });

  it('skips existing files without overwriting', async () => {
    const claudeMdPath = path.join(tmpDir, 'CLAUDE.md');
    fs.writeFileSync(claudeMdPath, 'original content');

    const result = await initProject({
      projectDir: tmpDir,
      projectName: 'TestProject',
      techStack: 'go',
      buildCmd: 'go build ./...',
      testCmd: 'go test ./...',
      lintCmd: 'golangci-lint run',
      teamName: 'Dev Team',
    });

    expect(fs.readFileSync(claudeMdPath, 'utf-8')).toBe('original content');
    expect(result.skipped).toContain('CLAUDE.md');
  });

  it('creates git hook files', async () => {
    await initProject({
      projectDir: tmpDir,
      projectName: 'TestProject',
      techStack: 'go',
      buildCmd: 'go build ./...',
      testCmd: 'go test ./...',
      lintCmd: 'golangci-lint run',
      teamName: 'Dev Team',
    });

    expect(fs.existsSync(path.join(tmpDir, '.githooks/pre-commit'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, '.githooks/pre-push'))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, '.githooks/commit-msg'))).toBe(true);
  });
});
