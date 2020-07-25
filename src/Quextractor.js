import React, { useState, useEffect, useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import shuffle from "lodash.shuffle";
import api from "./api";
import Card from "./Card";
import Box from "./Box";
import { ItemTypes } from "./ItemTypes";
import logo from "./assets/img/mirabeau.svg";
import bravo from "./assets/img/bravo.gif";
import { suggestions } from "./suggestions.json";
import { ReactComponent as SearchIcon } from "./assets/img/search.svg";
import "./Quextractor.scss";

const targetUrl = process.env.REACT_APP_TARGET_URL;

const Quextractor = () => {
  const [content, setContent] = useState([]);
  const [activeGroup, setActiveGroup] = useState([]);
  const [remainingPairsCount, setRemainingPairsCount] = useState(0);
  const [dragSource, setDragSource] = useState(-1);
  const [sourceUrl, setSourceUrl] = useState(targetUrl);
  const [sourceTitle, setSourceTitle] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isThinking, setIsThinking] = useState(false);

  const searchElementRef = useRef(null);

  const fetchContent = useCallback(
    (url = targetUrl) => {
      setIsThinking(true);
      api.fetchSourceHtml(url).then((response) => {
        const responseParsed = api.parseHtml(response);
        setRemainingPairsCount(limit);
        setSourceTitle(responseParsed.title);
        setSourceUrl(url);
        const flatResponse = responseParsed.pairs.flat();
        setContent(flatResponse);
        setActiveGroup(shuffle(flatResponse.slice(0, limit * 2)));
        setIsThinking(false);
      });
    },
    [limit]
  );

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const goToPage = useCallback(
    (page, change) => {
      setPage((prevPage) => prevPage + change);
      setActiveGroup(
        shuffle(content.slice(page * limit * 2, (page + 1) * limit * 2))
      );
    },
    [content, limit]
  );

  const handleMatch = useCallback(
    (rowIndex) => {
      setActiveGroup(activeGroup.filter((item) => item.rowIndex !== rowIndex));
      setRemainingPairsCount(
        (prevRemainingPairsCount) => prevRemainingPairsCount - 1
      );
      if (remainingPairsCount === 1) {
        goToPage(page);
        setRemainingPairsCount(limit);
      }
    },
    [activeGroup, setActiveGroup, remainingPairsCount, limit, page, goToPage]
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
  const pagesCount = Math.ceil(content.length / limit / 2);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="quextractor">
        <header className="quextractor__header">
          <h1 className="quextractor__title">
            <img src={logo} alt="Mirabeau" className="quextractor__logo" />
            <span className="quextractor__title-text">Quextractor</span>
          </h1>
          <form
            className="quextractor__search-form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <button type="submit" className="quextractor__search-submit">
              <SearchIcon className="quextractor__search-icon" />
            </button>
            <input
              className="quextractor__search-input"
              type="text"
              ref={searchElementRef}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="URL to extract table content"
            />
          </form>
          <div className="quextractor__limit">
            Pairs
            {limitChoices.map((limitChoice, limitIndex) => (
              <button
                className={`quextractor__limit-choice quextractor__limit-choice--${
                  limitChoice === limit ? "active" : "inactive"
                }`}
                key={limitIndex}
                onClick={() => handleClickLimit(limitChoice)}
              >
                {limitChoice}
              </button>
            ))}
          </div>
          <div className="quextractor__score">
            <span className="quextractor__score-value">
              {Math.max(limit - remainingPairsCount, 0)}
            </span>{" "}
            done,{" "}
            <span className="quextractor__score-value">
              {remainingPairsCount}
            </span>{" "}
            more
            <br />
            <button
              className="quextractor__page quextractor__page--next"
              onClick={() => goToPage(page, -1)}
              disabled={page <= 1}
            >
              &#5176;
            </button>{" "}
            page <span className="quextractor__score-value">{page}</span> of{" "}
            <span className="quextractor__score-value">{pagesCount}</span>{" "}
            <button
              className="quextractor__page quextractor__page--next"
              onClick={() => goToPage(page, 1)}
              disabled={page >= pagesCount}
            >
              &#5171;
            </button>
          </div>
        </header>
        <main className="quextractor__main">
          {remainingPairsCount === 0 && dragSource > -1 ? (
            <div className="quextractor__loader">
              <img src={bravo} alt="Bravo!" />
            </div>
          ) : (
            activeGroup.map((item, index) =>
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
          )}

          <section className="quextractor__info">
            <p>
              This auto-generated quiz has been extracted from{" "}
              <a
                className="quextractor__source-url quextractor__link"
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sourceTitle}
              </a>
            </p>
            <p>Drag white cards to corresponding black cards to solve it. </p>
            <p>
              Try extracting from{" "}
              <span
                className="quextractor__focus quextractor__link"
                onClick={() => searchElementRef.current.focus()}
              >
                different URL
              </span>{" "}
              if you want. Currently only table structure with two columns in
              supported.
            </p>
            <p>
              Few random suggestions:
              {suggestions.map((item, index) => (
                <button
                  key={index}
                  className="quextractor__suggestion quextractor__link"
                  onClick={() => fetchContent(item)}
                >
                  {index + 1}
                </button>
              ))}
            </p>
          </section>
          {isThinking && (
            <div className="quextractor__loader">
              Een &nbsp; <span className="quextractor__loader__mom">MOM</span>
              entje
            </div>
          )}
        </main>
      </div>
    </DndProvider>
  );
};

export default Quextractor;
