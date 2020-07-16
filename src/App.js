import React from "react";
import "./App.scss";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      content: [],
    };
  }

  componentDidMount() {
    this.fetchSourceHtml().then((k) => {
      this.setState({ content: this.parseHtml(k) });
    });
  }

  parseHtml(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, "text/html");
    return Object.values(doc.querySelectorAll("tr")).map((row) =>
      Object.values(row.querySelectorAll("td")).map((cell) => cell.innerHTML)
    );
  }
  fetchSourceHtml() {
    return new Promise((resolve, reject) => {
      fetch("https://skoda-laura.herokuapp.com", {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic",
          "Target-URL": `https://docs.microsoft.com/en-us/learn/modules/welcome-to-azure/3-tour-of-azure-services`,
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
  }

  render() {
    const { content } = this.state;

    return (
      <div className="trening">
        <header className="trening__header">Trening</header>
        <main className="trening__main">
          {content && content.length ? (
            content.map(([entry, definition], index) => (
              <div className="trening__item" key={index}>
                <div className="trening__entry">{entry}</div>
                <div className="trening__definition">{definition}</div>
              </div>
            ))
          ) : (
            <h2 className="trening__loader">Just a moment</h2>
          )}
        </main>
      </div>
    );
  }
}

export default App;
