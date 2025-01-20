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
