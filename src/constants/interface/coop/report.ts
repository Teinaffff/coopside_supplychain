interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

export interface Report extends Timestamps {
  reportId?: string;
  reportType: string;
  title: string;
  description: string;
  generatedBy: string;
  generatedDate: string;
  status: string;
  category: string;
  totalRecords: number;
  fileSize: string;
  downloadUrl?: string;
  expiryDate?: string;
  tags?: string[];
  visibility: string;
}