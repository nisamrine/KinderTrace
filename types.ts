
export interface Child {
  id: string;
  name: string;
  age: string;
  section: string;
  avatar: string;
  visualDescription: string;
}

export interface StoryPage {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface Storybook {
  month: string;
  year: string;
  pages: StoryPage[];
}

export type Screen = 'auth' | 'observations' | 'dashboard' | 'storybook';
