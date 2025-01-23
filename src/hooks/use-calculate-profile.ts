import { ChangeProfileProps } from "../constants/interface/pc/profile";

export const CalculateCompletion = (
  profileData: ChangeProfileProps
): number => {
  const FieldsPoint: Record<string, number> = {
    fullName: 10,
    phone: 10,
    email: 5,
    address: 10,
    pcName: 10,
    pcPhone: 10,
    pcEmail: 0,
    licenseNo: 10,
    tinNo: 10,
    accNo: 10,
    pcAddress: 10,
    purpose: 5,
  };

  let result = Object.entries(FieldsPoint)
    // @ts-ignore
    .filter(([key, _]) => {
      // Check if the value is not empty string or empty address object
      if (key === "address" || key === "pcAddress") {
        return Object.values(profileData.address).some((val) => val !== "");
      } else {
        return profileData[key as keyof ChangeProfileProps] !== "";
      }
    })
    .reduce((acc, [key, value]) => acc + FieldsPoint[key], 0);
  return result;
};
