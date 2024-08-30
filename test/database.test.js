// test/database.test.js

import { fetchFilteringRules, updateAggregatedStats } from '../src/database';
import { jest } from '@jest/globals';

describe('Database operations', () => {
  let mockDB;

  beforeEach(() => {
    mockDB = {
      prepare: jest.fn().mockReturnThis(),
      all: jest.fn().mockResolvedValue({ results: [] }),
      bind: jest.fn().mockReturnThis(),
      run: jest.fn().mockResolvedValue({}),
    };
  });

  test('fetchFilteringRules returns rules from database', async () => {
    const mockRules = [{ id: 1, type: 'block_path', value: '/admin' }];
    mockDB.all.mockResolvedValue({ results: mockRules });

    const rules = await fetchFilteringRules(mockDB);

    expect(rules).toEqual(mockRules);
    expect(mockDB.prepare).toHaveBeenCalledWith('SELECT * FROM filtering_rules');
  });

  test('updateAggregatedStats inserts stats into database', async () => {
    const mockStats = {
      timestamp: '2023-05-01T00:00:00Z',
      totalRequests: 100,
      statusCounts: { 200: 90, 404: 10 },
    };

    await updateAggregatedStats(mockDB, mockStats);

    expect(mockDB.prepare).toHaveBeenCalledWith(
      'INSERT INTO aggregated_stats (timestamp, total_requests, status_counts) VALUES (?, ?, ?)'
    );
    expect(mockDB.bind).toHaveBeenCalledWith(
      mockStats.timestamp,
      mockStats.totalRequests,
      JSON.stringify(mockStats.statusCounts)
    );
    expect(mockDB.run).toHaveBeenCalled();
  });

  // Add more tests as needed
});