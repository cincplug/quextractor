const { REACT_APP_TARGET_URL, REACT_APP_PROXY_URL } = process.env;

const parseHtml = (str) => {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  return Object.values(doc.querySelectorAll("tr")).map((row, rowIndex) =>
    Object.values(row.querySelectorAll("td")).map((cell) => {
      return { content: cell.innerHTML, rowIndex };
    })
  );
};
const fetchSourceHtml = () => {
  return new Promise((resolve, reject) => {
    fetch(REACT_APP_PROXY_URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic",
        "Target-URL": REACT_APP_TARGET_URL,
      },
      body: null,
    })
      .then((response) => {
        return response.text();
      })
      .then((responseText) => {
        resolve(responseText);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const TreningApi = {
  parseHtml,
  fetchSourceHtml,
};

export default TreningApi;
