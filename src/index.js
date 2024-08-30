import { RequestFilterWorker } from './worker';

export default {
  async fetch(request, env, ctx) {
    const worker = new RequestFilterWorker(env.FILTER_RULES_DB, env.REQUEST_LOGS);
    return worker.handleRequest(request, ctx);
  },

  async scheduled(event, env, ctx) {
    const worker = new RequestFilterWorker(env.FILTER_RULES_DB, env.REQUEST_LOGS);
    await worker.aggregateData(ctx);
  },
};