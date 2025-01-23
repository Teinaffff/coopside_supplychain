import { UseFormSetValue } from "react-hook-form";
import {
  City,
  Woreda,
  Subcity,
} from "../../../../constants/interface/pc/profile";

export const handleCityChange = (
  value: string,
  cities: City[],
  setFilteredSubcities: React.Dispatch<React.SetStateAction<Subcity[]>>,
  setValue: UseFormSetValue<any>,
  addressField: string
) => {
  const selectedCity = cities.find((City) => City.cityName === value);
  if (selectedCity) {
    setFilteredSubcities(selectedCity.subcities);
    setValue(`${addressField}.subcity`, "", { shouldValidate: false });
  } else {
    setFilteredSubcities([]);
  }
  setValue(`${addressField}.city`, value, { shouldValidate: true });
};

export const handleSubcityChange = (
  value: string,
  subcities: Subcity[],
  setFilteredWoredas: React.Dispatch<React.SetStateAction<Woreda[]>>,
  setValue: UseFormSetValue<any>,
  addressField: string
) => {
  const selectedSubcity = subcities.find(
    (subcity) => subcity.subcityName === value
  );
  if (selectedSubcity) {
    setFilteredWoredas(selectedSubcity.woredas);
    setValue(`${addressField}.woreda`, "", { shouldValidate: false });
  } else {
    setFilteredWoredas([]);
  }
  setValue(`${addressField}.subcity`, value, { shouldValidate: true });
};
