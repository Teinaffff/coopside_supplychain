import API from "../config/axios-config";

export interface Transaction {
    id: number | string;
    applicationNumber: string;
    repaymentId?: number | null;
    repaymentReference?: string | null;
    transactionReference?: string;
    amount: number;
    transactionType?: string;
    paymentMethod?: string;
    status?: string;
    gatewayTransactionId?: string | null;
    paymentGateway?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
    utrNumber?: string | null;
    transactionDate?: string;
    processedAt?: string;
    failureReason?: string | null;
    retryCount?: number;
    description?: string | null;
    remarks?: string | null;
}

function normalizeTransaction(item: any): Transaction {
  return {
    id: item?.id ?? item?.transactionId ?? item?.reference ?? item?.transactionReference ?? `${item?.applicationNumber || ''}-${item?.createdAt || item?.transactionDate || ''}`,
    applicationNumber: item?.applicationNumber ?? item?.loanApplicationNumber ?? item?.loan_id ?? "",
    repaymentId: item?.repaymentId ?? item?.repayment_id ?? null,
    repaymentReference: item?.repaymentReference ?? item?.repayment_reference ?? null,
    transactionReference: item?.transactionReference ?? item?.reference ?? item?.transaction_ref ?? undefined,
    amount: Number(item?.amount ?? item?.transactionAmount ?? 0),
    transactionType: item?.transactionType ?? item?.type ?? item?.transaction_type ?? undefined,
    paymentMethod: item?.paymentMethod ?? item?.method ?? item?.payment_method ?? undefined,
    status: item?.status ?? item?.transactionStatus ?? item?.state ?? undefined,
    gatewayTransactionId: item?.gatewayTransactionId ?? item?.gateway_transaction_id ?? null,
    paymentGateway: item?.paymentGateway ?? item?.gateway ?? item?.payment_gateway ?? null,
    bankName: item?.bankName ?? item?.bank_name ?? null,
    accountNumber: item?.accountNumber ?? item?.account_number ?? null,
    ifscCode: item?.ifscCode ?? item?.ifsc_code ?? null,
    utrNumber: item?.utrNumber ?? item?.utr_number ?? null,
    transactionDate: item?.transactionDate ?? item?.date ?? item?.createdAt ?? item?.created_at ?? undefined,
    processedAt: item?.processedAt ?? item?.processed_at ?? undefined,
    failureReason: item?.failureReason ?? item?.failure_reason ?? null,
    retryCount: item?.retryCount ?? item?.retry_count ?? 0,
    description: item?.description ?? item?.desc ?? null,
    remarks: item?.remarks ?? null,
  };
}

const transactionService = {
  async getTransactionsByLoanApplication(
    applicationNumber: string,
    filters?: { type?: string; paymentMethod?: string }
  ): Promise<Transaction[]> {
    try {
      const params = new URLSearchParams();
      params.set("page", "0");
      params.set("size", "100");
      if (filters?.type) params.set("type", filters.type);
      if (filters?.paymentMethod) params.set("paymentMethod", filters.paymentMethod);

      const { data } = await API.get(
        `/v1/transactions/loan/${encodeURIComponent(applicationNumber)}?${params.toString()}`
      );
      const payload = data?.data ?? data;
      const list = Array.isArray(payload)
        ? payload
        : (payload?.content ?? payload?.items ?? payload?.results ?? payload?.list ?? []);
      const array = Array.isArray(list) ? list : (payload && typeof payload === "object" ? [payload] : []);
      return array.map(normalizeTransaction);
    } catch (error) {
      console.error("Error fetching transactions by loan application number:", error);
      return [];
    }
  },
};

export default transactionService;