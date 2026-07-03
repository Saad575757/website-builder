import { put, del, list } from "@vercel/blob";

export async function uploadFile(
  filename: string,
  buffer: Buffer,
  contentType: string
) {
  const blob = await put(filename, buffer, {
    contentType,
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function uploadFromFormData(
  formData: FormData,
  fieldName: string
): Promise<string | null> {
  const file = formData.get(fieldName) as File | null;
  if (!file) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadFile(
    `logos/${Date.now()}-${file.name}`,
    buffer,
    file.type
  );
  return url;
}

export async function deleteFile(url: string) {
  await del(url);
}

export async function listFiles(prefix: string) {
  const { blobs } = await list({ prefix });
  return blobs;
}
