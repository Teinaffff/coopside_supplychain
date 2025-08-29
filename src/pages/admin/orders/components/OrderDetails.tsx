import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle,
    Clock,
    CreditCard,
    Package,
    XCircle,
} from "lucide-react";
import React from "react";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../../common/ui/tabs";
import { Order } from "../../../../constants/interface/admin/order";
import { formatCurrency } from "../../../../lib/utils";
import { useOrders } from "../../hooks/use-orders";

// Reusable Components
interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
      {label}
    </p>
    <p className="text-sm text-gray-900 dark:text-slate-100">{value}</p>
  </div>
);

const InfoFieldStart: React.FC<InfoFieldProps> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
      {label}
    </p>
    <div className="text-sm text-gray-900 dark:text-slate-100">{value}</div>
  </div>
);

interface SummaryCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  colorClass: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  value,
  label,
  colorClass,
}) => (
  <Card className="p-4 text-center dark:bg-slate-800 dark:border-slate-700">
    <div className={`${colorClass} mb-2`}>{icon}</div>
    <p className={`text-lg font-bold ${colorClass}`}>{value}</p>
    <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
  </Card>
);

interface ActivityItemProps {
  action: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, timestamp }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900 dark:text-slate-100">
        {action}
      </p>
      <p className="text-xs text-gray-500 dark:text-slate-400">{timestamp}</p>
    </div>
  </div>
);

interface StatusButtonProps {
  order: Order;
  isLoading: boolean;
}

const StatusButton: React.FC<StatusButtonProps> = ({ order, isLoading }) => {
  const { updateOrderStatus } = useOrders();

  const getStatusIcon = () => {
    switch (order.status) {
      case "PENDING":
        return <Clock className="w-4 h-4" />;
      case "CONFIRMED":
      case "PROCESSING":
      case "SHIPPED":
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
      case "RETURNED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "PENDING":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "CONFIRMED":
      case "PROCESSING":
        return "bg-cyan-500 hover:bg-cyan-600";
      case "SHIPPED":
        return "bg-purple-500 hover:bg-purple-600";
      case "DELIVERED":
        return "bg-green-500 hover:bg-green-600";
      case "CANCELLED":
      case "RETURNED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Button
      size="sm"
      className={`text-white ${getStatusColor()}`}
      disabled={isLoading}
    >
      {getStatusIcon()}
      <span className="ml-2">{order.status}</span>
    </Button>
  );
};

// Error State Component
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
        Order Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested order could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>
    </div>
  </div>
);

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, isLoading } = useOrders({ isFetchOrders: true });
  const order = orders?.find((o) => o?.id?.toString() === id);

  // Handler functions
  const handleBack = () => {
    navigate("/admin/orders");
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (!order) {
    return <ErrorState onBack={handleBack} />;
  }

  // Mock data for demonstration
  const recentActivities = [
    { action: "Order confirmed", timestamp: "2 hours ago" },
    { action: "Payment processed", timestamp: "1 day ago" },
    { action: "Order created", timestamp: "2 days ago" },
  ];

  return (
    <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBack}
        className="mb-6 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order Summary Card */}
        <Card className="lg:col-span-1 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
              {order.orderNumber}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">
              {order.orderType === "AGENT_TO_FACTORY"
                ? "Agent → Factory"
                : "Consumer → Agent"}
            </p>
            <Badge
              variant={order.status === "DELIVERED" ? "default" : "secondary"}
            >
              {order.status}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Information Card */}
        <Card className="lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between dark:text-slate-100">
              <span>Order Information</span>
              <div className="flex items-center space-x-2">
                <StatusButton
                  order={order as unknown as Order}
                  isLoading={isLoading}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <InfoField label="Buyer" value={order.buyerName} />
                <InfoField label="Seller" value={order.sellerName} />
                <InfoField
                  label="Total Amount"
                  value={formatCurrency(order.totalAmount)}
                />
                <InfoField
                  label="Priority"
                  value={
                    <Badge
                      variant={
                        order.priority === "URGENT"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {order.priority}
                    </Badge>
                  }
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <InfoField
                  label="Payment Status"
                  value={
                    <Badge
                      variant={
                        order.paymentInfo.status === "PAID"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.paymentInfo.status}
                    </Badge>
                  }
                />
                <InfoField
                  label="Created Date"
                  value={new Date(order.createdAt ?? "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                />
                <InfoField
                  label="Expected Delivery"
                  value={
                    order.expectedDeliveryDate
                      ? new Date(
                          order.expectedDeliveryDate
                        ).toLocaleDateString()
                      : "TBD"
                  }
                />
                <InfoField
                  label="Notes"
                  value={order.notes || "No notes available"}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Sections */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 dark:bg-slate-700">
          <TabsTrigger
            value="overview"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="items"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Items
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary Information */}
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <Package className="w-5 h-5" />
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <InfoField label="Order Number" value={order.orderNumber} />
                  <InfoField
                    label="Order Type"
                    value={
                      order.orderType === "AGENT_TO_FACTORY"
                        ? "Agent → Factory"
                        : "Consumer → Agent"
                    }
                  />
                  <InfoField
                    label="Buyer"
                    value={`${order.buyerName} (${order.buyerType})`}
                  />
                  <InfoField
                    label="Seller"
                    value={`${order.sellerName} (${order.sellerType})`}
                  />
                  <InfoField
                    label="Status"
                    value={
                      <Badge
                        variant={
                          order.status === "DELIVERED" ? "default" : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={formatCurrency(order.totalAmount)}
                label="Total Amount"
                colorClass="text-cyan-600 dark:text-cyan-400"
              />
              <SummaryCard
                icon={<Package className="w-8 h-8 mx-auto" />}
                value={order.items.length.toString()}
                label="Items Count"
                colorClass="text-green-600 dark:text-green-400"
              />
              <SummaryCard
                icon={<CreditCard className="w-8 h-8 mx-auto" />}
                value={formatCurrency(order.paymentInfo.paidAmount)}
                label="Paid Amount"
                colorClass="text-orange-600 dark:text-orange-400"
              />
              <SummaryCard
                icon={<Package className="w-8 h-8 mx-auto" />}
                value={order.priority}
                label="Priority"
                colorClass="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
        </TabsContent>

        {/* Items Tab - unchanged */}
        <TabsContent value="items">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <Package className="w-5 h-5" />
                <span>Order Items</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        Quantity: {item.quantity}
                      </p>
                      {item.specifications && (
                        <p className="text-xs text-gray-400 dark:text-slate-500">
                          {item.specifications}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Subtotal:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Tax:</span>
                    <span>{formatCurrency(order.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Discount:</span>
                    <span>-{formatCurrency(order.discountAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab - unchanged */}
        <TabsContent value="activity">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <ActivityItem
                    key={index}
                    action={activity.action}
                    timestamp={activity.timestamp}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default OrderDetails;
