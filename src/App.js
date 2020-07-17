import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TreningApi from "./TreningApi";
import { Card } from "./Card";
import { Box } from "./Box";
import { ItemTypes } from "./ItemTypes";

import "./App.scss";

export const App = () => {
  const [content, setContent] = useState([]);
  const [couples, setCouples] = useState(0);

  useEffect(() => {
    TreningApi.fetchSourceHtml().then((response) => {
      const responseParsed = TreningApi.parseHtml(response);
      setCouples(responseParsed.length);
      setContent(responseParsed.flat());
    });
  });

  function onMatch(rowIndex) {
    console.warn(`Matched ${rowIndex}`);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="trening">
        <header className="trening__header">
          Trening <div className="trening__score">{couples}</div>
        </header>
        <main className="trening__main">
          {content && content.length ? (
            content.map((item, index) =>
              item.cellIndex === 0 ? (
                <Card
                  key={index}
                  rowIndex={item.rowIndex}
                  text={item.content}
                  type={ItemTypes.CARD}
                />
              ) : (
                <Box
                  key={index}
                  rowIndex={item.rowIndex}
                  text={item.content}
                  accepts={ItemTypes.CARD}
                  onMatch={(rowIndex) => onMatch(rowIndex)}
                />
              )
            )
          ) : (
            <h2 className="trening__loader">Just a moment</h2>
          )}
        </main>
      </div>
    </DndProvider>
  );
};

export default App;
