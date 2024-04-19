const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sign } = require("jsonwebtoken");

const key_name = process.env.COINBASE_KEY;
const key_secret = process.env.COINBASE_SECRET.replace(/\\n/g, "\n");
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
