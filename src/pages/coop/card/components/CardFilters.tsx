import React, { useState } from "react";
import { Card, CardContent } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Badge } from "../../../../common/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Filter, X, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { CardFilter } from "../../../../constants/interface/coop/card";

interface CardFiltersProps {
  filters: CardFilter;
  onFiltersChange: (filters: CardFilter) => void;
  onClearFilters: () => void;
}

const CardFilters: React.FC<CardFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "APPROVED", label: "Approved", color: "bg-blue-100 text-blue-800" },
    { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
    { value: "ACTIVE", label: "Active", color: "bg-green-100 text-green-800" },
    { value: "INACTIVE", label: "Inactive", color: "bg-gray-100 text-gray-800" },
    { value: "SUSPENDED", label: "Suspended", color: "bg-orange-100 text-orange-800" },
  ];

  const typeOptions = [
    { value: "CREDIT", label: "Credit" },
    { value: "DEBIT", label: "Debit" },
    { value: "PREPAID", label: "Prepaid" },
  ];


  const riskLevelOptions = [
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ];

  const handleStatusToggle = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status as any)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status as any];
    
    onFiltersChange({ ...filters, status: newStatuses });
  };

  const handleTypeToggle = (type: string) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type as any)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type as any];
    
    onFiltersChange({ ...filters, type: newTypes });
  };


  const handleRiskLevelToggle = (level: string) => {
    const currentLevels = filters.riskLevel || [];
    const newLevels = currentLevels.includes(level as any)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level as any];
    
    onFiltersChange({ ...filters, riskLevel: newLevels });
  };

  const handleDateRangeChange = (field: "from" | "to", value: string) => {
    const newDateRange = {
      ...filters.dateRange,
      [field]: value,
    };
    
    onFiltersChange({ ...filters, dateRange: newDateRange });
  };

  const handleCreditLimitChange = (field: "min" | "max", value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    const newCreditLimitRange = {
      ...filters.creditLimitRange,
      [field]: numValue,
    };
    
    onFiltersChange({ ...filters, creditLimitRange: newCreditLimitRange });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status?.length) count++;
    if (filters.type?.length) count++;
    if (filters.riskLevel?.length) count++;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    if (filters.creditLimitRange?.min || filters.creditLimitRange?.max) count++;
    return count;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search by card name, number, or holder"
              value={filters.search || ""}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex flex-wrap gap-1">
              {statusOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.status?.includes(option.value as any) ? "default" : "outline"}
                  className={`cursor-pointer ${filters.status?.includes(option.value as any) ? option.color : ""}`}
                  onClick={() => handleStatusToggle(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Card Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Type</label>
            <div className="flex flex-wrap gap-1">
              {typeOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.type?.includes(option.value as any) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTypeToggle(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Risk Level Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Risk Level</label>
            <div className="flex flex-wrap gap-1">
              {riskLevelOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.riskLevel?.includes(option.value as any) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleRiskLevelToggle(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>


          {/* Super Admin Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Super Admin Status</label>
            <div className="flex flex-wrap gap-1">
              {statusOptions.filter(option => 
                ['PENDING', 'APPROVED', 'REJECTED'].includes(option.value)
              ).map((option) => (
                <Badge
                  key={option.value}
                  variant={filters.status?.includes(option.value as any) ? "default" : "outline"}
                  className={`cursor-pointer ${filters.status?.includes(option.value as any) ? option.color : ""}`}
                  onClick={() => handleStatusToggle(option.value)}
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="From"
                value={filters.dateRange?.from || ""}
                onChange={(e) => handleDateRangeChange("from", e.target.value)}
                className="flex-1"
              />
              <Input
                type="date"
                placeholder="To"
                value={filters.dateRange?.to || ""}
                onChange={(e) => handleDateRangeChange("to", e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {/* Credit Limit Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Credit Limit Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.creditLimitRange?.min || ""}
                onChange={(e) => handleCreditLimitChange("min", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters.creditLimitRange?.max || ""}
                onChange={(e) => handleCreditLimitChange("max", e.target.value)}
              />
            </div>
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardFilters;
