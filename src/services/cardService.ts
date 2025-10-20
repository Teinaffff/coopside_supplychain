import API from '../config/axios-config';
import { Card } from '../constants/interface/coop/card';

class CardService {
  // Normalize various API response shapes into a Card[] list
  private normalizeCards(data: any): Card[] {
    if (!data) return [];
    // Direct array
    if (Array.isArray(data)) return data as Card[];
    // Common wrappers
    if (Array.isArray(data.data)) return data.data as Card[];
    if (Array.isArray(data.cards)) return data.cards as Card[];
    if (Array.isArray(data.content)) return data.content as Card[]; // Spring Page
    if (Array.isArray(data.items)) return data.items as Card[];
    if (Array.isArray(data.results)) return data.results as Card[];
    // Sometimes the API returns a single object when querying by consumer
    if (typeof data === 'object' && data.id && data.cardNumber) return [data as Card];
    return [];
  }

  // Normalize single card payloads
  private normalizeCard(data: any): Card {
    if (!data) throw new Error('Empty response');
    if (data.id && data.cardNumber) return data as Card;
    if (data.data && data.data.id && data.data.cardNumber) return data.data as Card;
    if (data.card) return data.card as Card;
    throw new Error('Unexpected card response shape');
  }
  // Get all cards
  async getAllCards(): Promise<Card[]> {
    try {
      console.log('Fetching all cards...');
      const response = await API.get('/v1/cards');
      console.log('Cards API response:', response);
      console.log('Cards API response data:', response.data);
      const cards = this.normalizeCards(response.data);
      return cards;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get card by ID
  async getCardById(cardId: number): Promise<Card> {
    try {
      console.log('Fetching card with ID:', cardId);
      const response = await API.get(`/v1/cards/${cardId}`);
      console.log('Card API response:', response);
      console.log('Card API response data:', response.data);
      return this.normalizeCard(response.data);
    } catch (error) {
      console.error('Error fetching card by ID:', error);
      console.error('Card ID attempted:', cardId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get cards pending approval
  async getCardsPendingApproval(): Promise<Card[]> {
    try {
      console.log('Fetching cards pending approval...');
      const response = await API.get('/v1/cards/pending-approval');
      console.log('Pending cards API response:', response);
      console.log('Pending cards API response data:', response.data);
      return this.normalizeCards(response.data);
    } catch (error) {
      console.error('Error fetching cards pending approval:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get cards by consumer
  async getCardsByConsumer(consumerId: string): Promise<Card[]> {
    try {
      console.log('Fetching cards for consumer:', consumerId);
      const response = await API.get(`/v1/cards/consumer/${consumerId}`);
      console.log('Consumer cards API response:', response);
      console.log('Consumer cards API response data:', response.data);
      return this.normalizeCards(response.data);
    } catch (error) {
      console.error('Error fetching cards by consumer:', error);
      console.error('Consumer ID attempted:', consumerId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Approve card
  async approveCard(cardId: number, approvedBy: string): Promise<Card> {
    try {
      console.log('Approving card:', cardId, 'by:', approvedBy);
      const response = await API.patch(`/v1/cards/${cardId}/approve`, {
        approvedBy,
        approvedAt: new Date().toISOString()
      });
      console.log('Approve card API response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error approving card:', error);
      console.error('Card ID attempted:', cardId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Reject card
  async rejectCard(cardId: number, rejectionReason: string, rejectedBy: string): Promise<Card> {
    try {
      console.log('Rejecting card:', cardId, 'reason:', rejectionReason);
      const response = await API.patch(`/v1/cards/${cardId}/reject`, {
        rejectionReason,
        rejectedBy,
        rejectedAt: new Date().toISOString()
      });
      console.log('Reject card API response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error rejecting card:', error);
      console.error('Card ID attempted:', cardId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Suspend card
  async suspendCard(cardId: number, reason: string, suspendedBy: string): Promise<Card> {
    try {
      console.log('Suspending card:', cardId, 'reason:', reason);
      const response = await API.patch(`/v1/cards/${cardId}/suspend`, {
        reason,
        suspendedBy,
        suspendedAt: new Date().toISOString()
      });
      console.log('Suspend card API response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error suspending card:', error);
      console.error('Card ID attempted:', cardId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Activate card
  async activateCard(cardId: number, activatedBy: string): Promise<Card> {
    try {
      console.log('Activating card:', cardId, 'by:', activatedBy);
      const response = await API.patch(`/v1/cards/${cardId}/activate`, {
        activatedBy,
        activatedAt: new Date().toISOString()
      });
      console.log('Activate card API response:', response);
      
      return response.data;
    } catch (error) {
      console.error('Error activating card:', error);
      console.error('Card ID attempted:', cardId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new CardService();
