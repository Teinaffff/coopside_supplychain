import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../common/ui/card";
import { Input } from "../../../common/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import { Button } from "../../../common/ui/button";
import { Badge } from "../../../common/ui/badge";
import { Download } from "lucide-react";
// Removed CardFilters and CardStats per request
import CardTable from "./components/CardTable";
import CardDetailsModal from "./components/CardDetailsModal";
import { Card as CardType, CardFilter } from "../../../constants/interface/coop/card";
import cardService from "../../../services/cardService";
import toast from "react-hot-toast";

const CardManagementPage: React.FC = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [filters, setFilters] = useState<CardFilter>({});
  const [selectedCards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // search controls removed
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);

  // Load cards on component mount
  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      const cardsData: CardType[] = await cardService.getAllCards();
      setCards(cardsData);
    } catch (error) {
      console.error('Error loading cards:', error);
      toast.error('Failed to load cards');
    } finally {
      setIsLoading(false);
    }
  };

  // pending cards loader no longer used (kept for future)

  // Filter cards based on current filters
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          card.cardName.toLowerCase().includes(searchTerm) ||
          card.cardNumber.includes(searchTerm) ||
          card.cardholderName?.toLowerCase().includes(searchTerm) ||
          card.cardholderEmail?.toLowerCase().includes(searchTerm) ||
          (card.creditLimit !== undefined && card.creditLimit !== null && `${card.creditLimit}`.includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Card status filter
      if (filters.cardStatus && filters.cardStatus.length > 0) {
        if (!filters.cardStatus.includes(card.cardStatus)) return false;
      }

      // Card type filter
      if (filters.cardType && filters.cardType.length > 0) {
        if (!filters.cardType.includes(card.cardType)) return false;
      }

      // Approval status filter
      if (filters.approvalStatus && filters.approvalStatus.length > 0) {
        if (!filters.approvalStatus.includes(card.approvalStatus)) return false;
      }

      // Risk level filter
      if (filters.riskLevel && filters.riskLevel.length > 0) {
        if (!card.riskLevel || !filters.riskLevel.includes(card.riskLevel)) return false;
      }

      // Date range filter
      if (filters.dateRange?.from || filters.dateRange?.to) {
        const issuedDate = card.issuedDate ? new Date(card.issuedDate) : new Date(card.createdAt || '');
        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          if (issuedDate < fromDate) return false;
        }
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          if (issuedDate > toDate) return false;
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

  // Stats removed

  // filter handlers kept for potential future use (unused currently)

  // action handlers removed

  const handleSelectionChange = (_selectedIds: string[]) => {
    // selection removed in simplified table; keep for API compatibility
  };

  const handleViewCard = (card: CardType) => {
    setActiveCard(card);
    setDetailsOpen(true);
  };

  const handleExportAll = () => {
    toast.success("Export started");
    // Implement export functionality
  };

  // header refresh removed

  // consumer search handlers removed

  // Lightweight stats for header report
  const summary = useMemo(() => {
    const total = cards.length;
    const approved = cards.filter((c) => c.approvalStatus === "APPROVED").length;
    const active = cards.filter((c) => c.cardStatus === "ACTIVE").length;
    const totalLimit = cards.reduce((sum, c) => sum + (c.creditLimit || 0), 0);
    return { total, approved, active, totalLimit };
  }, [cards]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Card Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage virtual cards and cardholder information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportAll} className="bg-cyan-600 text-white hover:bg-cyan-700">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Top summary report */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-md border p-4">
          <div className="text-xs text-gray-600">Total Cards</div>
          <div className="text-2xl font-semibold mt-1">{summary.total}</div>
        </div>
        <div className="bg-white rounded-md border p-4">
          <div className="text-xs text-gray-600">Approved Cards</div>
          <div className="text-2xl font-semibold mt-1">{summary.approved}</div>
        </div>
        <div className="bg-white rounded-md border p-4">
          <div className="text-xs text-gray-600">Active Cards</div>
          <div className="text-2xl font-semibold mt-1">{summary.active}</div>
        </div>
        <div className="bg-white rounded-md border p-4">
          <div className="text-xs text-gray-600">Total Credit Limit (ETB)</div>
          <div className="text-2xl font-semibold mt-1">{summary.totalLimit.toLocaleString()}</div>
        </div>
      </div>

      {/* Search, summary and list in one white container */}
      <Card>
        <CardHeader>
          <CardTitle>Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <Input
              placeholder="Search by card number, name, or credit limit"
              value={filters.search || ""}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="md:flex-1"
            />
            <div className="flex items-center gap-2">
              <Select
                value={filters.cardStatus?.[0] ?? undefined}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    cardStatus: v === "ALL" ? undefined : ([v as any]),
                  }))
                }
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {/* Export button moved to header */}
              <Button variant="outline" onClick={() => setFilters({})}>Clear</Button>
            </div>
          </div>

          {/* Inline results summary */}
          <div className="flex items-center justify-between mt-4 mb-2">
        <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Cards ({filteredCards.length})</h2>
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

          {/* Inline table with the same white background */}
      <CardTable
        cards={filteredCards}
        onSelectionChange={handleSelectionChange}
        onViewCard={handleViewCard}
      />
        </CardContent>
      </Card>

      <CardDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        card={activeCard}
      />
    </div>
  );
};

export default CardManagementPage;
