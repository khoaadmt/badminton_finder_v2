import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Response, Request } from 'express';
import { BookingService } from 'src/booking/services/booking.service';
const axios = require('axios').default;
const CryptoJS = require('crypto-js');
const moment = require('moment');

const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

@Injectable()
export class PaymentService {
    constructor(
        @Inject(forwardRef(() => BookingService))
        private readonly bookingService: BookingService,
    ) {}
    async createZaloPayment(price: number, bookingId: string) {
        const embed_data = { bookingId: bookingId };

        const items = [
            {
                itemid: 'court-booking',
                itemname: 'Finder badminton booking',
                itemprice: price,
                itemquantity: 1,
            },
        ];
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: 'user123',
            app_time: Date.now(),
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: price,
            description: `Finder badminton - Payment for the order #${transID}`,
            bank_code: '',
            mac: '',
            callback_url: `${process.env.SERVER_URL}/api/payment/zalopayCallback`,
        };

        // appid|app_trans_id|appuser|amount|apptime|embeddata|item
        const data =
            config.app_id +
            '|' +
            order.app_trans_id +
            '|' +
            order.app_user +
            '|' +
            order.amount +
            '|' +
            order.app_time +
            '|' +
            order.embed_data +
            '|' +
            order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        try {
            const qs = require('qs');
            const res = await axios.post(config.endpoint, qs.stringify(order), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            return res.data;
        } catch (err) {
            console.log(err);
        }
    }

    async handleCallbackZaloPayment(req: Request, res: Response) {
        let result = {
            return_code: 0,
            return_message: '',
        };

        try {
            let dataStr = req.body.data;
            let reqMac = req.body.mac;

            let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

            // kiểm tra callback hợp lệ (đến từ ZaloPay server)
            if (reqMac != mac) {
                result.return_code = -1;
                result.return_message = 'mac not equal';
            } else {
                const key2 = config.key2;
                let dataJson = JSON.parse(dataStr);
                console.log('dataJson :', dataJson);
                const embed_data = JSON.parse(dataJson.embed_data);

                this.bookingService.updateStatus(
                    embed_data.bookingId,
                    'booked',
                );

                result.return_code = 1;
                result.return_message = 'success';
            }
        } catch (ex) {
            result.return_message = ex.message;
        }

        res.json(result);
        return result;
    }
}
