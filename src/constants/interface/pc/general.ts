export interface TopMembers {
  id: number;
  name: string;
  share: number;
  profit: number;
}

export interface RecentProductTransaction {
  id: number;
  productName: string;
  quantity: number;
  totalSales: number;
  buyer: string;
  remark: string;
  date: string;
  transactionId: string;
}

export interface RequestHistory {
  id: string;
  type: string;
  submittedDate: string;
  approvedDate: string;
  status: string;
  expiryDate: string;
}
