import { Router } from "express";
import { requireCustomer } from "../middleware/auth.js";
import { notImplemented } from "../utils/notImplemented.js";

// Replaces legacy/esewa_payment.php, payment_success.php, payment_failure.php,
// payment_counter.php. Per migration.md decisions, this STAYS simulate-only —
// no live eSewa gateway call — but keeps the real HMAC-SHA256 signature
// building from legacy/esewa_config.php so swapping in the real gateway
// later is a small change, not a rewrite. Legacy trusted client-supplied GET
// params as "success"; here /esewa/simulate-* re-validates against the
// session-bound booking server-side, same as legacy actually did in
// payment_success.php (that part was already reasonable).
export const paymentsRouter = Router();

paymentsRouter.post("/esewa/initiate", requireCustomer, notImplemented("build eSewa form + signature — legacy/esewa_payment.php"));
paymentsRouter.post("/esewa/simulate-success", requireCustomer, notImplemented("mark booking paid — legacy/payment_success.php"));
paymentsRouter.post("/esewa/simulate-failure", requireCustomer, notImplemented("mark booking failed — legacy/payment_failure.php"));
paymentsRouter.post("/counter", requireCustomer, notImplemented("mark booking pay-at-counter — legacy/payment_counter.php"));
