export interface AppointmentModel {
  id?: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  name: string;
  address: string;
  taj: string;
  email: string;
  phone: string;
  note?: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
}
