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
import "./Trening.scss";

export const Trening = () => {
  const [content, setContent] = useState([]);
  const [remainingPairs, setRemainingPairs] = useState(0);
  const [totalPairs, setTotalPairs] = useState(0);
  const [dragSource, setDragSource] = useState(-1);
  const [sourceUrl, setSourceUrl] = useState("");
  const [limit, setLimit] = useState(10);

  const fetchContent = useCallback(
    (url = process.env.REACT_APP_TARGET_URL) => {
      TreningApi.fetchSourceHtml(url).then((response) => {
        const responseParsed = TreningApi.parseHtml(response);
        setTotalPairs(limit);
        setRemainingPairs(limit);
        setContent(shuffle(responseParsed.flat().slice(0, limit * 2)));
      });
    },
    [limit]
  );

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleMatch = useCallback(
    (rowIndex) => {
      setContent(content.filter((item) => item.rowIndex !== rowIndex));
      setRemainingPairs(remainingPairs - 1);
    },
    [content, remainingPairs]
  );

  function handleDragBegin(rowIndex) {
    setDragSource(rowIndex);
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetchContent(sourceUrl);
  }

  function handleClickLimit(limit) {
    setLimit(limit);
    fetchContent();
  }

  const limitChoices = [5, 10, 15, 20];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="trening">
        <header className="trening__header">
          <h1 className="trening__title">Trening</h1>
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
          <div className="trening__limit">
            Pairs
            {limitChoices.map((limitChoice, limitIndex) => (
              <button
                className={`trening__limit-choice trening__limit-choice--${
                  limitChoice === limit ? "active" : "inactive"
                }`}
                key={limitIndex}
                onClick={() => handleClickLimit(limitChoice)}
              >
                {limitChoice}
              </button>
            ))}
          </div>
          <div className="trening__score">
            {totalPairs - remainingPairs} done, {remainingPairs} to go
          </div>
        </header>
        <main className="trening__main">
          {remainingPairs === 0 && dragSource > -1 ? (
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

export default Trening;
