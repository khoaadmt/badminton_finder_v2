import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get('/zalo-pay')
    async createZaloPayment(@Query() data: any, @Req() req, @Res() res) {
        //const response = await this.paymentService.createZaloPayment(50000);
        // res.redirect(response.order_url);
    }

    @Post('/zalopayCallback')
    async handleCallbackZaloPayment(@Req() req, @Res() res) {
        const result = await this.paymentService.handleCallbackZaloPayment(
            req,
            res,
        );
    }
}
