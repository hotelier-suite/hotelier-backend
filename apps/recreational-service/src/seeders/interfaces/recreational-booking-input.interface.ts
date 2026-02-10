import {
  RecreationalBookingStatus,
  BookingPriority,
} from '@app/contracts/recreational-service';

export interface RecreationalBookingInput {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomNumber: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  participants: number;
  totalCost: number;
  status: RecreationalBookingStatus;
  priority: BookingPriority;
  specialRequests?: string;
  staffNotes?: string;
  actualCheckIn?: Date;
  actualCheckOut?: Date;
  facilityId: number;
}
