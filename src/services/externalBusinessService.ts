import API from '../config/axios-config';

export interface AssociateInfo {
  Position?: string | null;
  ManagerName?: string | null;
  ManagerNameEng?: string | null;
  MobilePhone?: string | null;
  RegularPhone?: string | null;
}

export interface BusinessInfo {
  MainGuid?: string;
  OwnerTIN?: string | null;
  DateRegistered?: string;
  TradeNameAmh?: string;
  TradesName?: string;
  LicenceNumber?: string;
  RenewalDate?: string;
  RenewedFrom?: string;
  RenewedTo?: string;
  SubGroups?: any;
}

export interface RegistrationInfo {
  Tin?: string | null;
  LegalCondtion?: string;
  RegNo?: string;
  RegDate?: string;
  BusinessName?: string;
  BusinessNameAmh?: string;
  PaidUpCapital?: number;
  AssociateShortInfos?: AssociateInfo[];
  Businesses?: BusinessInfo[];
}

export interface ExternalBusinessResponse {
  success?: boolean;
  message?: string;
  data?: {
    registrationInfo?: RegistrationInfo;
    updated?: boolean;
  };
  timestamp?: string;
}

export interface ExternalBusiness {
  tin?: string | null;
  businessName?: string;
  businessNameAmh?: string;
  registrationNumber?: string;
  registrationDate?: string;
  legalCondition?: string;
  paidUpCapital?: number;
  businesses?: BusinessInfo[];
  associates?: AssociateInfo[];
  [key: string]: any;
}

class ExternalBusinessService {
  // Get business details by TIN
  async getBusinessByTin(tin: string): Promise<ExternalBusiness> {
    try {
      // Clean and validate TIN
      let cleanTin = String(tin).trim();
      
      // Remove any whitespace, dashes, or special characters
      cleanTin = cleanTin.replace(/[\s\-_]/g, '');
      
      if (!cleanTin) {
        throw new Error('TIN cannot be empty');
      }
      
      // Log the TIN being used (but be careful with sensitive data)
      console.log('[ExternalBusinessService] Fetching business with TIN:', cleanTin);
      console.log('[ExternalBusinessService] TIN length:', cleanTin.length);
      console.log('[ExternalBusinessService] TIN type:', typeof cleanTin);
      
      // Build the URL - try without encoding first, then with encoding if needed
      const apiUrl = `/v1/external/business/${encodeURIComponent(cleanTin)}`;
      console.log('[ExternalBusinessService] API endpoint:', apiUrl);
      console.log('[ExternalBusinessService] Full URL will be:', API.defaults.baseURL + apiUrl);
      
      const response = await API.get(apiUrl, {
        timeout: 30000, // Increase timeout to 30 seconds for external API
        validateStatus: function (status) {
          // Don't throw error for 4xx and 5xx, let us handle it
          return status >= 200 && status < 600;
        }
      });
      
      // Check if response status indicates an error
      if (response.status >= 400) {
        const errorData = response.data || {};
        console.error('[ExternalBusinessService] ========== ERROR RESPONSE ==========');
        console.error('[ExternalBusinessService] Status:', response.status);
        console.error('[ExternalBusinessService] Status Text:', response.statusText);
        console.error('[ExternalBusinessService] Full Error Response:', JSON.stringify(errorData, null, 2));
        console.error('[ExternalBusinessService] Error Data Type:', typeof errorData);
        console.error('[ExternalBusinessService] Error Data Keys:', Object.keys(errorData));
        
        // Try to extract a meaningful error message
        let errorMsg = errorData.message || 
                      errorData.error || 
                      errorData.errorMessage ||
                      errorData.detail ||
                      errorData.title ||
                      `HTTP ${response.status} Error`;
        
        // If it's a 500 error and we have more details, include them
        if (response.status === 500) {
          // Check for common error response structures
          if (errorData.message && errorData.message !== 'An unexpected error occurred. Please try again.') {
            errorMsg = errorData.message;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          } else if (typeof errorData === 'string') {
            errorMsg = errorData;
          } else {
            // For 500 errors, provide a more helpful message
            errorMsg = `Server error: The TIN registry service encountered an error while processing TIN "${cleanTin}". This may indicate the TIN doesn't exist in the registry or the service is temporarily unavailable.`;
          }
        }
        
        console.error('[ExternalBusinessService] Extracted Error Message:', errorMsg);
        console.error('[ExternalBusinessService] ====================================');
        
        // Create an error object that mimics axios error structure
        const error: any = new Error(errorMsg);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        };
        error.config = {
          url: apiUrl,
          method: 'GET'
        };
        throw error;
      }
      
      console.log('[ExternalBusinessService] API response status:', response.status);
      console.log('[ExternalBusinessService] API response headers:', response.headers);
      console.log('[ExternalBusinessService] API response data:', response.data);
      console.log('[ExternalBusinessService] API response data type:', typeof response.data);
      console.log('[ExternalBusinessService] API response data keys:', Object.keys(response.data || {}));
      
      // Handle the nested response structure: response.data.data.registrationInfo
      const responseData = response.data as ExternalBusinessResponse;
      console.log('[ExternalBusinessService] Parsed responseData:', responseData);
      console.log('[ExternalBusinessService] responseData.success:', responseData?.success);
      console.log('[ExternalBusinessService] responseData.message:', responseData?.message);
      console.log('[ExternalBusinessService] responseData.data:', responseData?.data);
      console.log('[ExternalBusinessService] responseData.data?.registrationInfo:', responseData?.data?.registrationInfo);
      
      // Check if the API returned an error in the response body (even with 200 status)
      if (responseData?.success === false) {
        const errorMsg = responseData?.message || 'Business information not found';
        console.error('[ExternalBusinessService] API returned success=false:', errorMsg);
        throw new Error(errorMsg);
      }
      
      // Check if there's an error message but no data
      if (responseData?.message && !responseData?.data) {
        console.warn('[ExternalBusinessService] API returned message but no data:', responseData.message);
        // This might still be valid, so we'll continue
      }
      
      const registrationInfo = responseData?.data?.registrationInfo;
      
      if (!registrationInfo) {
        console.warn('[ExternalBusinessService] No registrationInfo found in API response');
        console.warn('[ExternalBusinessService] Full response structure:', JSON.stringify(responseData, null, 2));
        
        // If we have a message, throw it as an error
        if (responseData?.message) {
          throw new Error(responseData.message);
        }
        
        // Return empty object but don't throw - let the UI handle it
        return {};
      }
      
      // Map the PascalCase fields to our interface
      const businessData: ExternalBusiness = {
        tin: registrationInfo.Tin || null,
        businessName: registrationInfo.BusinessName,
        businessNameAmh: registrationInfo.BusinessNameAmh,
        registrationNumber: registrationInfo.RegNo,
        registrationDate: registrationInfo.RegDate,
        legalCondition: registrationInfo.LegalCondtion,
        paidUpCapital: registrationInfo.PaidUpCapital,
        businesses: registrationInfo.Businesses || [],
        associates: registrationInfo.AssociateShortInfos || [],
        // Keep the raw data for reference
        rawData: registrationInfo
      };
      
      console.log('[ExternalBusinessService] Mapped business data:', businessData);
      return businessData;
    } catch (error: any) {
      console.error('[ExternalBusinessService] Error fetching business by TIN:', error);
      console.error('[ExternalBusinessService] TIN attempted:', tin);
      console.error('[ExternalBusinessService] Error type:', error?.constructor?.name);
      console.error('[ExternalBusinessService] Error message:', error?.message);
      console.error('[ExternalBusinessService] Error response status:', error?.response?.status);
      console.error('[ExternalBusinessService] Error response data:', error?.response?.data);
      console.error('[ExternalBusinessService] Error response headers:', error?.response?.headers);
      console.error('[ExternalBusinessService] Error config:', error?.config);
      throw error;
    }
  }
}

export default new ExternalBusinessService();

