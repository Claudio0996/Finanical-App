export default async function checkResponseError(response) {
  if (response.status >= 500) {
    const resData = await response.json();
    throw new Error(resData.message);
  } else if (response.status >= 400 && response.status < 500) {
    return response;
  } else {
    return;
  }
}
