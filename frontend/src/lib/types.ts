// ── Backend model interfaces ──

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  destination: string;
  visibility: TripVisibility;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripMember {
  id: string;
  tripId: string;
  userId: string;
  role: MemberRole;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Invite {
  id: string;
  tripId: string;
  email: string;
  role: MemberRole;
  status: InviteStatus;
  inviterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Day {
  id: string;
  tripId: string;
  date: string;
  position: number;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  dayId: string;
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  status: ActivityStatus;
  position: number;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  dayId: string | null;
  activityId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Checklist {
  id: string;
  tripId: string;
  title: string;
  type: ChecklistType;
  createdAt: string;
  updatedAt: string;
  items?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  checklistId: string;
  content: string;
  isCompleted: boolean;
  assignedTo: string | null;
  position: number;
  assignee?: User;
}

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  paidById: string;
  splitType: SplitType;
  paidBy?: User;
  participants?: ExpenseParticipant[];
}

export interface ExpenseParticipant {
  id: string;
  expenseId: string;
  userId: string;
  amount: number;
  user?: User;
}

export interface Reservation {
  id: string;
  tripId: string;
  type: ReservationType;
  title: string;
  confirmationNo: string | null;
  startDate: string | null;
  endDate: string | null;
  location: string | null;
  notes: string | null;
}

export interface Attachment {
  id: string;
  tripId: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
}

// ── Enums ──

export type TripVisibility = "PRIVATE" | "SHARED";
export type MemberRole = "OWNER" | "EDITOR" | "VIEWER";
export type ActivityStatus = "PLANNED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type ChecklistType = "PACKING" | "TODO" | "CUSTOM";
export type SplitType = "EQUAL" | "CUSTOM";
export type InviteStatus = "PENDING" | "ACCEPTED" | "DECLINED";
export type ReservationType = "FLIGHT" | "HOTEL" | "TRAIN" | "BUS" | "EVENT" | "OTHER";

// ── API Response ──

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// ── Auth Types ──

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
