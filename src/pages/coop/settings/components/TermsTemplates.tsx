import { useState } from "react";
import { Card } from "../../../../common/ui/card";
import { Button } from "../../../../common/ui/button";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import { Textarea } from "../../../../common/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../common/ui/select";
import { Checkbox } from "../../../../common/ui/checkbox";
import { Badge } from "../../../../common/ui/badge";
import { Plus, Edit, Trash2, Eye, FileText, Copy } from "lucide-react";

interface TermsTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  isActive: boolean;
  version: string;
  lastModified: string;
  createdBy: string;
  effectiveDate: string;
  expiryDate?: string;
}

const TermsTemplates = () => {
  const [templates, setTemplates] = useState<TermsTemplate[]>([
    {
      id: "1",
      name: "Consumer Credit Terms & Conditions",
      description: "Standard terms and conditions for consumer loans",
      category: "consumer",
      content: `CONSUMER LOAN TERMS AND CONDITIONS

1. LOAN AGREEMENT
This Consumer Loan Agreement ("Agreement") is entered into between [Cooperative Name] ("Lender") and the borrower ("Borrower").

2. LOAN AMOUNT
The maximum loan amount is ETB 50,000 with a minimum of ETB 1,000.

3. INTEREST RATE
The annual interest rate is 12.5% calculated on a reducing balance basis.

4. REPAYMENT TERMS
- Repayment period: 3 to 12 months
- Installment frequency: Monthly
- First payment due: 30 days from disbursement

5. FEES AND CHARGES
- Processing fee: 2.5% of loan amount
- Late payment fee: ETB 200 per occurrence
- Early repayment fee: 1% of outstanding balance

6. DEFAULT AND REMEDIES
The loan shall be considered in default if:
- Any installment is not paid within 7 days of due date
- Borrower fails to comply with any term of this agreement

7. COLLATERAL
No collateral is required for this loan product.

8. GOVERNING LAW
This agreement shall be governed by the laws of Ethiopia.

9. DISPUTE RESOLUTION
Any disputes shall be resolved through arbitration in accordance with Ethiopian law.`,
      isActive: true,
      version: "1.2",
      lastModified: "2024-01-15T10:00:00Z",
      createdBy: "Admin User",
      effectiveDate: "2024-01-01",
      expiryDate: "2024-12-31"
    },
    {
      id: "2",
      name: "Agent Loan Terms & Conditions",
      description: "Terms and conditions for agent loans",
      category: "agent",
      content: `AGENT LOAN TERMS AND CONDITIONS

1. AGENT LOAN AGREEMENT
This Agent Loan Agreement ("Agreement") is entered into between [Cooperative Name] ("Lender") and the agent ("Borrower").

2. LOAN AMOUNT
The maximum loan amount is ETB 200,000 with a minimum of ETB 5,000.

3. INTEREST RATE
The annual interest rate is 10.5% calculated on a reducing balance basis.

4. REPAYMENT TERMS
- Repayment period: 6 to 24 months
- Installment frequency: Monthly
- First payment due: 30 days from disbursement

5. AGENT REQUIREMENTS
- Valid agent registration with the cooperative
- Minimum 6 months of active agent status
- Good standing with the cooperative
- No outstanding debts or violations

6. COLLATERAL REQUIREMENTS
- Collateral required for loans above ETB 50,000
- Acceptable collateral includes equipment, inventory, or guarantor
- Guarantor required for all agent loans

7. FEES AND CHARGES
- Processing fee: 2% of loan amount
- Late payment fee: 1.5% of overdue amount
- Early repayment fee: 1% of outstanding balance

8. DEFAULT AND REMEDIES
The loan shall be considered in default if:
- Any installment is not paid within 14 days of due date
- Agent status is suspended or terminated
- Violation of cooperative rules and regulations

9. GOVERNING LAW
This agreement shall be governed by the laws of Ethiopia.`,
      isActive: true,
      version: "1.1",
      lastModified: "2024-01-10T10:00:00Z",
      createdBy: "Admin User",
      effectiveDate: "2024-01-01"
    },
    {
      id: "3",
      name: "General Loan Terms",
      description: "General terms and conditions for all loan types",
      category: "general",
      content: `GENERAL LOAN TERMS AND CONDITIONS

1. GENERAL LOAN AGREEMENT
This General Loan Agreement ("Agreement") is entered into between [Cooperative Name] ("Lender") and the borrower ("Borrower").

2. LOAN AMOUNT
Loan amounts vary based on the specific loan product and borrower eligibility.

3. INTEREST RATE
Interest rates are determined based on the loan product type and borrower risk assessment.

4. REPAYMENT TERMS
- Repayment periods vary by loan product
- Installment frequency as specified in the loan agreement
- First payment due as per the specific loan terms

5. GENERAL REQUIREMENTS
- Valid identification and membership with the cooperative
- Compliance with cooperative rules and regulations
- Good standing with the cooperative
- No outstanding debts or violations

6. FEES AND CHARGES
- Processing fees as specified in the loan product
- Late payment fees as per the loan agreement
- Early repayment fees as applicable

7. DEFAULT AND REMEDIES
The loan shall be considered in default if:
- Any installment is not paid within the grace period
- Borrower fails to comply with loan terms
- Violation of cooperative rules and regulations

8. GOVERNING LAW
This agreement shall be governed by the laws of Ethiopia.`,
      isActive: true,
      version: "1.0",
      lastModified: "2024-01-05T10:00:00Z",
      createdBy: "Admin User",
      effectiveDate: "2024-01-01"
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TermsTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "consumer", label: "Consumer Loan" },
    { value: "agent", label: "Agent Loan" }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = (templateData: Partial<TermsTemplate>) => {
    const newTemplate: TermsTemplate = {
      id: Date.now().toString(),
      name: templateData.name || "",
      description: templateData.description || "",
      category: templateData.category || "general",
      content: templateData.content || "",
      isActive: true,
      version: "1.0",
      lastModified: new Date().toISOString(),
      createdBy: "Current User",
      effectiveDate: templateData.effectiveDate || new Date().toISOString().split('T')[0],
      expiryDate: templateData.expiryDate,
      ...templateData
    };
    setTemplates([...templates, newTemplate]);
    setIsCreateModalOpen(false);
  };

  const handleEditTemplate = (templateData: Partial<TermsTemplate>) => {
    if (!selectedTemplate) return;
    const updatedTemplate = {
      ...selectedTemplate,
      ...templateData,
      lastModified: new Date().toISOString()
    };
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? updatedTemplate : t));
    setIsEditModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  const handleDuplicateTemplate = (template: TermsTemplate) => {
    const duplicatedTemplate: TermsTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      version: "1.0",
      lastModified: new Date().toISOString(),
      createdBy: "Current User"
    };
    setTemplates([...templates, duplicatedTemplate]);
  };

  const openEditModal = (template: TermsTemplate) => {
    setSelectedTemplate(template);
    setIsEditModalOpen(true);
  };

  const openViewModal = (template: TermsTemplate) => {
    setSelectedTemplate(template);
    setIsViewModalOpen(true);
  };

  const handleToggleStatus = (templateId: string) => {
    setTemplates(templates.map(t => 
      t.id === templateId ? { ...t, isActive: !t.isActive } : t
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Terms & Conditions Templates</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage terms and conditions templates for different loan products</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search templates by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {template.description}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{template.category}</Badge>
                  <Badge variant="secondary">v{template.version}</Badge>
                  <div className="flex items-center gap-2">
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(template.id)}
                      className="p-1 h-6"
                    >
                      {template.isActive ? "✓" : "✗"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <div>Effective: {new Date(template.effectiveDate).toLocaleDateString()}</div>
                {template.expiryDate && (
                  <div>Expires: {new Date(template.expiryDate).toLocaleDateString()}</div>
                )}
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Last modified: {new Date(template.lastModified).toLocaleDateString()}
              <br />
              Created by: {template.createdBy}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openViewModal(template)}
                  className="p-1"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEditModal(template)}
                  className="p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDuplicateTemplate(template)}
                  className="p-1"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Template Modal */}
      {isCreateModalOpen && (
        <TemplateFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateTemplate}
          title="Create New Template"
        />
      )}

      {/* Edit Template Modal */}
      {isEditModalOpen && selectedTemplate && (
        <TemplateFormModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedTemplate(null);
          }}
          onSubmit={handleEditTemplate}
          initialData={selectedTemplate}
          title="Edit Template"
        />
      )}

      {/* View Template Modal */}
      {isViewModalOpen && selectedTemplate && (
        <TemplateViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
        />
      )}
    </div>
  );
};

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TermsTemplate>) => void;
  initialData?: TermsTemplate;
  title: string;
}

const TemplateFormModal = ({ isOpen, onClose, onSubmit, initialData, title }: TemplateFormModalProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "general",
    content: initialData?.content || "",
    effectiveDate: initialData?.effectiveDate || new Date().toISOString().split('T')[0],
    expiryDate: initialData?.expiryDate || "",
    isActive: initialData?.isActive ?? true
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter template name"
                required
              />
            </div>
            <div>
              <Label htmlFor="templateCategory">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumer">Consumer Loan</SelectItem>
                  <SelectItem value="agent">Agent Loan</SelectItem>
                  <SelectItem value="general">General Terms</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="templateDescription">Description *</Label>
            <Input
              id="templateDescription"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter template description"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="templateActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleInputChange('isActive', checked)}
            />
            <Label htmlFor="templateActive">Template is active</Label>
          </div>

          <div>
            <Label htmlFor="templateEffectiveDate">Effective Date</Label>
            <Input
              id="templateEffectiveDate"
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="templateExpiryDate">Expiry Date (Optional)</Label>
            <Input
              id="templateExpiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            />
          </div>


          <div>
            <Label htmlFor="templateContent">Content *</Label>
            <Textarea
              id="templateContent"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Enter terms and conditions content..."
              rows={15}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface TemplateViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TermsTemplate;
}

const TemplateViewModal = ({ isOpen, onClose, template }: TemplateViewModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{template.name}</h2>
          <Button variant="ghost" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Category:</strong> {template.category}
            </div>
            <div>
              <strong>Version:</strong> {template.version}
            </div>
            <div>
              <strong>Effective Date:</strong> {new Date(template.effectiveDate).toLocaleDateString()}
            </div>
            {template.expiryDate && (
              <div>
                <strong>Expiry Date:</strong> {new Date(template.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div>
            <strong>Description:</strong>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
          </div>


          <div>
            <strong>Content:</strong>
            <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm">{template.content}</pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsTemplates;
