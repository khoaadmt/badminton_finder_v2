export interface Location {
    city: string;
    name: string;
    contact_phone: string;
    img: string;
    address: string;
    latitude: number;
    longitude: number;
}
export interface Shift {
    _id: string;
    shiftNumber: number;
    startTime: string;
    endTime: string;
    period: string;
    price: number;
}
export interface Court {
    _id: string;
    courtNumber: number;
}
export interface Facility {
    _id: string;
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
    _id: string;
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
    location: Facility;
    status: string;
    distance: {
        text: string;
        value: number;
    };
}

export interface ResponseLocation {
    location: Location;
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
export interface RootState {
    auth: AuthState;
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
    _id: string;
    court: {
        courtNumber: number;
    };
    location: Location;
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
