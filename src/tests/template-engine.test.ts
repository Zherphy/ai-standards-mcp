import { describe, it, expect } from 'vitest';
import { renderTemplate } from '../utils/template-engine.js';

describe('renderTemplate', () => {
  it('replaces a single placeholder', () => {
    const result = renderTemplate('Hello, [NAME]!', { NAME: 'World' });
    expect(result).toBe('Hello, World!');
  });

  it('replaces multiple different placeholders', () => {
    const result = renderTemplate('[PROJECT_NAME] by [TEAM_NAME]', {
      PROJECT_NAME: 'MyApp',
      TEAM_NAME: 'Dev Team',
    });
    expect(result).toBe('MyApp by Dev Team');
  });

  it('replaces repeated placeholders', () => {
    const result = renderTemplate('[NAME] and [NAME]', { NAME: 'Alice' });
    expect(result).toBe('Alice and Alice');
  });

  it('leaves unknown placeholders as-is', () => {
    const result = renderTemplate('[KNOWN] and [UNKNOWN]', { KNOWN: 'yes' });
    expect(result).toBe('yes and [UNKNOWN]');
  });

  it('returns template unchanged when no variables provided', () => {
    const result = renderTemplate('no placeholders here', {});
    expect(result).toBe('no placeholders here');
  });
});
