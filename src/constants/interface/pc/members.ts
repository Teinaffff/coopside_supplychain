interface Timestamps {
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    userId?: number;
    _id?: number;
    name: string;
    email: string;
    age: number;
    nationality: string;
  }
  
  export interface PCUserSliceType {
    usersList: User[];
  }
  