export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinedGroups: string[];
  savedEvents: string[];
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;          // ISO string
  time: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  coverImage?: string;
  organizer: string | User;
  group?: string | Group;
  attendees: string[];
  maxAttendees?: number;
  price: number;         // 0 = free
  tags: string[];
  createdAt: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  coverImage?: string;
  members: string[];
  events: string[];
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
