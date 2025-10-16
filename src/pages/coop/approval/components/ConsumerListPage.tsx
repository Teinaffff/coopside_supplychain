import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Users,
  Eye,
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

// Consumer interface
interface Consumer {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  status: "Active" | "Inactive" | "Pending";
  createdAt: string;
  institutionId: number;
}

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
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [institution, setInstitution] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Handler functions
  const handleBack = () => {
    navigate("/coop/approval?tab=institutions");
  };

  const handleViewConsumer = (consumerId: number) => {
    navigate(`/coop/approval/consumers/${consumerId}`);
  };

         // Fetch institution and consumers data
         useEffect(() => {
           const fetchData = async () => {
             try {
               setIsLoading(true);

               // Fetch institution details
               const institutionResponse = await API.get(`/v1/institutions/${id}`);
               const institutionData = institutionResponse.data?.data || institutionResponse.data;
               setInstitution(institutionData);

               // Fetch consumers for this specific institution
               const consumersResponse = await API.get(`/v1/consumers/institution/${id}`);
               const consumersData = consumersResponse.data?.data || consumersResponse.data || [];

               // Transform consumers data
               const transformedConsumers = consumersData.map((consumer: any) => ({
                 id: consumer.id,
                 fullName: consumer.fullName || consumer.name || `Consumer ${consumer.id}`,
                 email: consumer.email || "",
                 phoneNumber: consumer.phoneNumber || consumer.phone || "",
                 nationalId: consumer.nationalId || consumer.idNumber || "",
                 status: consumer.status === "ACTIVE" ? "Active" :
                         consumer.status === "INACTIVE" ? "Inactive" : "Pending",
                 createdAt: consumer.createdAt || new Date().toISOString(),
                 institutionId: parseInt(id || "0"),
               }));

               setConsumers(transformedConsumers);
             } catch (err: any) {
               console.error("Error fetching data:", err);
               setError(err?.response?.data?.message || err.message || "Failed to load data");
             } finally {
               setIsLoading(false);
             }
           };

           if (id) {
             fetchData();
           }
         }, [id]);

  // Filter consumers based on search and status
  const filteredConsumers = consumers.filter((consumer) => {
    const matchesSearch = consumer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consumer.nationalId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || consumer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (error || !institution) {
    return <ErrorState onBack={handleBack} />;
  }

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status}
      </span>
    );
  };

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
          Back to Institution List
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name, email, or national ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
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
            <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
              <Users className="w-5 h-5" />
              <span>Consumers ({filteredConsumers.length})</span>
            </CardTitle>
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
                      <th className="px-4 py-2 text-left font-medium">National ID</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                      <th className="px-4 py-2 text-left font-medium">Created</th>
                      <th className="px-4 py-2 text-left font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredConsumers.map((consumer) => (
                      <tr key={consumer.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="px-4 py-2 whitespace-nowrap font-medium">
                          {consumer.fullName}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">{consumer.email}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{consumer.phoneNumber}</td>
                        <td className="px-4 py-2 whitespace-nowrap">{consumer.nationalId}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {getStatusBadge(consumer.status)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          {new Date(consumer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewConsumer(consumer.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
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
