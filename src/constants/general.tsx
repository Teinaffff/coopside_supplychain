export const HTTP_RESPONSE = {
  SUCCESS: 200,
  CREATED: 201,
  UPDATED: 204,
  UNAUTHORIZED: 401,
};

export const TOKEN = "token";
export const USER = "user";

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value: any;
}

export interface ExpectedColumn {
  field: string;
  required: boolean;
  description: string;
  validator?: (value: any) => boolean;
  transformer?: (value: any) => any;
}

export interface ImportProgress {
  current: number;
  total: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
}

export interface ImportConfig {
  maxRows: number;
  batchSize: number;
  maxFileSize: number;
  batchDelay: number;
}

export interface GenericImportModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  expectedColumns: ExpectedColumn[];
  rowToEntity: (row: any, columnMapping: Record<string, string>) => T;
  onSubmit: (entities: T[]) => Promise<void>;
  templateData?: any[][];
  config?: Partial<ImportConfig>;
}