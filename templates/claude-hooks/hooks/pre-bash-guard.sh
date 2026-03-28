#!/bin/bash
# PreToolUse(Bash) Hook：git commit 前强制检查 code-review-validation 审查报告
# 部署位置：.claude/hooks/pre-bash-guard.sh
# 触发方式：Claude Code PreToolUse 事件，仅对 Bash 工具生效
#
# 逻辑：
#   - 命令不含 git commit → 直接放行（exit 0）
#   - 命令含 git commit，今日审查报告存在 → 放行（exit 0）
#   - 命令含 git commit，今日审查报告不存在 → 输出阻断信息 + exit 2
#
# exit 2 语义：Claude Code 将 stdout 反馈给 Agent，工具调用被阻断。

INPUT=$(cat)

# 用 Node.js 解析 JSON 提取 command 字段（优先），回退到 Python3
if command -v node &>/dev/null; then
    COMMAND=$(echo "$INPUT" | node -e \
      "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{
      try{const o=JSON.parse(d);console.log((o.tool_input||{}).command||'')}
      catch(e){console.log('')}
      })" 2>/dev/null)
elif command -v python3 &>/dev/null; then
    COMMAND=$(echo "$INPUT" | python3 -c \
      "import sys,json
data=json.load(sys.stdin)
cmd=data.get('tool_input',{}).get('command','')
print(cmd)" 2>/dev/null)
else
    # 降级：直接 grep JSON 字符串（不够精确，但比不检查强）
    COMMAND=$(echo "$INPUT" | grep -o '"command":"[^"]*"' | head -1 | sed 's/"command":"//;s/"//')
fi

# 只拦截含 git commit 的命令
if ! echo "$COMMAND" | grep -qE "git commit"; then
    exit 0
fi

TODAY=$(date +%Y%m%d)
REVIEW=$(ls .ai/reviews/review-*-${TODAY}.md 2>/dev/null | head -1)

if [ -n "$REVIEW" ]; then
    exit 0  # 审查报告存在，放行
fi

# 审查报告不存在，阻断并反馈给 Agent
echo "⛔ git commit 被拦截：今日尚未完成 code-review-validation"
echo ""
echo "缺失文件：.ai/reviews/review-*-${TODAY}.md"
echo ""
echo "请按以下步骤补做："
echo "  1. 确认 [TEST_CMD] 和 [LINT_CMD] 已通过"
echo "  2. 调用 superpowers:verification-before-completion"
echo "  3. 调用 code-review-validation 技能生成审查报告"
echo "  4. 重新执行 git commit"
exit 2
