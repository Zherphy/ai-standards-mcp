import * as fs from 'node:fs';
import * as path from 'node:path';

export interface ProjectInfo {
  projectName: string;
  techStack: string;
  buildCmd: string;
  testCmd: string;
  lintCmd: string;
}

export function detectProject(dir: string): ProjectInfo {
  // Try go.mod
  const goModPath = path.join(dir, 'go.mod');
  if (fs.existsSync(goModPath)) {
    const content = fs.readFileSync(goModPath, 'utf-8');
    const match = content.match(/^module\s+(\S+)/m);
    const moduleName = match ? match[1] : 'unknown-project';
    const projectName = moduleName.split('/').pop() ?? moduleName;
    return {
      projectName,
      techStack: 'go',
      buildCmd: 'go build ./...',
      testCmd: 'go test ./...',
      lintCmd: 'golangci-lint run',
    };
  }

  // Try package.json
  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    const pkg = JSON.parse(content) as { name?: string };
    return {
      projectName: pkg.name ?? 'unknown-project',
      techStack: 'node',
      buildCmd: 'npm run build',
      testCmd: 'npm test',
      lintCmd: 'npm run lint',
    };
  }

  // Try pom.xml
  const pomPath = path.join(dir, 'pom.xml');
  if (fs.existsSync(pomPath)) {
    const content = fs.readFileSync(pomPath, 'utf-8');
    const match = content.match(/<artifactId>([^<]+)<\/artifactId>/);
    return {
      projectName: match ? match[1] : 'unknown-project',
      techStack: 'java',
      buildCmd: 'mvn clean install',
      testCmd: 'mvn test',
      lintCmd: 'mvn checkstyle:check',
    };
  }

  // Unknown
  return {
    projectName: 'unknown-project',
    techStack: 'unknown',
    buildCmd: '',
    testCmd: '',
    lintCmd: '',
  };
}
