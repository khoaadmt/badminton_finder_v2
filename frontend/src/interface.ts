export interface Shift {
  id: number;
  shiftNumber: number;
  startTime: string;
  endTime: string;
  period: string;
  price: number;
}
export interface Court {
  id: number;
  courtNumber: number;
}
export interface BadmintonVenue {
  id: number;
  city: string;
  name: string;
  contact_phone: string;
  contactPhone: string;
  description: string;
  courts: Court[];
  shifts: Shift[];
  img: string[];
  address: string;
  priceMin: number;
  priceMax: number;
  numberOfCourts: number;
  openHours: {
    start: Date;
    end: Date;
  };
  openDays: {
    start: string;
    end: string;
  };
  latitude: number;
  longitude: number;
  distance: { text: string; value: number };
}
interface userInfor {
  type: string;
  displayName: string;
  username: string;
  avaUrl: string;
  contactPhone: string;
  facebookId: string;
}
export interface Post {
  id: number;
  title: string;
  description: string;
  memberCount: number;
  startTime: number;
  gender: number;
  phones: string[];
  images: string[];
  levelMemberMin: number;
  levelMemberMax: number;
  priceMin: number;
  priceMax: number;
  agreement: boolean;
  user: userInfor;
  location: BadmintonVenue;
  status: string;
  distance: {
    text: string;
    value: number;
  };
}

export interface ResponseLocation {
  location: BadmintonVenue;
  distance: {
    text: string;
    value: number;
  };
}
export interface AuthState {
  login: {
    currentUser: {
      username: string;
      user_id: number;
      displayName: string;
      avaUrl: string;
      contactPhone: string;
      facebookId: string;
      accessToken: string;
      refreshToken: string;
      role: string;
    } | null;
    isFetching: boolean;
    error: boolean;
  };
  register: {
    isFetching: false;
    error: false;
  };
  mgs: string;
}
export interface LoadingState {
  show: boolean;
  message?: string;
}
export interface RootState {
  auth: AuthState;
  loading: LoadingState;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
}
export interface Optional {
  index: number;
  label: string;
  value: number;
}
export interface FilterOptions {
  sortBy: any;
  distance: number;
  level: number;
  date: string;
  time: string;
  price: number;
  memberCount: string;
  gender: number;
  agreement: boolean;
}
export interface BookedCourts {
  id: number;
  court: {
    courtNumber: number;
  };
  location: BadmintonVenue;
  shift: Shift;
  username: string;
  date: string;
  price: number;
  createdAt: string;
  status: string;
  isFutureBooking: string;
}
export interface ChartLineData {
  name: string;
  HN: number;
  HCM: number;
}
