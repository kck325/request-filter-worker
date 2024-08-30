// src/utils/ruleEngine.js

export function applyRulesToRequest(request, rules) {
    const url = new URL(request.url);
    
    for (const rule of rules) {
      switch (rule.type) {
        case 'block_path':
          if (url.pathname.startsWith(rule.value)) {
            return false;
          }
          break;
        case 'block_ip':
          // Assuming the client IP is available in the request object
          if (request.headers.get('CF-Connecting-IP') === rule.value) {
            return false;
          }
          break;
        case 'block_user_agent':
          if (request.headers.get('User-Agent')?.includes(rule.value)) {
            return false;
          }
          break;
        // Add more rule types as needed
      }
    }
    
    return true;
  }