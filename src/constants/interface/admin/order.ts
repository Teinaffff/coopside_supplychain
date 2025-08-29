interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku: string;
  specifications?: string;
}

interface PaymentInfo {
  method: string;
  status: string;
  amount: number;
  transactionId: string;
  paidAmount: number;
}

export interface Order extends Timestamps {
  id: string;
  orderNumber: string;
  orderType: string;
  status: string;
  priority: string;

  // Parties involved
  buyerId: string;
  buyerName: string;
  buyerType: string;
  sellerId: string;
  sellerName: string;
  sellerType: string;

  // Order details
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentInfo: PaymentInfo;

  // Additional info
  notes?: string;
  internalNotes?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
}
