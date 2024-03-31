const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sign } = require("jsonwebtoken");

const key_name =
  "organizations/c2fb4c60-986a-4674-8174-b7fd80b0a1f9/apiKeys/1e0bbddb-35fa-4c82-89e9-cad916082e86";
const key_secret =
  "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIOgTIv1hf4UX1jFHnh7o9l0Q3NoqXx4/nr6AF7GbadE0oAoGCCqGSM49\nAwEHoUQDQgAE2L1zoanerqR4xOEIWT443+pBZRmILGP0KUxlIa+9+wHr+iB1Uzko\n/zxm7XGlqg2y1Eq3VYqxqXJk0UK2oduaOg==\n-----END EC PRIVATE KEY-----\n82e86";
const request_method = "GET";
const url = "api.coinbase.com";
const request_path = "/api/v3/brokerage/accounts";
const service_name = "retail_rest_api_proxy";

const algorithm = "ES256";
const uri = request_method + " " + url + request_path;

export default async function handler(req, res) {
  console.log(req);

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

  const headers = { Authorization: "Bearer " + token };
  let result = [];

  await fetch("https://api.coinbase.com/api/v3/brokerage/accounts", {
    headers,
  })
    .then((res) => {
      // console.log(res);

      if (!res.ok) {
        console.error(res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      // console.log("Accounts: ", JSON.stringify(data.accounts));
      result = data.accounts;
    })
    .catch((error) => {
      console.error("Error ", error);
    });

  // console.log("Done", result);

  res.status(200).json({ result });
}
