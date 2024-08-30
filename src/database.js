export async function fetchFilteringRules(db) {
    const { results } = await db.prepare('SELECT * FROM filtering_rules').all();
    return results;
  }
  
  export async function updateAggregatedStats(db, stats) {
    await db.prepare(
      'INSERT INTO aggregated_stats (timestamp, total_requests, status_counts) VALUES (?, ?, ?)'
    ).bind(stats.timestamp, stats.totalRequests, JSON.stringify(stats.statusCounts)).run();
  }