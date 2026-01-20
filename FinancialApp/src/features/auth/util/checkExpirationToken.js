import { jwtDecode } from "jwt-decode";

export default function isExpired(token) {
  const decode = decodeToken(token);

  const remainingTime = new Date(parseInt(decode.exp) * 1000).getTime();
  const nowDate = Date.now();

  if (remainingTime <= nowDate) {
    return true;
  }

  return false;
}

function decodeToken(token) {
  return jwtDecode(token);
}
