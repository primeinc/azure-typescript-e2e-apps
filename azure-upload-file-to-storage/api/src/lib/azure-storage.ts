// Used to get read-only SAS token URL
import {
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
  SASProtocol,
  UserDelegationKey,
  generateBlobSASQueryParameters
} from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

function getBlobServiceClient(serviceName: string): BlobServiceClient {
  const blobServiceClient = new BlobServiceClient(
    `https://${serviceName}.blob.core.windows.net`,
    new DefaultAzureCredential()
  );

  return blobServiceClient;
}

async function createContainer(
  containerName: string,
  blobServiceClient: BlobServiceClient
): Promise<ContainerClient> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  return containerClient;
}

// Simple cache for User Delegation Key
let cachedUserDelegationKey: {
    key: UserDelegationKey;
    expiresOn: Date;
} | null = null;

async function getCachedUserDelegationKey(blobServiceClient: BlobServiceClient): Promise<UserDelegationKey> {
    const now = new Date();
    // If we have a cached key and it's still valid for at least 5 minutes, use it
    if (cachedUserDelegationKey && cachedUserDelegationKey.expiresOn.getTime() > now.getTime() + 5 * 60 * 1000) {
        return cachedUserDelegationKey.key;
    }

    const startsOn = new Date();
    startsOn.setMinutes(startsOn.getMinutes() - 15);

    const expiresOn = new Date();
    expiresOn.setHours(expiresOn.getHours() + 1); // Key valid for 1 hour

    const userDelegationKey = await blobServiceClient.getUserDelegationKey(
        startsOn,
        expiresOn
    );

    cachedUserDelegationKey = {
        key: userDelegationKey,
        expiresOn
    };

    return userDelegationKey;
}

export async function uploadBlob(
  serviceName: string,
  fileName: string,
  containerName: string,
  blob: Buffer
): Promise<string | undefined> {
  if (!serviceName || !fileName || !containerName || !blob) {
    throw new Error('Upload function missing parameters');
  }

  const blobServiceClient = getBlobServiceClient(serviceName);

  const containerClient = await createContainer(
    containerName,
    blobServiceClient
  );
  const blockBlobClient = await containerClient.getBlockBlobClient(fileName);
  const response = await blockBlobClient.uploadData(blob);

  return response.errorCode;
}

export const generateSASUrl = async (
  serviceName: string,
  containerName: string,
  fileName: string, // hierarchy of folders and file name: 'folder1/folder2/filename.ext'
  permissions = 'r', // default read only
  timerange = 1 // default 1 minute
): Promise<string> => {
  if (!serviceName || !fileName || !containerName) {
    throw new Error('Generate SAS function missing parameters');
  }

  const blobServiceClient = getBlobServiceClient(serviceName);
  const containerClient = await createContainer(
    containerName,
    blobServiceClient
  );
  const blockBlobClient = await containerClient.getBlockBlobClient(fileName);

  // Best practice: start SAS 15 minutes in the past to avoid clock skew
  const startsOn = new Date();
  startsOn.setMinutes(startsOn.getMinutes() - 15);

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + timerange);

  const userDelegationKey = await getCachedUserDelegationKey(blobServiceClient);

  // Create SAS token
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: fileName,
      permissions: BlobSASPermissions.parse(permissions),
      startsOn,
      expiresOn,
      protocol: SASProtocol.Https
    },
    userDelegationKey,
    serviceName
  ).toString();

  return `${blockBlobClient.url}?${sasToken}`;
};

type ListFilesInContainerResponse = {
  error: boolean;
  errorMessage: string;
  data: string[];
};

export const listFilesInContainer = async (
  serviceName: string,
  containerName: string
): Promise<ListFilesInContainerResponse> => {
  if (!serviceName || !containerName) {
    return {
      error: true,
      errorMessage: 'List files in container function missing parameters',
      data: []
    };
  }

  const blobServiceClient = getBlobServiceClient(serviceName);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Best practice: start SAS 15 minutes in the past to avoid clock skew
  const startsOn = new Date();
  startsOn.setMinutes(startsOn.getMinutes() - 15);

  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 60); // Read-only list tokens last 60 mins

  const userDelegationKey = await getCachedUserDelegationKey(blobServiceClient);

  const data = [];

  // Implement pagination and limit to 20 results (P2 #13)
  const listBlobsResponse = containerClient.listBlobsFlat().byPage({ maxPageSize: 20 });
  const firstPage = await listBlobsResponse.next();
  
  if (firstPage.value && firstPage.value.segment.blobItems) {
    for (const blob of firstPage.value.segment.blobItems) {
        const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
        
        const sasToken = generateBlobSASQueryParameters(
        {
            containerName,
            blobName: blob.name,
            permissions: BlobSASPermissions.parse('r'),
            startsOn,
            expiresOn,
            protocol: SASProtocol.Https
        },
        userDelegationKey,
        serviceName
        ).toString();

        data.push(`${blockBlobClient.url}?${sasToken}`);
    }
  }

  return {
    error: false,
    errorMessage: '',
    data
  };
};
