export async function logRequestData(storage, request, response) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      method: request.method,
      url: request.url,
      status: response.status,
    };
  
    await storage.put(`${timestamp}-${crypto.randomUUID()}.json`, JSON.stringify(logData));
  }
  
  export async function fetchLoggedData(storage) {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const objects = await storage.list({
      prefix: oneMinuteAgo.toISOString().slice(0, 16), // Match by minute
    });
  
    const loggedData = [];
    for await (const object of objects.objects) {
      const logData = JSON.parse(await storage.get(object.key));
      loggedData.push(logData);
    }
  
    return loggedData;
  }