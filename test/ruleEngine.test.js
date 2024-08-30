// test/ruleEngine.test.js

import { applyRulesToRequest } from '../src/utils/ruleEngine';

describe('Rule Engine', () => {
  test('blocks request when path matches block_path rule', () => {
    const request = new Request('https://example.com/admin');
    const rules = [{ type: 'block_path', value: '/admin' }];

    const result = applyRulesToRequest(request, rules);

    expect(result).toBe(false);
  });

  test('allows request when no rules are matched', () => {
    const request = new Request('https://example.com/public');
    const rules = [{ type: 'block_path', value: '/admin' }];

    const result = applyRulesToRequest(request, rules);

    expect(result).toBe(true);
  });

  test('blocks request when IP matches block_ip rule', () => {
    const request = new Request('https://example.com', {
      headers: { 'CF-Connecting-IP': '192.168.1.1' },
    });
    const rules = [{ type: 'block_ip', value: '192.168.1.1' }];

    const result = applyRulesToRequest(request, rules);

    expect(result).toBe(false);
  });

  test('blocks request when User-Agent matches block_user_agent rule', () => {
    const request = new Request('https://example.com', {
      headers: { 'User-Agent': 'BadBot/1.0' },
    });
    const rules = [{ type: 'block_user_agent', value: 'BadBot' }];

    const result = applyRulesToRequest(request, rules);

    expect(result).toBe(false);
  });

  // Add more tests as needed
});