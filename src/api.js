const { REACT_APP_PROXY_URL } = process.env;
const parseHtml = (str) => {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  return {
    title: doc.title,
    pairs: Object.values(doc.querySelectorAll("tr")).map((row, rowIndex) =>
      Object.values(row.querySelectorAll("td")).map((cell, cellIndex) => {
        return { content: cell.textContent || "", rowIndex, cellIndex };
      })
    ),
  };
};
const fetchSourceHtml = (url) => {
  return new Promise((resolve, reject) => {
    fetch(REACT_APP_PROXY_URL, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic",
        "Target-URL": url,
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

const QuextractorApi = {
  parseHtml,
  fetchSourceHtml,
};

export default QuextractorApi;
