import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Users,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../common/Loader";
import { Badge } from "../../../../common/ui/badge";
import { Button } from "../../../../common/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../common/ui/card";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/ui/select";
import API from "../../../../config/axios-config";
import { ExportConsumersDataToExcel } from "./ExportConsumersDataToExcel";
import { useConsumers } from "../../hooks/useConsumers";
import { toast } from "react-hot-toast";


// Reusable Error State Component
interface ErrorStateProps {
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 dark:text-red-400 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
        Institution Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested institution could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Institution List
      </Button>
    </div>
  </div>
);

const ConsumerListPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [institution, setInstitution] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<string>("All");
  const [superAdminStatusFilter, setSuperAdminStatusFilter] = useState<string>("All");

  // Use the consumers hook
  const { 
    consumers, 
    isLoading, 
    error
  } = useConsumers(parseInt(id || "0"), true);

  // Handler functions
  const handleBack = () => {
    navigate(`/coop/approval/institutions/${id}`);
  };

  const handleViewConsumer = (consumerId: number) => {
    navigate(`/coop/approval/consumers/${consumerId}?institutionId=${id}`);
  };

  // Fetch institution data
  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const institutionResponse = await API.get(`/v1/institutions/${id}`);
        const institutionData = institutionResponse.data?.data || institutionResponse.data;
        setInstitution(institutionData);
      } catch (err: any) {
        console.error("Error fetching institution:", err);
      }
    };

    if (id) {
      fetchInstitution();
    }
  }, [id]);


  // Filter consumers based on search and status
  const filteredConsumers = consumers.filter((consumer) => {
    const matchesSearch = consumer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.nationalId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPartnerStatus = partnerStatusFilter === "All" || 
                                consumer.adminStatus === partnerStatusFilter;
    
    const matchesSuperAdminStatus = superAdminStatusFilter === "All" || 
                                   consumer.status === superAdminStatusFilter;
    
    return matchesSearch && matchesPartnerStatus && matchesSuperAdminStatus;
  });

  // Status badge helper function
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Approved: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 font-normal",
      Rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 font-normal",
      Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 font-normal",
    };
    
    const badgeClass = statusClasses[status as keyof typeof statusClasses] || "bg-gray-100 text-gray-700 font-normal";
    
    return (
      <Badge className={badgeClass}>
        {status}
      </Badge>
    );
  };


  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error || !institution) {
    return <ErrorState onBack={handleBack} />;
  }


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Institution Details
        </Button>

        {/* Header */}
        <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold dark:text-slate-100 flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Consumer List
                </h1>
                <p className="text-gray-600 dark:text-slate-400">
                  Institution: {institution.fullLegalName || institution.name}
                </p>
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                Total Consumers: {consumers.length}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, phone, department, or national ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerStatus">Status by Partner</Label>
                <Select value={partnerStatusFilter} onValueChange={setPartnerStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select partner status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="superAdminStatus">Status by Super Admin</Label>
                <Select value={superAdminStatusFilter} onValueChange={setSuperAdminStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select super admin status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consumers Table */}
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <Users className="w-5 h-5" />
                <span>Consumers ({filteredConsumers.length})</span>
              </CardTitle>
              <Button
                onClick={() => {
                  if (filteredConsumers.length > 0) {
                    ExportConsumersDataToExcel(filteredConsumers, institution?.name);
                  } else {
                    toast.error("No consumer data to export");
                  }
                }}
                disabled={isLoading || filteredConsumers.length === 0}
                className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export to Excel</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredConsumers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                   <thead className="bg-gray-50 dark:bg-slate-700">
                     <tr>
                       <th className="px-4 py-2 text-left font-medium">Name</th>
                       <th className="px-4 py-2 text-left font-medium">Email</th>
                       <th className="px-4 py-2 text-left font-medium">Phone</th>
                       <th className="px-4 py-2 text-left font-medium">Department</th>
                       <th className="px-4 py-2 text-left font-medium">Status by Partner</th>
                       <th className="px-4 py-2 text-left font-medium">Status by Super Admin</th>
                     </tr>
                   </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredConsumers.map((consumer) => (
                      <tr 
                        key={consumer.id} 
                        className="hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer"
                        onClick={() => handleViewConsumer(consumer.id)}
                      >
                        <td className="px-4 py-2 whitespace-nowrap font-medium text-blue-600 dark:text-blue-400">
                          {consumer.fullName}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{consumer.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{consumer.phoneNumber}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{consumer.department}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {getStatusBadge(consumer.adminStatus)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {getStatusBadge(consumer.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No consumers found</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
         </Card>
       </Card>

     </div>
   );
 };
 
 export default ConsumerListPage;
