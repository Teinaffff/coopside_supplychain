import { processLoanApplicationStatus, processLoanApplications } from '../loan-status-utils';
import { LoanApplication } from '../../services/loanApplicationService';

describe('Loan Status Utils', () => {
  const mockApplication: LoanApplication = {
    applicationNumber: 'LA-TEST-001',
    loanType: 'Goods Purchase Financing',
    status: 'PENDING_PARTNER_APPROVAL',
    superAdminStatus: 'pending',
    requestedAmount: 10000,
    approvedAmount: undefined,
    tenure: 12,
    products: 1,
    created: '2025-01-01T00:00:00Z',
    factoryId: 'FAC-001',
    agentId: 'AG-001',
    borrowerName: 'Test Borrower',
    interestRate: 10,
    purpose: 'Test purpose',
    documents: [],
    riskScore: 75,
  };

  describe('processLoanApplicationStatus', () => {
    it('should handle PENDING_PARTNER_APPROVAL correctly', () => {
      const app = { ...mockApplication, status: 'PENDING_PARTNER_APPROVAL' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('PENDING');
      expect(result.displaySuperAdminStatus).toBe('PENDING');
      expect(result.shouldShowInTracking).toBe(false);
      expect(result.trackingStatus).toBe(null);
    });

    it('should handle PENDING_SUPER_ADMIN_APPROVAL correctly', () => {
      const app = { ...mockApplication, status: 'PENDING_SUPER_ADMIN_APPROVAL' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('APPROVED');
      expect(result.displaySuperAdminStatus).toBe('PENDING');
      expect(result.shouldShowInTracking).toBe(false);
      expect(result.trackingStatus).toBe(null);
    });

    it('should handle PENDING_SUPER_ADMIN_APPROVAL with approved superAdminStatus correctly', () => {
      const app = { ...mockApplication, status: 'PENDING_SUPER_ADMIN_APPROVAL', superAdminStatus: 'approved' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('APPROVED');
      expect(result.displaySuperAdminStatus).toBe('APPROVED');
      expect(result.shouldShowInTracking).toBe(true);
      expect(result.trackingStatus).toBe('NOT_DISBURSED');
    });

    it('should handle DISBURSED correctly', () => {
      const app = { ...mockApplication, status: 'DISBURSED' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('APPROVED');
      expect(result.displaySuperAdminStatus).toBe('APPROVED');
      expect(result.shouldShowInTracking).toBe(true);
      expect(result.trackingStatus).toBe('DISBURSED');
    });

    it('should handle APPROVED correctly', () => {
      const app = { ...mockApplication, status: 'APPROVED' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('APPROVED');
      expect(result.displaySuperAdminStatus).toBe('APPROVED');
      expect(result.shouldShowInTracking).toBe(true);
      expect(result.trackingStatus).toBe('NOT_DISBURSED');
    });

    it('should handle REJECTED correctly', () => {
      const app = { ...mockApplication, status: 'REJECTED' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('REJECTED');
      expect(result.displaySuperAdminStatus).toBe('REJECTED');
      expect(result.shouldShowInTracking).toBe(false);
      expect(result.trackingStatus).toBe(null);
    });

    it('should handle CANCELLED correctly', () => {
      const app = { ...mockApplication, status: 'CANCELLED' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('REJECTED');
      expect(result.displaySuperAdminStatus).toBe('REJECTED');
      expect(result.shouldShowInTracking).toBe(false);
      expect(result.trackingStatus).toBe(null);
    });

    it('should handle DRAFT correctly', () => {
      const app = { ...mockApplication, status: 'DRAFT' };
      const result = processLoanApplicationStatus(app);

      expect(result.displayPartnerStatus).toBe('PENDING');
      expect(result.displaySuperAdminStatus).toBe('PENDING');
      expect(result.shouldShowInTracking).toBe(false);
      expect(result.trackingStatus).toBe(null);
    });
  });

  describe('processLoanApplications', () => {
    it('should process multiple applications correctly', () => {
      const applications = [
        { ...mockApplication, applicationNumber: 'LA-001', status: 'PENDING_PARTNER_APPROVAL' },
        { ...mockApplication, applicationNumber: 'LA-002', status: 'DISBURSED' },
        { ...mockApplication, applicationNumber: 'LA-003', status: 'REJECTED' },
      ];

      const results = processLoanApplications(applications);

      expect(results).toHaveLength(3);
      
      // LA-001: PENDING_PARTNER_APPROVAL
      expect(results[0].displayPartnerStatus).toBe('PENDING');
      expect(results[0].displaySuperAdminStatus).toBe('PENDING');
      expect(results[0].shouldShowInTracking).toBe(false);

      // LA-002: DISBURSED
      expect(results[1].displayPartnerStatus).toBe('APPROVED');
      expect(results[1].displaySuperAdminStatus).toBe('APPROVED');
      expect(results[1].shouldShowInTracking).toBe(true);
      expect(results[1].trackingStatus).toBe('DISBURSED');

      // LA-003: REJECTED
      expect(results[2].displayPartnerStatus).toBe('REJECTED');
      expect(results[2].displaySuperAdminStatus).toBe('REJECTED');
      expect(results[2].shouldShowInTracking).toBe(false);
    });
  });
});
