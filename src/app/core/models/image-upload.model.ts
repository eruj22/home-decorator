export type UploadImagePayload = {
  image: File;
  roomType: string;
  styleType: string;
  lightingCondition: string;
};

export type GenerateImageResponse = {
  images: GeneratedImage[];
};

export type GeneratedImage = {
  id: string;
  generatedImageUrl: string;
  roomType: string;
  styleType: string;
  lightingCondition: string;
  createdAt: string;
};
