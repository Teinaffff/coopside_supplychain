import { profitData } from "../../../common/data/data";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { columns } from "./components/columns";
import ExportProfitDataToExcel from "./components/ExporProfitDataToExcel";

const ProfitPage = () => {
  return (
    <Card className="p-5">
      <div className="flex border-b pb-2 items-center justify-between">
        <Heading title={`Profit`} description="Profit Details" />
      </div>
      <DataTable
        searchKey="year"
        clickable={true}
        columns={columns}
        data={profitData}
        onExport={ExportProfitDataToExcel}
      />
    </Card>
  );
};

export default ProfitPage;
