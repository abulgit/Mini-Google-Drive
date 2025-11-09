import {
  BlobServiceClient,
  ContainerClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";

if (!process.env.AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error(
    "Please add your Azure Storage connection string to .env.local"
  );
}

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "user-files";

export async function getContainerClient(): Promise<ContainerClient> {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Ensure container exists
  await containerClient.createIfNotExists({
    access: "blob",
  });

  return containerClient;
}

export async function uploadFileToBlob(
  userId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const containerClient = await getContainerClient();
  const blobName = `${userId}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
    blobHTTPHeaders: {
      blobContentType: contentType,
    },
  });

  return blockBlobClient.url;
}

export async function deleteFileFromBlob(
  userId: string,
  fileName: string
): Promise<void> {
  const containerClient = await getContainerClient();
  const blobName = `${userId}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.deleteIfExists();
}

export async function generateDownloadUrl(
  userId: string,
  fileName: string
): Promise<string> {
  const containerClient = await getContainerClient();
  const blobName = `${userId}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  return blockBlobClient.url;
}

function getSharedKeyCredential(): StorageSharedKeyCredential {
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
  const accountNameMatch = connectionString.match(/AccountName=([^;]+)/);
  const accountKeyMatch = connectionString.match(/AccountKey=([^;]+)/);

  if (!accountNameMatch || !accountKeyMatch) {
    throw new Error("Invalid Azure Storage connection string format");
  }

  return new StorageSharedKeyCredential(
    accountNameMatch[1],
    accountKeyMatch[1]
  );
}

export async function generatePresignedUploadUrl(
  userId: string,
  fileName: string,
  contentType: string,
  expiryMinutes: number = 10
): Promise<{ uploadUrl: string; blobPath: string }> {
  const containerClient = await getContainerClient();
  const blobName = `${userId}/${fileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const sharedKeyCredential = getSharedKeyCredential();

  const startsOn = new Date();
  const expiresOn = new Date(startsOn.getTime() + expiryMinutes * 60 * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("w"),
      startsOn,
      expiresOn,
      contentType,
    },
    sharedKeyCredential
  ).toString();

  const uploadUrl = `${blockBlobClient.url}?${sasToken}`;

  return {
    uploadUrl,
    blobPath: blobName,
  };
}

export async function verifyBlobExists(blobPath: string): Promise<boolean> {
  try {
    const containerClient = await getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
    return await blockBlobClient.exists();
  } catch (error) {
    console.error("Error verifying blob existence:", error);
    return false;
  }
}

export async function getBlobProperties(blobPath: string): Promise<{
  size: number;
  contentType: string;
  lastModified: Date;
  url: string;
} | null> {
  try {
    const containerClient = await getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);
    const properties = await blockBlobClient.getProperties();

    return {
      size: properties.contentLength || 0,
      contentType: properties.contentType || "application/octet-stream",
      lastModified: properties.lastModified || new Date(),
      url: blockBlobClient.url,
    };
  } catch (error) {
    console.error("Error getting blob properties:", error);
    return null;
  }
}
