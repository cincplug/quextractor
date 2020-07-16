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
      const responseParsed = TreningApi.parseHtml(response);
      this.setState({
        couples: responseParsed.length,
        content: responseParsed.flat(),
      });
    });
  }

  handleDragStart(e) {
    this.dragElement = e.target;
    // this.dragElement.classList.add("hidden");
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    e.preventDefault();
    if (this.dragElement.dataset.rowIndex === e.target.dataset.rowIndex) {
      const k = document.createElement("h4");
      k.innerHTML = this.dragElement.innerHTML;
      e.target.prepend(k);
      this.dragElement.innerHTML = "";
      this.dragElement.classList.add("hidden");
      this.setState((state) => {
        return {
          couples: state.couples - 1,
        };
      });
    }
  }

  render() {
    const { content, couples } = this.state;

    return (
      <div className="trening">
        <header className="trening__header">
          Trening <div className="trening__score">{couples}</div>
        </header>
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
                data-row-index={item.rowIndex}
              >
                {item.content}
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
