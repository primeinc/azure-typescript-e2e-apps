import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';
import { listFilesInContainer } from '../lib/azure-storage.js';

export async function getFilesInContainer(
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

    const containerName = request.query.get('container');
    context.log(`containerName: ${containerName}`);

    if (!containerName) {
      return {
        status: 400,
        jsonBody: 'Missing required container name'
      };
    }

    // Basic validation: only allow 'upload' container for this demo
    if (containerName !== 'upload') {
        return {
            status: 403,
            jsonBody: 'Forbidden: only "upload" container is allowed'
        };
    }

    const { error, errorMessage, data } = await listFilesInContainer(
      process.env?.Azure_Storage_AccountName as string,
      containerName
    );
    context.log(errorMessage);
    context.log(JSON.stringify(data));
    if (!error) {
      return {
        jsonBody: { list: data }
      };
    } else {
      return {
        status: 500,
        jsonBody: 'Error listing files'
      };
    }
  } catch (error) {
    context.error(`Error listing files: ${error}`);
    return {
      status: 500,
      jsonBody: 'Internal Server Error'
    };
  }
}

app.http('list', {
  methods: ['POST', 'GET'],
  authLevel: 'function',
  handler: getFilesInContainer
});
