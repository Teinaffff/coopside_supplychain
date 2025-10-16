import API from '../config/axios-config';

export interface Agent {
  id: number;
  fullName?: string;
  fullLegalName?: string;
  username?: string;
  agentId?: string;
  agentType?: string;
  email?: string;
  phone?: string;
  location?: string;
  superAdminApprovalStatus?: string;
  adminApprovalStatus?: string;
  documents?: any[];
  [key: string]: any;
}

class AgentService {
  // Get agent by ID
  async getAgentById(agentId: string): Promise<Agent> {
    try {
      console.log('Fetching agent with ID:', agentId);
      const response = await API.get(`/v1/agents/${agentId}`);
      console.log('Agent API response:', response);
      console.log('Agent API response data:', response.data);
      
      // Return the data directly - most APIs return the object directly
      return response.data;
    } catch (error) {
      console.error('Error fetching agent by ID:', error);
      console.error('Agent ID attempted:', agentId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get all agents
  async getAllAgents(): Promise<Agent[]> {
    try {
      const response = await API.get('/v1/agents');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  // Approve agent
  async approveAgent(agentId: string): Promise<void> {
    try {
      console.log('Approving agent with ID:', agentId);
      await API.post(`/v1/agents/${agentId}/approve`);
    } catch (error) {
      console.error('Error approving agent:', error);
      throw error;
    }
  }

  // Reject agent
  async rejectAgent(agentId: string, reason: string): Promise<void> {
    try {
      console.log('Rejecting agent with ID:', agentId, 'Reason:', reason);
      await API.post(`/v1/agents/${agentId}/reject`, { reason });
    } catch (error) {
      console.error('Error rejecting agent:', error);
      throw error;
    }
  }
}

export default new AgentService();
