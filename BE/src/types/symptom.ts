export type SymptomPeriod = {
  startDate: string;
  endDate: string;
  seriousness: string;
};

export type HasSymptomInfo = {
  symptomId: string;
  description: string;
  periods: SymptomPeriod[];
};

export type SymptomInfo = {
  symptomId: string;
  description: string;
};
