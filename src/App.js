import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import shuffle from "lodash.shuffle";
import TreningApi from "./TreningApi";
import { Card } from "./Card";
import { Box } from "./Box";
import { ItemTypes } from "./ItemTypes";
import bravo from "./assets/img/bravo.gif";
import { ReactComponent as SearchIcon } from "./assets/img/search.svg";
import "./App.scss";

export const App = () => {
  const [content, setContent] = useState([]);
  const [remainingCouples, setRemainingCouples] = useState(0);
  const [totalCouples, setTotalCouples] = useState(0);
  const [dragSource, setDragSource] = useState(-1);
  const [sourceUrl, setSourceUrl] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  function fetchContent(url = process.env.REACT_APP_TARGET_URL) {
    TreningApi.fetchSourceHtml(url).then((response) => {
      const responseParsed = TreningApi.parseHtml(response);
      setTotalCouples(responseParsed.length);
      setRemainingCouples(responseParsed.length);
      setContent(shuffle(responseParsed.flat()));
    });
  }

  const handleMatch = useCallback(
    (rowIndex) => {
      setContent(content.filter((item) => item.rowIndex !== rowIndex));
      setRemainingCouples(remainingCouples - 1);
    },
    [content, remainingCouples]
  );

  function handleDragBegin(rowIndex) {
    setDragSource(rowIndex);
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchContent(sourceUrl);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="trening">
        <header className="trening__header">
          <form
            className="trening__search-form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <button type="submit" className="trening__search-submit">
              <SearchIcon className="trening__search-icon" />
            </button>
            <input
              className="trening__search-input"
              type="text"
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="URL to extract table content"
            />
          </form>
          <h1 className="trening__title">Trening</h1>{" "}
          <div className="trening__score">
            {totalCouples - remainingCouples} done, {remainingCouples} to go
          </div>
        </header>
        <main className="trening__main">
          {remainingCouples === 0 && dragSource > -1 ? (
            <div className="trening__loader">
              <img src={bravo} alt="Bravo!" />
            </div>
          ) : content && content.length ? (
            content.map((item, index) =>
              item.cellIndex === 0 ? (
                <Card
                  key={index}
                  rowIndex={item.rowIndex}
                  text={item.content}
                  type={ItemTypes.CARD}
                  handleDragBegin={handleDragBegin}
                />
              ) : (
                <Box
                  key={index}
                  rowIndex={item.rowIndex}
                  text={item.content}
                  accepts={ItemTypes.CARD}
                  handleMatch={handleMatch}
                  dragSource={dragSource}
                />
              )
            )
          ) : (
            <div className="trening__loader">Just a moment</div>
          )}
        </main>
      </div>
    </DndProvider>
  );
};

export default App;
