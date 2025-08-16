interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Request extends Timestamps {
  requestId?: string;
  requestType: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedDate: string;
  status: string;
  priority: string;
  category: string;
  assignedTo?: string;
  dueDate?: string;
  attachments?: string[];
  comments?: string;
  approvedBy?: string;
  approvedDate?: string;
}