import { Medicine } from "./Medicines";

export interface User {
    name: {
      firstname: string;
      lastname: string;
    };
    email: string;
    password: string;
    medicines: Medicine[];
    completed_tasks: Medicine[];
  }