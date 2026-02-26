export type UploadImageResponse = {
  imageUrl?: string;
  error?: string;
};

export type UploadImagePayload = {
  image: File;
  roomType: string;
  styleType: string;
};
