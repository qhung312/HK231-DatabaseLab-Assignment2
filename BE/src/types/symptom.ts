export type HasSymptomInfo = {
  symptomId: string;
  description: string;
  periods: {
    seriousness: string;
    startDate: string;
    endDate: string;
  }[];
};

export type SymptomInfo = {
  symptomId: string;
  description: string;
};
