
export interface Child {
  id: string;
  name: string;
  age: string;
  section: string;
  avatar: string;
  visualDescription: string;
}

export interface DailyLog {
  id: string;
  date: string;
  arrival_time: string;
  departure_time: string;
  weight_kg: number;
  sleep: number;
  appetite: string;
  food: string[];
  behavior: string[];
  activity: string[];
  stool_count: number;
  stool_state: string;
  observations_parent: string;
  observations_professional: string;
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
