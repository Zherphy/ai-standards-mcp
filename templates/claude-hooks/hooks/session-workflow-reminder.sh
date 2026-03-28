#!/bin/bash
# SessionStart Hook：每轮会话开始时注入工作流强制检查点提醒
# 部署位置：.claude/hooks/session-workflow-reminder.sh
# 触发方式：Claude Code SessionStart 事件（每轮会话自动执行）

TODAY=$(date +%Y%m%d)
REVIEW=$(ls .ai/reviews/review-*-${TODAY}.md 2>/dev/null | head -1)

echo "## ⚠️ 工作流强制检查点"
echo "提交代码前必须按序执行："
echo "  1. [TEST_CMD] && [LINT_CMD]"
echo "  2. superpowers:verification-before-completion"
echo "  3. code-review-validation → 生成 .ai/reviews/review-*-${TODAY}.md"
echo "  4. git commit"
echo ""
if [ -n "$REVIEW" ]; then
    echo "✅ 今日审查报告已存在：$(basename $REVIEW)"
else
    echo "⏳ 今日审查报告尚未生成（步骤 3 未完成）"
fi
