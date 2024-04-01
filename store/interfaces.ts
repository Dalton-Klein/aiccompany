export interface User {
  token: string;
  id: number;
  email: string;
  avatar_url: string | undefined;
  username: string;
  last_seen: undefined;
  user_id: number;
  connection_count_sender: number;
  connection_count_acceptor: number;
  connections: any;
  show_tasks: boolean;
  input_device_id: string;
  output_device_id: string;
  created_at?: Date;
  updated_at?: Date;
  reminder_type: number;
  error: React.SetStateAction<boolean>;
}

export interface Preferences {
  lastTabPage: string;
  selectedCalendar: any;
  selectedDate: string;
  refreshCalendar: boolean;
  taskView: string;
  refreshTaskView: boolean;
}

export interface SignIn {
  email: string;
  password: string;
}

export interface StandardTile {
  id: number;
  name: string;
  price: number;
  image: string;
  level?: number;
  userOwner: number;
  userOwnerName: string;
}
