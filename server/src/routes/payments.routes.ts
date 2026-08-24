import crypto from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { env } from "../config/env.js";
import { requireCustomer } from "../middleware/auth.js";
import { HttpError } from "../middleware/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { bookingInclude, toBookingDto } from "../utils/dto.js";
import { prisma } from "../utils/prisma.js";

// Replaces legacy/esewa_payment.php, payment_success.php, payment_failure.php,
// payment_counter.php. Per migration.md decisions, this STAYS simulate-only —
// no live eSewa gateway call — but keeps the real HMAC-SHA256 signature
// building from legacy/esewa_config.php so swapping in the real gateway
// later is a small change, not a rewrite. Legacy trusted client-supplied GET
// params as "success"; here /esewa/simulate-* re-validates against the
// booking row server-side (transactionId set at /initiate time), same as
// legacy actually did in payment_success.php (that part was already reasonable).
export const paymentsRouter = Router();

async function getOwnedPendingBooking(bookingId: number, customerId: number) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.customerId !== customerId) throw new HttpError(404, "Booking not found.");
  if (booking.paymentStatus !== "PENDING") throw new HttpError(409, "This booking has already been paid or failed.");
  return booking;
}

const bookingIdSchema = z.object({ bookingId: z.number().int() });

paymentsRouter.post(
  "/esewa/initiate",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const { bookingId } = bookingIdSchema.parse(req.body);
    const booking = await getOwnedPendingBooking(bookingId, req.customer!.customerId);

    const transactionUuid = crypto
      .createHash("md5")
      .update(`${Date.now()}${bookingId}${req.customer!.customerId}`)
      .digest("hex");
    const totalAmount = booking.totalAmount.toString();

    const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${env.ESEWA_MERCHANT_CODE}`;
    const signature = crypto.createHmac("sha256", env.ESEWA_SECRET_KEY).update(message).digest("base64");

    await prisma.booking.update({ where: { id: bookingId }, data: { transactionId: transactionUuid } });

    res.json({
      gatewayUrl: env.ESEWA_GATEWAY_URL,
      transactionUuid,
      fields: {
        amount: totalAmount,
        tax_amount: "0",
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: env.ESEWA_MERCHANT_CODE,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  }),
);

const simulateSuccessSchema = z.object({ bookingId: z.number().int(), transactionUuid: z.string().min(1) });

paymentsRouter.post(
  "/esewa/simulate-success",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const body = simulateSuccessSchema.parse(req.body);
    const booking = await getOwnedPendingBooking(body.bookingId, req.customer!.customerId);
    if (booking.transactionId !== body.transactionUuid) throw new HttpError(400, "Transaction could not be verified.");

    const updated = await prisma.booking.update({
      where: { id: body.bookingId },
      data: { paymentStatus: "COMPLETED", paymentMethod: "ESEWA", paymentDate: new Date() },
      include: bookingInclude,
    });
    res.json(toBookingDto(updated));
  }),
);

paymentsRouter.post(
  "/esewa/simulate-failure",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const { bookingId } = bookingIdSchema.parse(req.body);
    await getOwnedPendingBooking(bookingId, req.customer!.customerId);

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentStatus: "FAILED", paymentMethod: "ESEWA" },
      include: bookingInclude,
    });
    res.json(toBookingDto(updated));
  }),
);

paymentsRouter.post(
  "/counter",
  requireCustomer,
  asyncHandler(async (req, res) => {
    const { bookingId } = bookingIdSchema.parse(req.body);
    await getOwnedPendingBooking(bookingId, req.customer!.customerId);

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentMethod: "COUNTER" },
      include: bookingInclude,
    });
    res.json(toBookingDto(updated));
  }),
);
