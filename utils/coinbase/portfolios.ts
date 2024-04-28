import { sign_req } from "../../lib/jwtsign";

const url = "api.coinbase.com";
const request_path =
  "/api/v3/brokerage/portfolios/cce1e960-aa87-50db-b3a9-bba788783ee5";

export default async function getPortfolios() {
  let result = [];

  const token = sign_req(url, request_path);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + token);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  await fetch("https://" + url + request_path, requestOptions)
    .then((res) => {
      if (!res.ok) {
        console.error(res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      result = data.breakdown;
    })
    .catch((error) => {
      console.error("Error ", error);
    });

  return result;
}
