/*
-----------------------------------------------------------------------------------
Create Resource Group:

curl -X POST 'http://localhost:7071/api/resourcegroup?name=my-test-1&location=westus'

curl -X POST 'http://localhost:7071/api/resourcegroup?name=my-test-1&location=westus' \
  -H 'content-type: application/json' \
  -d '{"tags": {"a":"b"}}'

  -----------------------------------------------------------------------------------
Delete Resource Group

curl -X DELETE 'http://localhost:7071/api/resourcegroup?name=my-test-1' \
  -H 'Content-Type: application/json'

*/
// <snippet_resourcegroup>
import { ResourceGroup } from '@azure/arm-resources';
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext
} from '@azure/functions';
import {
  createResourceGroup,
  deleteResourceGroup
} from '../lib/azure-resource-groups';
import { processError } from '../lib/error';

export async function resourcegroup(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    context.log(JSON.stringify(request.query));
    context.log(JSON.stringify(request.params));

    const name = request.query.get('name');
    const location = request.query.get('location');
    context.log(`name: ${name}`);
    context.log(`location: ${location}`);

    switch (request.method) {
      case 'POST': // wait for create to complete before returning
        if (!name || !location) {
          return { body: 'Missing required parameters.', status: 400 };
        }

        if (request.headers.get('content-type') === 'application/json') {
          // create with tags

          const body = (await request.json()) as {
            tags?: Record<string, string>;
          };
          const tags: Record<string, string> = body?.tags ?? {};
          const resourceGroup: ResourceGroup = await createResourceGroup(
            name,
            location,
            tags
          );
          return { jsonBody: resourceGroup, status: 200 };
        } else {
          // create without tags

          const resourceGroup: ResourceGroup = await createResourceGroup(
            name,
            location,
            {}
          );
          return { jsonBody: resourceGroup, status: 200 };
        }

      case 'DELETE': // wait for delete to complete before returning
        if (!name) {
          return { body: 'Missing required parameters.', status: 400 };
        }
        await deleteResourceGroup(name);
        return { status: 204 };
      default:
        return { status: 405 };
    }
  } catch (err: unknown) {
    return processError(err);
  }
}

app.http('resourcegroup', {
  methods: ['DELETE', 'POST'],
  authLevel: 'anonymous',
  handler: resourcegroup
});
// </snippet_resourcegroup>
