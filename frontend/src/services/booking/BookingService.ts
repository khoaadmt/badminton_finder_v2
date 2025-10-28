import { BASE_URL } from "../../utils/api.config";
import BaseService from "../BaseService";

const configHeaders = "";
class BookingService extends BaseService {
    constructor() {
        super(`${BASE_URL}/booking`, configHeaders);
    }

    createBooking(data: any) {
        return this.post(``, data);
    }

    getBookedCourts(data: any) {
        return this.get("booked-courts", data);
    }

    getBookingsByUserName(username: string) {
        return this.get(`by-username/${username}`);
    }

    getTransactionInDay(day: string, locationId: string) {
        return this.get(`/${day}/day/transactions?locationId=${locationId}`);
    }

    getTransactionInMonth(month: number, locationId: string) {
        return this.get(`/${month}/month/transactions?locationId=${locationId}`);
    }

    getAllTransaction(locationId: string) {
        return this.get(`/transactions?locationId=${locationId}`);
    }

    getTotalSales(month: number, city: string) {
        if (city !== null) {
            return this.get(`${month}/total-sales?city=${city}`);
        }
        return this.get(`${month}/total-sales`, { city });
    }

    updateStatus(bookingId: string) {
        return this.put(`/status`, { bookingId });
    }
}
export default BookingService;
