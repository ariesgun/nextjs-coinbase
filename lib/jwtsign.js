const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sign } = require("jsonwebtoken");

const key_name =
  "organizations/c2fb4c60-986a-4674-8174-b7fd80b0a1f9/apiKeys/c0d5ebab-b961-4a51-9274-53402164abae";
const key_secret =
  "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIK9Ds3uSq91MAxysXyvzEoSDTbE7qMZBDFfVYKE8WEbCoAoGCCqGSM49\nAwEHoUQDQgAEtd38att6LKLTtgs5MT3iVaRZU/RGqmFiW9h4EGzDWTS4g27tXooq\nt0nEO3/Kj8j8b70Z4RWbMUhHypxiLMx95w==\n-----END EC PRIVATE KEY-----\n";
const request_method = "GET";
const service_name = "retail_rest_api_proxy";
const algorithm = "ES256";

export function sign_req(url, request_path) {
  const uri = request_method + " " + url + request_path;

  const token = sign(
    {
      aud: [service_name],
      iss: "coinbase-cloud",
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120,
      sub: key_name,
      uri,
    },
    key_secret,
    {
      algorithm,
      header: {
        kid: key_name,
        nonce: crypto.randomBytes(16).toString("hex"),
      },
    },
  );
  return token;
}
