export interface OEmbedResponse {
  version: string;

  type: 'photo' | 'video';

  width: number;

  height: number;

  title: string;

  url: string;

  author_name: string;

  author_url: string;

  provider_name: string;

  provider_url: string;

  duration?: number;
}
