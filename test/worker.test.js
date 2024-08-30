// test/worker.test.js

import { RequestFilterWorker } from '../src/worker';
import { jest } from '@jest/globals';

describe('RequestFilterWorker', () => {
  let worker;
  let mockDB;
  let mockStorage;

  beforeEach(() => {
    mockDB = {
      prepare: jest.fn().mockReturnThis(),
      all: jest.fn().mockResolvedValue({ results: [] }),
      bind: jest.fn().mockReturnThis(),
      run: jest.fn().mockResolvedValue({}),
    };
    mockStorage = {
      put: jest.fn().mockResolvedValue({}),
      list: jest.fn().mockResolvedValue({ objects: [] }),
      get: jest.fn().mockResolvedValue('{}'),
    };
    worker = new RequestFilterWorker(mockDB, mockStorage);
  });

  test('handleRequest allows request when no rules are violated', async () => {
    const mockRequest = new Request('https://example.com');
    const mockContext = { waitUntil: jest.fn() };
    
    global.fetch = jest.fn().mockResolvedValue(new Response('OK', { status: 200 }));

    const response = await worker.handleRequest(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(mockContext.waitUntil).toHaveBeenCalled();
  });

  test('handleRequest blocks request when a rule is violated', async () => {
    mockDB.all.mockResolvedValue({ results: [{ type: 'block_path', value: '/admin' }] });
    
    const mockRequest = new Request('https://example.com/admin');
    const mockContext = { waitUntil: jest.fn() };

    const response = await worker.handleRequest(mockRequest, mockContext);

    expect(response.status).toBe(403);
    expect(await response.text()).toBe('Request blocked');
  });

  // Add more tests as needed
});