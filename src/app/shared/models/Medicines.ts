export interface Medicine {
    id: number;
    name: string;
    completed: boolean;
    medicationStartDate: Date;
    medicationEndDate: Date;
    description?: string;
  }