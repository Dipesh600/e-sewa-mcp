import axios from "axios";

// eSewa test credentials (you can override with ENV variables)
const MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || "EPAYTEST";
const SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const TOKEN = process.env.ESEWA_TOKEN || "123456";

// eSewa API endpoints
const ESEWA_PAYMENT_URL = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_VERIFY_URL = "https://rc-epay.esewa.com.np/api/epay/transaction/status/";
const ESEWA_REFUND_URL = "https://rc-epay.esewa.com.np/api/epay/refund";
const ESEWA_STATUS_URL = "https://rc-epay.esewa.com.np/api/epay/transaction/";

// -------------------------------
// 1. Create Payment Session
// -------------------------------
export async function createPaymentSessionService(input) {
  try {
    const {
      amount,
      transactionId,
      productName,
      merchantCode = MERCHANT_CODE,
      returnUrl,
      cancelUrl
    } = input;

    const payload = {
      amount: amount,
      failure_url: cancelUrl,
      product_delivery_charge: 0,
      product_service_charge: 0,
      product_code: merchantCode,
      signature: SECRET_KEY,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: returnUrl,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transactionId
    };

    const response = await axios.post(ESEWA_PAYMENT_URL, payload);

    return {
      paymentUrl: response.data.data,
      message: "Payment session created successfully"
    };

  } catch (err) {
    return {
      error: err.message
    };
  }
}

// -------------------------------
// 2. Verify Transaction
// -------------------------------
export async function verifyTransactionService(input) {
  try {
    const { transactionId, amount } = input;

    const url = `${ESEWA_VERIFY_URL}?product_code=${MERCHANT_CODE}&total_amount=${amount}&transaction_uuid=${transactionId}`;

    const response = await axios.get(url);

    return {
      status: response.data.status,
      response: response.data
    };

  } catch (err) {
    return {
      status: "FAILED",
      error: err.message
    };
  }
}

// -------------------------------
// 3. Refund Payment
// -------------------------------
export async function refundPaymentService(input) {
  try {
    const { transactionId, amount } = input;

    const payload = {
      product_code: MERCHANT_CODE,
      transaction_uuid: transactionId,
      refund_amount: amount,
      token: TOKEN
    };

    const response = await axios.post(ESEWA_REFUND_URL, payload);

    return {
      status: response.data.status,
      message: response.data.message || "Refund processed"
    };

  } catch (err) {
    return {
      status: "FAILED",
      error: err.message
    };
  }
}

// -------------------------------
// 4. Get Payment Status
// -------------------------------
export async function getPaymentStatusService(input) {
  try {
    const { transactionId } = input;

    const url = `${ESEWA_STATUS_URL}${transactionId}?product_code=${MERCHANT_CODE}`;

    const response = await axios.get(url);

    return {
      status: response.data.status,
      details: response.data
    };

  } catch (err) {
    return {
      status: "FAILED",
      error: err.message
    };
  }
}
