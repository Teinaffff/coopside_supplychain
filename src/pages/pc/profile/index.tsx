import React from "react";
import { Card } from "../../../common/ui/card";
import ChangeProfile from "./components/ChangeProfile";

const ProfilePage = () => {
  return (
    <Card className="p-5">
      <ChangeProfile />
    </Card>
  );
};

export default ProfilePage;
