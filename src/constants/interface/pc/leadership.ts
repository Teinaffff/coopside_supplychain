export interface Leader extends AddEditLeader {
  name: string;
  email: string;
}

export interface AddEditLeader {
  _id?: number;
  userId: number;
  role: string;
  board: string;
  date: string;
}
