import React from "react";
import TreningApi from "./TreningApi";
import "./App.scss";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      content: [],
    };
  }

  componentDidMount() {
    TreningApi.fetchSourceHtml().then((response) => {
      this.setState({ content: TreningApi.parseHtml(response) });
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
