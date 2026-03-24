export function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\[([A-Z_]+)\]/g, (match, key) => {
    return key in variables ? variables[key] : match;
  });
}
