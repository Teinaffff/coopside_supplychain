import React from "react";
import { Card } from "../../../common/ui/card";
import { Heading } from "../../../common/ui/heading";
import { Button } from "../../../common/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "../../../common/ui/data-table";
import { columns } from "./components/columns";
import { licenses } from "../../../common/data/data";
import { useNavigate } from "react-router-dom";

const LicensePage = () => {
  const navigate = useNavigate();
  return (
    <Card className="p-5">
      <div className="flex border-b pb-2 items-center justify-between">
        <Heading
          title={`License Management`}
          description="Manage PC licenses"
        />
        <div className="flex space-x-2">
          <Button
            className="bg-cyan-500 hover:bg-cyan-500"
            onClick={() => navigate("/pc/application")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>
      <DataTable
        searchKey="name"
        clickable={true}
        columns={columns}
        data={licenses}
      />
    </Card>
  );
};

export default LicensePage;
