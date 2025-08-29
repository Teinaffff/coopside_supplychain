import { useNavigate } from "react-router-dom";
import { Loan } from "../../../../constants/interface/admin/loan";

interface LoanActionsProps {
  onEdit?: (loan: Loan) => void;
  onDownloadDocuments?: (loan: Loan) => void;
}

export const useLoanActions = ({
  onEdit,
  onDownloadDocuments,
}: LoanActionsProps = {}) => {
  const navigate = useNavigate();

  const handleViewDetails = (loanId: string) => {
    navigate(`/admin/loans/${loanId}`);
  };

  const handleEdit = (loan: Loan) => {
    if (onEdit) {
      onEdit(loan);
    } else {
      // Default edit action
      console.log("Edit loan:", loan.loanId);
    }
  };

  const handleDownloadDocuments = (loan: Loan) => {
    if (onDownloadDocuments) {
      onDownloadDocuments(loan);
    } else {
      // Default download action
      console.log("Download documents for loan:", loan.loanId);
    }
  };

  const handleNewLoan = () => {
    navigate("/admin/loans/new");
  };

  return {
    handleViewDetails,
    handleEdit,
    handleDownloadDocuments,
    handleNewLoan,
  };
};
