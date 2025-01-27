export interface City {
    id: number;
    createdAt: string;
    cityName: string;
    isEnabled: boolean;
    subcities: Subcity[];
  }
  
  export interface Subcity {
    id: number;
    createdAt: string;
    subcityName: string;
    cityName: string;
    isEnabled: boolean;
    woredas: Woreda[];
  }
  
  export interface Woreda {
    id: number;
    createdAt: string;
    woredaName: string;
    subcityName: string;
  }