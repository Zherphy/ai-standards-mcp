#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { initProject, formatInitResult } from './tools/init-project.js';
import { validateSetup, formatValidationResult } from './tools/validate-setup.js';
import { detectProject } from './utils/detect-project.js';

const server = new Server(
  {
    name: 'ai-standards-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'init_project',
        description: '初始化当前项目的 AI 开发规范，创建 CLAUDE.md、AGENTS.md、.ai/ 目录、Git Hooks。',
        inputSchema: {
          type: 'object',
          properties: {
            projectDir: {
              type: 'string',
              description: '目标项目根目录，默认使用当前工作目录',
            },
            projectName: {
              type: 'string',
              description: '项目名称（可从 go.mod/package.json 自动推断）',
            },
            techStack: {
              type: 'string',
              description: '技术栈：go / node / java / python',
              enum: ['go', 'node', 'java', 'python', 'unknown'],
            },
            buildCmd: {
              type: 'string',
              description: '构建命令（可选，按 techStack 推断）',
            },
            testCmd: {
              type: 'string',
              description: '测试命令（可选，按 techStack 推断）',
            },
            lintCmd: {
              type: 'string',
              description: '风格检查命令（可选）',
            },
            teamName: {
              type: 'string',
              description: '维护团队名称（可选，默认"项目开发组"）',
            },
          },
          required: [],
        },
      },
      {
        name: 'validate_setup',
        description: '检查当前项目的 AI 规范文件完整性，输出缺失项清单。',
        inputSchema: {
          type: 'object',
          properties: {
            projectDir: {
              type: 'string',
              description: '目标项目根目录，默认使用当前工作目录',
            },
          },
          required: [],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'init_project') {
    const projectDir = (args?.projectDir as string) ?? process.cwd();

    // Auto-detect project info if not provided
    const detected = detectProject(projectDir);
    const projectName = (args?.projectName as string) ?? detected.projectName;
    const techStack = (args?.techStack as string) ?? detected.techStack;
    const buildCmd = (args?.buildCmd as string) ?? detected.buildCmd;
    const testCmd = (args?.testCmd as string) ?? detected.testCmd;
    const lintCmd = (args?.lintCmd as string) ?? detected.lintCmd;
    const teamName = (args?.teamName as string) ?? '项目开发组';

    const result = await initProject({
      projectDir,
      projectName,
      techStack,
      buildCmd,
      testCmd,
      lintCmd,
      teamName,
    });

    return {
      content: [
        {
          type: 'text',
          text: formatInitResult(result),
        },
      ],
    };
  }

  if (name === 'validate_setup') {
    const projectDir = (args?.projectDir as string) ?? process.cwd();
    const result = validateSetup(projectDir);

    return {
      content: [
        {
          type: 'text',
          text: formatValidationResult(result),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err: unknown) => {
  console.error('MCP server error:', err);
  process.exit(1);
});
