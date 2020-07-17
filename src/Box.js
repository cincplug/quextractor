import React from "react";
import { useDrop } from "react-dnd";
import "./App.scss";

export const Box = ({ text, accepts: accept, onMatch }) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      didDrop: monitor.didDrop(),
      getDropResult: monitor.getDropResult(),
    }),
    drop: handleDrop,
  });
  function handleDrop(i, j) {
    const { rowIndex } = i;
    const dropId = parseInt(j.targetId.slice(1));
    if (rowIndex * 2 - 1 === dropId) {
      onMatch(rowIndex);
    }
  }
  return (
    <div
      ref={dropRef}
      className={`trening__item trening__item--box ${canDrop && "can-drop"} ${
        isOver && "is-over"
      }`}
    >
      {text}
    </div>
  );
};
