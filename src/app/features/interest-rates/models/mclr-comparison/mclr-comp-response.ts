interface BankMclrData {
  bank_code: string;
  bank_name: string;
  frequency_type: string;
  mclr_rate: number;
  effective_date: string;
}

interface BankMclrDataset {
  name: string;
  type: string;
  data: number[];
}

export interface MclrCompResponse {
  data: BankMclrData;
  dataset: BankMclrDataset;
  category: string[];
}
