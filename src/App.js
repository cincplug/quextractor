import React from "react";
import TreningApi from "./TreningApi";
import "./App.scss";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      content: [],
    };
    this.dragElement = null;
  }

  componentDidMount() {
    TreningApi.fetchSourceHtml().then((response) => {
      const responseUncoupled = TreningApi.parseHtml(response).flat();
      this.setState({ content: responseUncoupled });
    });
  }

  handleDragStart(e) {
    this.dragElement = e.target;
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragElement.parentNode.removeChild(this.dragElement);
    e.target.appendChild(this.dragElement);
  }

  render() {
    const { content } = this.state;

    return (
      <div className="trening">
        <header className="trening__header">Trening</header>
        <main className="trening__main">
          {content && content.length ? (
            content.map((item, index) => (
              <div
                draggable
                className="trening__item"
                key={index}
                onDragStart={(e) => this.handleDragStart(e)}
                onDragOver={(e) => this.handleDragOver(e)}
                onDrop={(e) => this.handleDrop(e)}
              >
                {item}
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
