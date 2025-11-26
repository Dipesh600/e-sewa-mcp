import crypto from "crypto";

/**
 * Generate eSewa SHA256 signature for V2 payment
 * @param {Object} fields - key-value pairs of the fields to sign
 * @returns {string} SHA256 signature
 */
export function generateSignature(fields) {
  // Sort the field names alphabetically
  const sortedKeys = Object.keys(fields).sort();

  // Concatenate as: key=value, comma separated
  const rawString = sortedKeys.map(key => `${key}=${fields[key]}`).join(",");

  // Hash using SHA256
  const hash = crypto.createHash("sha256").update(rawString).digest("hex");

  return hash;
}

/**
 * Example usage:
 * 
 * const signature = generateSignature({
 *   total_amount: 1000,
 *   transaction_uuid: "TXN12345",
 *   product_code: "EPAYTEST"
 * });
 * console.log(signature);
 */
