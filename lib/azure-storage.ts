import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

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
