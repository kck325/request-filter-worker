import { fetchFilteringRules, updateAggregatedStats } from './database';
import { logRequestData, fetchLoggedData } from './storage';
import { applyRulesToRequest } from './utils/ruleEngine';
import { log } from './utils/logger';

export class RequestFilterWorker {
  constructor(filterRulesDB, requestLogs) {
    this.filterRulesDB = filterRulesDB;
    this.requestLogs = requestLogs;
  }

  async handleRequest(request, ctx) {
    const rules = await fetchFilteringRules(this.filterRulesDB);
    const requestPasses = applyRulesToRequest(request, rules);

    if (requestPasses) {
      const response = await fetch(request);
      ctx.waitUntil(logRequestData(this.requestLogs, request, response));
      return response;
    } else {
      log('Request blocked', { url: request.url });
      return new Response('Request blocked', { status: 403 });
    }
  }

  async aggregateData(ctx) {
    const loggedData = await fetchLoggedData(this.requestLogs);
    const aggregatedStats = this.calculateAggregatedStats(loggedData);
    await updateAggregatedStats(this.filterRulesDB, aggregatedStats);
  }

  calculateAggregatedStats(loggedData) {
    // Implementation of aggregation logic
    // ...
  }
}