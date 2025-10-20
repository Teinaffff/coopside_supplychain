import { useQuery } from '@tanstack/react-query';
import consumerService from '../../../services/consumerService';
import { mapConsumerStatus } from '../../../lib/consumer-status-utils';

// Fetch all consumers
const fetchAllConsumers = async () => {
  try {
    const consumers = await consumerService.getAllConsumers();
    
    // Transform consumers data to match our interface
    return consumers.map((consumer: any) => {
      // Use the unified status mapping function
      const statusMapping = mapConsumerStatus(consumer);

      return {
        id: consumer.id,
        name: consumer.fullLegalName || consumer.fullName || consumer.name || `Consumer ${consumer.id}`,
        type: "Consumer",
        status: statusMapping.status, // Super Admin Status
        adminStatus: statusMapping.adminStatus, // Partner Status
        form: {
          email: consumer.email || "N/A",
          phone: consumer.phoneNumber || consumer.phone || "N/A",
          nationalId: consumer.nationalId || consumer.idNumber || consumer.national_id || consumer.id_number || consumer.nationalIdNumber || "N/A",
          employeeId: consumer.employeeId || consumer.employee_id || consumer.empId || consumer.emp_id || consumer.employeeNumber || "N/A",
          tin: consumer.tin || consumer.tinNumber || "N/A",
          jobTitle: consumer.jobTitle || consumer.position || consumer.title || "N/A",
          department: consumer.department || "N/A",
          grossSalary: consumer.grossSalary || consumer.grossIncome || 0,
          netSalary: consumer.netSalary || consumer.netIncome || 0,
          employmentType: consumer.employmentType || consumer.employeeType || consumer.empType || consumer.employee_type || "N/A",
          maritalStatus: consumer.maritalStatus || consumer.marital_status || "N/A",
          numberOfDependants: consumer.numberOfDependants || consumer.dependants || consumer.number_of_dependants || 0,
          createdAt: consumer.createdAt || new Date().toISOString(),
          approvedAt: consumer.approvedAt || consumer.approved_at || "",
          rejectedAt: consumer.rejectedAt || consumer.rejected_at || "",
        },
        docs: [], // Consumers don't have document uploads in the same way
      };
    });
  } catch (error) {
    console.error('Error fetching all consumers:', error);
    throw error;
  }
};

// Hook to fetch all consumers
export const useAllConsumers = () => {
  return useQuery({
    queryKey: ['allConsumers'],
    queryFn: fetchAllConsumers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
