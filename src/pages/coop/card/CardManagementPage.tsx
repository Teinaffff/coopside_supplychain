import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import { Download, Plus, RefreshCw } from "lucide-react";
import CardFilters from "./components/CardFilters";
import CardStats from "./components/CardStats";
import CardTable from "./components/CardTable";
import { Card as CardType, CardFilter, CardStats as CardStatsType } from "../../../constants/interface/coop/card";
import toast from "react-hot-toast";

// Mock data - replace with actual API calls
const mockCards: CardType[] = [
  {
    id: "1",
    cardNumber: "4532123456780535",
    cardName: "Ahmed Hassan",
    type: "CREDIT",
    creditLimit: 50000,
    dailyLimit: 10000,
    availableBalance: 50000,
    status: "PENDING",
    partnerStatus: "PARTNER",
    adminStatus: "ADMIN",
    rejectionReason: undefined,
    requestedDate: "2025-10-09",
    issuedDate: undefined,
    expiryDate: "2027-10-09",
    cardholderId: "CH001",
    cardholderName: "Ahmed Hassan",
    cardholderEmail: "ahmed@example.com",
    cardholderPhone: "+251911234567",
    kycReference: "KYC001",
    isActive: false,
    lastTransactionDate: undefined,
    totalTransactions: 0,
    monthlySpend: 0,
    riskLevel: "LOW",
    notes: "New card application",
  },
  {
    id: "2",
    cardNumber: "4532123456786533",
    cardName: "Fatima Ali",
    type: "CREDIT",
    creditLimit: 75000,
    dailyLimit: 15000,
    availableBalance: 60000,
    status: "APPROVED",
    partnerStatus: "PARTNER",
    adminStatus: "SUPER_ADMIN",
    rejectionReason: undefined,
    requestedDate: "2025-10-14",
    issuedDate: "2025-10-14",
    expiryDate: "2027-10-14",
    cardholderId: "CH002",
    cardholderName: "Fatima Ali",
    cardholderEmail: "fatima@example.com",
    cardholderPhone: "+251911234568",
    kycReference: "KYC002",
    isActive: true,
    lastTransactionDate: "2025-10-20",
    totalTransactions: 15,
    monthlySpend: 2500,
    riskLevel: "LOW",
    notes: "Active partner card",
  },
  {
    id: "3",
    cardNumber: "4532123456781440",
    cardName: "Mohamed Ibrahim",
    type: "CREDIT",
    creditLimit: 30000,
    dailyLimit: 6000,
    availableBalance: 0,
    status: "REJECTED",
    partnerStatus: "NON_PARTNER",
    adminStatus: "USER",
    rejectionReason: "Insufficient credit score",
    requestedDate: "2025-10-07",
    issuedDate: undefined,
    expiryDate: undefined,
    cardholderId: "CH003",
    cardholderName: "Mohamed Ibrahim",
    cardholderEmail: "mohamed@example.com",
    cardholderPhone: "+251911234569",
    kycReference: "KYC003",
    isActive: false,
    lastTransactionDate: undefined,
    totalTransactions: 0,
    monthlySpend: 0,
    riskLevel: "HIGH",
    notes: "Rejected due to poor credit history",
  },
];

const CardManagementPage: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>(mockCards);
  const [filters, setFilters] = useState<CardFilter>({});
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter cards based on current filters
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          card.cardName.toLowerCase().includes(searchTerm) ||
          card.cardNumber.includes(searchTerm) ||
          card.cardholderName.toLowerCase().includes(searchTerm) ||
          card.cardholderEmail?.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(card.status)) return false;
      }

      // Type filter
      if (filters.type && filters.type.length > 0) {
        if (!filters.type.includes(card.type)) return false;
      }


      // Risk level filter
      if (filters.riskLevel && filters.riskLevel.length > 0) {
        if (!card.riskLevel || !filters.riskLevel.includes(card.riskLevel)) return false;
      }

      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const requestedDate = new Date(card.requestedDate);
        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (requestedDate < fromDate) return false;
        }
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          if (requestedDate > toDate) return false;
        }
      }

      // Credit limit range filter
      if (filters.creditLimitRange?.min !== undefined || filters.creditLimitRange?.max !== undefined) {
        const creditLimit = card.creditLimit || 0;
        if (filters.creditLimitRange.min !== undefined && creditLimit < filters.creditLimitRange.min) {
          return false;
        }
        if (filters.creditLimitRange.max !== undefined && creditLimit > filters.creditLimitRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [cards, filters]);

  // Calculate stats
  const stats: CardStatsType = useMemo(() => {
    const total = cards.length;
    const pending = cards.filter(c => c.status === "PENDING").length;
    const approved = cards.filter(c => c.status === "APPROVED").length;
    const rejected = cards.filter(c => c.status === "REJECTED").length;
    const active = cards.filter(c => c.status === "ACTIVE").length;
    const inactive = cards.filter(c => c.status === "INACTIVE").length;
    const suspended = cards.filter(c => c.status === "SUSPENDED").length;
    const partnerCards = cards.filter(c => c.partnerStatus === "PARTNER").length;
    const superAdminCards = cards.filter(c => c.adminStatus === "SUPER_ADMIN").length;
    
    const totalCreditLimit = cards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
    const totalAvailableBalance = cards.reduce((sum, card) => sum + (card.availableBalance || 0), 0);
    const monthlySpend = cards.reduce((sum, card) => sum + (card.monthlySpend || 0), 0);

    return {
      total,
      pending,
      approved,
      rejected,
      active,
      inactive,
      suspended,
      partnerCards,
      superAdminCards,
      totalCreditLimit,
      totalAvailableBalance,
      monthlySpend,
    };
  }, [cards]);

  const handleFiltersChange = (newFilters: CardFilter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleCardAction = (cardId: string, action: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    switch (action) {
      case "approve":
        setCards(prev => prev.map(c => 
          c.id === cardId 
            ? { ...c, status: "APPROVED" as const, issuedDate: new Date().toISOString().split('T')[0] }
            : c
        ));
        toast.success(`Card ${card.cardNumber} approved successfully`);
        break;
      case "reject":
        setCards(prev => prev.map(c => 
          c.id === cardId 
            ? { ...c, status: "REJECTED" as const, rejectionReason: "Rejected by admin" }
            : c
        ));
        toast.success(`Card ${card.cardNumber} rejected`);
        break;
      case "activate":
        setCards(prev => prev.map(c => 
          c.id === cardId 
            ? { ...c, status: "ACTIVE" as const, isActive: true }
            : c
        ));
        toast.success(`Card ${card.cardNumber} activated`);
        break;
      case "suspend":
        setCards(prev => prev.map(c => 
          c.id === cardId 
            ? { ...c, status: "SUSPENDED" as const, isActive: false }
            : c
        ));
        toast.success(`Card ${card.cardNumber} suspended`);
        break;
      case "view":
        toast.info(`Viewing details for card ${card.cardNumber}`);
        break;
      case "edit":
        toast.info(`Editing card ${card.cardNumber}`);
        break;
      case "delete":
        if (window.confirm(`Are you sure you want to delete card ${card.cardNumber}?`)) {
          setCards(prev => prev.filter(c => c.id !== cardId));
          toast.success(`Card ${card.cardNumber} deleted`);
        }
        break;
      default:
        toast.info(`Action ${action} not implemented yet`);
    }
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedCards(selectedIds);
  };

  const handleExportAll = () => {
    toast.info("Exporting all cards...");
    // Implement export functionality
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Cards refreshed");
    }, 1000);
  };

  const handleCreateCard = () => {
    toast.info("Create new card functionality coming soon");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Card Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage virtual cards, approvals, and cardholder information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button onClick={handleCreateCard}>
            <Plus className="w-4 h-4 mr-2" />
            Create Card
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CardStats stats={stats} />

      {/* Filters */}
      <CardFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            Cards ({filteredCards.length})
          </h2>
          {Object.keys(filters).length > 0 && (
            <Badge variant="secondary">
              {filteredCards.length} of {cards.length} cards
            </Badge>
          )}
        </div>
        <div className="text-sm text-gray-500">
          {selectedCards.length > 0 && `${selectedCards.length} selected`}
        </div>
      </div>

      {/* Table */}
      <CardTable
        cards={filteredCards}
        onCardAction={handleCardAction}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default CardManagementPage;
