export interface Leader extends AddEditLeader {
  name: string;
  email: string;
}

export interface AddEditLeader {
  _id?: number;
  userId: number | undefined;
  role: string;
  board: string;
  date: string;
}
