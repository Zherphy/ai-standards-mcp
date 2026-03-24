import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectProject } from '../utils/detect-project.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

describe('detectProject', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'detect-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it('detects Go project from go.mod', () => {
    fs.writeFileSync(path.join(tmpDir, 'go.mod'), 'module my-go-project\n\ngo 1.21\n');
    const result = detectProject(tmpDir);
    expect(result.techStack).toBe('go');
    expect(result.projectName).toBe('my-go-project');
    expect(result.buildCmd).toBe('go build ./...');
    expect(result.testCmd).toBe('go test ./...');
  });

  it('detects Node project from package.json', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'package.json'),
      JSON.stringify({ name: 'my-node-project', version: '1.0.0' })
    );
    const result = detectProject(tmpDir);
    expect(result.techStack).toBe('node');
    expect(result.projectName).toBe('my-node-project');
    expect(result.buildCmd).toBe('npm run build');
    expect(result.testCmd).toBe('npm test');
  });

  it('detects Java project from pom.xml', () => {
    fs.writeFileSync(
      path.join(tmpDir, 'pom.xml'),
      '<project><artifactId>my-java-project</artifactId></project>'
    );
    const result = detectProject(tmpDir);
    expect(result.techStack).toBe('java');
    expect(result.projectName).toBe('my-java-project');
    expect(result.buildCmd).toBe('mvn clean install');
    expect(result.testCmd).toBe('mvn test');
  });

  it('returns unknown for unrecognized project', () => {
    const result = detectProject(tmpDir);
    expect(result.techStack).toBe('unknown');
    expect(result.projectName).toBe('unknown-project');
  });
});
