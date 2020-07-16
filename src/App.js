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
      const responseUncoupled = TreningApi.parseHtml(response).flat();
      this.setState({ content: responseUncoupled });
    });
  }

  render() {
    const { content } = this.state;

    return (
      <div className="trening">
        <header className="trening__header">Trening</header>
        <main className="trening__main">
          {content && content.length ? (
            content.map((item, index) => (
              <div className="trening__item" key={index}>
                <div className="trening__entry">{item}</div>
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
