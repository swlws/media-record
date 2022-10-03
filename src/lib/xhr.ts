const HEADERS = {
  "Content-Type": "application/json",
};

/**
 * POST请求
 *
 * @param {*} url
 * @param {*} body
 * @param {*} headers
 */
export function postJSON(url = "", body = {}, headers = {}) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      ...headers,
      ...HEADERS,
    },
  }).then((res) => {
    return res.json();
  });
}
