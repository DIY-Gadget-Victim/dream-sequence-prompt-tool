
export interface Scene {
  id: string;
  question: string;
  answer: string;
  prompt: string;
  status: 'idle' | 'generating' | 'completed' | 'failed';
  videoUri?: string; // The remote URI from the API
  videoUrl?: string; // The local Blob URL for playback
  error?: string;
}

export interface VideoGenerationConfig {
  resolution: '720p' | '1080p';
  aspectRatio: '16:9' | '9:16';
}
