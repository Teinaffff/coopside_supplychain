import React from "react";
import { Card } from "../../../common/ui/card";
import { Textarea } from "../../../common/ui/textarea";
import { Button } from "../../../common/ui/button";

const RequestForm = ({
  title,
  subtitle,
  placeholder,
  buttonText,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  buttonText: string;
}) => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>

      <Textarea placeholder={placeholder} className="h-24" />

      <Button className=" bg-cyan-500 hover:bg-cyan-500 text-white">
        {buttonText}
      </Button>
    </Card>
  );
};

export default RequestForm;
