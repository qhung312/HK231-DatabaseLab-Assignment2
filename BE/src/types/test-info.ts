export type TestInfo = {
  patientId: string;
  patientInstanceOrder: number;
  testOrder: number;

  timestamp: string;

  type: string;
  spo2Rate: number;
  result: number;
  ctThreshold: number;
  respiratoryBpm: number;
};
