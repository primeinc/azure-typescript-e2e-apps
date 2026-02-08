import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';
import { generateSASUrl } from '../lib/azure-storage.js';

export async function getGenerateSasToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    if (
      !process.env?.Azure_Storage_AccountName
    ) {
      return {
        status: 400,
        jsonBody: 'Missing required app configuration'
      };
    }

    const containerName = request.query.get('container') || 'upload';
    const fileName = request.query.get('file') || 'nonamefile';
    const permissions = request.query.get('permission') || 'r';
    const timerange = parseInt(request.query.get('timerange') || '10'); // 10 minutes

    context.log(`containerName: ${containerName}`);
    context.log(`fileName: ${fileName}`);
    context.log(`permissions: ${permissions}`);
    context.log(`timerange: ${timerange}`);

    // Basic validation: only allow 'upload' container for this demo
    if (containerName !== 'upload') {
        return {
            status: 403,
            jsonBody: 'Forbidden: only "upload" container is allowed'
        };
    }

    const url = await generateSASUrl(
      process.env?.Azure_Storage_AccountName,
      containerName,
      fileName,
      permissions,
      timerange
    );

    return {
      jsonBody: {
        url
      }
    };
  } catch (error) {
    context.error(`Error generating SAS token: ${error}`);
    return {
      status: 500,
      jsonBody: 'Internal Server Error'
    };
  }
}

app.http('sas', {
  methods: ['POST', 'GET'],
  authLevel: 'function',
  handler: getGenerateSasToken
});
