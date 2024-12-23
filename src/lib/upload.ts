import { createClient } from "@/utils/supabase/client";

type UploadType = "event" | "news" | "membership";

export async function uploadFile(file: File, type: UploadType = "event") {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${type}-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from("events")
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("events").getPublicUrl(filePath);

  return { url: publicUrl };
}
