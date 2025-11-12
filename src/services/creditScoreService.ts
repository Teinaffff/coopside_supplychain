import axios from "axios";

export interface CreditScoreResponse {
  creditScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  agentId: string;
  calculatedAt?: string;
  recommendation?: string; // Recommendation from API (e.g., "APPROVE WITH CONDITIONS - Consider lower amount or collateral")
  details?: {
    paymentHistory?: number;
    creditUtilization?: number;
    creditHistoryLength?: number;
    recentInquiries?: number;
    totalScore?: number;
  };
}

class CreditScoreService {
  private baseURL = "http://10.8.100.39:5004/api/v1";

  /**
   * Fetch credit score for an agent
   * @param agentId - The agent ID to fetch credit score for
   * @returns Credit score response with score (0-100) and risk level
   */
  async getCreditScore(agentId: string): Promise<CreditScoreResponse> {
    try {
      console.log(`[CreditScoreService] ========================================`);
      console.log(`[CreditScoreService] Fetching credit score for agent: ${agentId}`);
      console.log(`[CreditScoreService] API URL: ${this.baseURL}/credit-score`);
      
      // Convert agentId to number if it's a string that represents a number
      const agentIdNumber = typeof agentId === 'string' && !isNaN(Number(agentId)) 
        ? Number(agentId) 
        : agentId;
      
      // API expects agent_id (snake_case) not agentId (camelCase)
      const requestBody = { agent_id: agentIdNumber };
      console.log(`[CreditScoreService] Request body:`, JSON.stringify(requestBody, null, 2));
      
      const response = await axios.post(
        `${this.baseURL}/credit-score`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log(`[CreditScoreService] ✅ API Response Status:`, response.status);
      console.log(`[CreditScoreService] ✅ API Response Data:`, JSON.stringify(response.data, null, 2));
      console.log(`[CreditScoreService] ✅ API Response Headers:`, response.headers);

      // Handle different response structures
      // API response structure: { success, message, data: { credit_score: { total_score, risk_level, ... }, ... } }
      const responseData = response.data?.data || response.data;
      
      // Extract credit_score object from the nested structure
      const creditScoreObj = responseData?.credit_score || responseData;
      
      // The total_score is inside credit_score object: data.credit_score.total_score
      const creditScoreValue = creditScoreObj?.total_score || responseData?.total_score || creditScoreObj?.creditScore || creditScoreObj?.credit_score || creditScoreObj?.score;
      const riskLevelValue = creditScoreObj?.risk_level || responseData?.risk_level || creditScoreObj?.riskLevel;
      
      console.log(`[CreditScoreService] Full response data:`, responseData);
      console.log(`[CreditScoreService] Credit score object:`, creditScoreObj);
      console.log(`[CreditScoreService] Extracted creditScore from credit_score.total_score field:`, creditScoreValue);
      console.log(`[CreditScoreService] Extracted riskLevel from credit_score.risk_level field:`, riskLevelValue);
      
      // Validate that we got a valid credit score
      if (creditScoreValue === undefined || creditScoreValue === null) {
        console.warn(`[CreditScoreService] ⚠️ No credit score found in response. Response structure:`, responseData);
        throw new Error(`Invalid credit score response: No credit score value found in API response`);
      }
      
      // Normalize risk level to uppercase
      // API returns "MEDIUM RISK" but we need "MEDIUM", "LOW", or "HIGH"
      let normalizedRiskLevel: string | undefined;
      if (riskLevelValue) {
        if (typeof riskLevelValue === 'string') {
          const upperRisk = riskLevelValue.toUpperCase();
          // Extract just the risk level (e.g., "MEDIUM RISK" -> "MEDIUM")
          if (upperRisk.includes('LOW')) {
            normalizedRiskLevel = 'LOW';
          } else if (upperRisk.includes('MEDIUM')) {
            normalizedRiskLevel = 'MEDIUM';
          } else if (upperRisk.includes('HIGH')) {
            normalizedRiskLevel = 'HIGH';
          } else {
            normalizedRiskLevel = upperRisk;
          }
        } else {
          normalizedRiskLevel = riskLevelValue;
        }
      } else {
        normalizedRiskLevel = this.calculateRiskLevel(creditScoreValue ?? 0);
      }
      
      // Map total_score to creditScore for display
      // Extract breakdown and recommendation from credit_score object
      const breakdown = creditScoreObj?.breakdown || responseData?.breakdown || responseData?.details || responseData?.scoreDetails;
      const recommendation = creditScoreObj?.recommendation || responseData?.recommendation;
      
      console.log(`[CreditScoreService] Extracted recommendation:`, recommendation);
      
      const result = {
        creditScore: typeof creditScoreValue === 'number' ? creditScoreValue : Number(creditScoreValue) || 0, // This is credit_score.total_score from API
        riskLevel: (normalizedRiskLevel === 'LOW' || normalizedRiskLevel === 'MEDIUM' || normalizedRiskLevel === 'HIGH') 
          ? normalizedRiskLevel 
          : this.calculateRiskLevel(creditScoreValue ?? 0),
        agentId: agentId,
        calculatedAt: responseData?.timestamp || creditScoreObj?.calculatedAt || responseData?.calculatedAt || responseData?.calculated_at || new Date().toISOString(),
        recommendation: recommendation, // Use recommendation from API
        details: breakdown,
      };
      
      console.log(`[CreditScoreService] ✅ Returning credit score:`, result);
      console.log(`[CreditScoreService] ========================================`);
      
      return result;
    } catch (error: any) {
      console.error(`[CreditScoreService] ❌ Error fetching credit score for agent ${agentId}:`, error);
      console.error(`[CreditScoreService] Error details:`, {
        message: error?.message,
        code: error?.code,
        response: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        config: {
          url: error?.config?.url,
          method: error?.config?.method,
          data: error?.config?.data,
        }
      });
      
      // Re-throw the error so the caller can handle it appropriately
      // The caller will set creditScore to null on error
      throw error;
    }
  }

  /**
   * Calculate risk level based on credit score
   * @param creditScore - Credit score (0-100)
   * @returns Risk level (LOW, MEDIUM, HIGH)
   */
  private calculateRiskLevel(creditScore: number): "LOW" | "MEDIUM" | "HIGH" {
    if (creditScore >= 75) {
      return "LOW";
    } else if (creditScore >= 50) {
      return "MEDIUM";
    } else {
      return "HIGH";
    }
  }
}

export default new CreditScoreService();

