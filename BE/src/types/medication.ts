export type MedicationEffect = {
  medEffectId: string;
  medEffect: string;
};

export interface MedicationInfo {
  medId: string;
  medName: string;
  expiredDate: string;
  effects: MedicationEffect[];
  price: number;
}
