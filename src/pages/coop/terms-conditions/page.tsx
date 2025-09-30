import { useState } from "react";
import { Button } from "../../../common/ui/button";
import { Textarea } from "../../../common/ui/textarea";
import { Input } from "../../../common/ui/input";

const TermsConditionsPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loanDefinition, setLoanDefinition] = useState(
    "This Agreement governs the terms under which (the [Bank Name]) (the Bank) will extend credit facilities to [Borrower Name] (the Borrower) in the form of a"
  );
  const [loanAmountLimits, setLoanAmountLimits] = useState(
    "The minimum loan amount is [ETB X,XXX.], and maximum loan amount is [ETB.XX,XXX.] in the form of a consumer loan at 1[ETB]."
  );
  const [tenureRepayment, setTenureRepayment] = useState(
    "The loan tenure is between 6 and 24 months. Early repayment without penalty."
  );
  const [interestFees, setInterestFees] = useState(
    "Interest rate of 12% per annum. Current average and accruing penalties without any penalty."
  );
  const [disbursementConditions, setDisbursementConditions] = useState(
    "The loan will be disbursed directly to the Borrower's cooperative wallet or supplier. Expires if not used within 7 days of approval."
  );
  const [eligibility, setEligibility] = useState(
    "The loan is available to cooperative members with at least 6 months of arbitrary. Must submit satisfactory documents to provide necessary documents."
  );
  const [borrowerObligations1, setBorrowerObligations1] = useState(
    "Borrower agrees to repay the loan in full and on time, or as agreed."
  );
  const [borrowerObligations2, setBorrowerObligations2] = useState(
    "Use loan proceeds only for approved purposes, no illegal activities."
  );
  const [borrowerObligations3, setBorrowerObligations3] = useState(
    "Maintain active cooperative membership and provide accurate."
  );
  const [defaultRemediesDesc, setDefaultRemediesDesc] = useState(
    "The Borrower is in default if repayment is overdue beyond the agreed upon timeframe."
  );
  const [defaultRemedies1, setDefaultRemedies1] = useState(
    "Loan funds are not to be used for illegal purposes."
  );
  const [defaultRemedies2, setDefaultRemedies2] = useState(
    "False information is provided or any other fraudulent behavior."
  );
  const [rightsOfTheBankDesc, setRightsOfTheBankDesc] = useState(
    "The Bank reserves the right to adjust credit limits based on the Borrower's repayment performance."
  );
  const [rightsOfTheBank3, setRightsOfTheBank3] = useState(
    "Share the Borrower's credit history with relevant authorities, and suspend or withdraw credit facilities without prior notice."
  );
  const [governingLaw, setGoverningLaw] = useState(
    "This Agreement shall be governed by the laws of [Jurisdiction]. Any disputes arising should shall first be resolved through negotiation and, if unresolved, by arbitration under the rules of [Arbitration Body]."
  );
  const [signedBy, setSignedBy] = useState("_________________________");
  const [bankRepresentativeName, setBankRepresentativeName] = useState("_________________________");

  const handleDownload = () => {
    const content = `
TERMS AND CONDITIONS – CONSUMER LOAN

1. Loan Definition
${loanDefinition}

2. Loan Amount and Limits
${loanAmountLimits}

3. Tenure and Repayment
${tenureRepayment}

4. Interest and Fees
${interestFees}

5. Disbursement Conditions
${disbursementConditions}

6. Eligibility
${eligibility}

7. Borrower's Obligations
1. ${borrowerObligations1}
2. ${borrowerObligations2}
3. ${borrowerObligations3}

8. Default and Remedies
${defaultRemediesDesc}
1. ${defaultRemedies1}
2. ${defaultRemedies2}

9. Rights of the Bank
${rightsOfTheBankDesc}
3. ${rightsOfTheBank3}

10. Governing Law and Dispute Resolution
${governingLaw}

Signed by: ${signedBy}
Bank Representative Name ${bankRepresentativeName}
    `;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "terms_and_conditions.txt";
    document.body.appendChild(element); // Required for Firefox
    element.click();
    document.body.removeChild(element); // Clean up
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real application, you would send the updated content to a backend here.
    console.log("Saving changes...");
    console.log({
      loanDefinition,
      loanAmountLimits,
      tenureRepayment,
      interestFees,
      disbursementConditions,
      eligibility,
      borrowerObligations1,
      borrowerObligations2,
      borrowerObligations3,
      defaultRemediesDesc,
      defaultRemedies1,
      defaultRemedies2,
      rightsOfTheBankDesc,
      rightsOfTheBank3,
      governingLaw,
      signedBy,
      bankRepresentativeName,
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">TERMS AND CONDITIONS</h1>
        <div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <Button onClick={handleSave}>Save</Button>
          )}
        </div>
      </div>

      <div className="prose max-w-none">
        <h2 className="font-bold">1. Loan Definition</h2>
        {isEditing ? (
          <Textarea value={loanDefinition} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLoanDefinition(e.target.value)} rows={4} className="mb-2" />
        ) : (
          <p className="my-2">{loanDefinition}</p>
        )}

        <h2 className="font-bold">2. Loan Amount and Limits</h2>
        {isEditing ? (
          <Textarea value={loanAmountLimits} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLoanAmountLimits(e.target.value)} rows={4} className="mb-2" />
        ) : (
          <p className="my-2">{loanAmountLimits}</p>
        )}

        <h2 className="font-bold">3. Tenure and Repayment</h2>
        {isEditing ? (
          <Textarea value={tenureRepayment} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTenureRepayment(e.target.value)} rows={3} className="mb-2" />
        ) : (
          <p className="my-2">{tenureRepayment}</p>
        )}

        <h2 className="font-bold">4. Interest and Fees</h2>
        {isEditing ? (
          <Textarea value={interestFees} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInterestFees(e.target.value)} rows={3} className="mb-2" />
        ) : (
          <p className="my-2">{interestFees}</p>
        )}

        <h2 className="font-bold">5. Disbursement Conditions</h2>
        {isEditing ? (
          <Textarea value={disbursementConditions} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDisbursementConditions(e.target.value)} rows={4} className="mb-2" />
        ) : (
          <p className="my-2">{disbursementConditions}</p>
        )}

        <h2 className="font-bold">6. Eligibility</h2>
        {isEditing ? (
          <Textarea value={eligibility} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEligibility(e.target.value)} rows={4} className="mb-2" />
        ) : (
          <p className="my-2">{eligibility}</p>
        )}

        <h2 className="font-bold">7. Borrower's Obligations</h2>
        <ol>
          <li>
            {isEditing ? (
              <Textarea value={borrowerObligations1} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBorrowerObligations1(e.target.value)} rows={2} className="mb-2" />
            ) : (
              <p className="my-2">{borrowerObligations1}</p>
            )}
          </li>
          <li>
            {isEditing ? (
              <Textarea value={borrowerObligations2} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBorrowerObligations2(e.target.value)} rows={2} className="mb-2" />
            ) : (
              <p className="my-2">{borrowerObligations2}</p>
            )}
          </li>
          <li>
            {isEditing ? (
              <Textarea value={borrowerObligations3} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBorrowerObligations3(e.target.value)} rows={2} className="mb-2" />
            ) : (
              <p className="my-2">{borrowerObligations3}</p>
            )}
          </li>
        </ol>

        <h2 className="font-bold">8. Default and Remedies</h2>
        {isEditing ? (
          <Textarea value={defaultRemediesDesc} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDefaultRemediesDesc(e.target.value)} rows={3} className="mb-2" />
        ) : (
          <p className="my-2">{defaultRemediesDesc}</p>
        )}
        <ol>
          <li>
            {isEditing ? (
              <Textarea value={defaultRemedies1} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDefaultRemedies1(e.target.value)} rows={2} className="mb-2" />
            ) : (
              <p className="my-2">{defaultRemedies1}</p>
            )}
          </li>
          <li>
            {isEditing ? (
              <Textarea value={defaultRemedies2} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDefaultRemedies2(e.target.value)} rows={2} className="mb-2" />
            ) : (
              <p className="my-2">{defaultRemedies2}</p>
            )}
          </li>
        </ol>

        <h2 className="font-bold">9. Rights of the Bank</h2>
        {isEditing ? (
          <Textarea value={rightsOfTheBankDesc} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRightsOfTheBankDesc(e.target.value)} rows={3} className="mb-2" />
        ) : (
          <p className="my-2">{rightsOfTheBankDesc}</p>
        )}
        <ol start={3}>
          <li>
            {isEditing ? (
              <Textarea value={rightsOfTheBank3} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRightsOfTheBank3(e.target.value)} rows={3} className="mb-2" />
            ) : (
              <p className="my-2">{rightsOfTheBank3}</p>
            )}
          </li>
        </ol>

        <h2 className="font-bold">10. Governing Law and Dispute Resolution</h2>
        {isEditing ? (
          <Textarea value={governingLaw} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setGoverningLaw(e.target.value)} rows={5} className="mb-2" />
        ) : (
          <p className="my-2">{governingLaw}</p>
        )}

        <p className="mt-4">
          Signed by:{" "}
          {isEditing ? (
            <Input value={signedBy} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSignedBy(e.target.value)} className="inline-block w-auto" />
          ) : (
            <span className="my-2">{signedBy}</span>
          )}
        </p>
        <p>
          Bank Representative Name:{" "}
          {isEditing ? (
            <Input value={bankRepresentativeName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankRepresentativeName(e.target.value)} className="inline-block w-auto" />
          ) : (
            <span className="my-2">{bankRepresentativeName}</span>
          )}
        </p>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={handleDownload}>Download </Button>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
