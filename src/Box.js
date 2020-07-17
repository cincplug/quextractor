import React from "react";
import { useDrop } from "react-dnd";
import "./App.scss";

export const Box = ({
  text,
  accepts: accept,
  handleMatch,
  rowIndex,
  dragSource,
}) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      didDrop: monitor.didDrop(),
      getDropResult: monitor.getDropResult(),
    }),
    drop: () => handleDrop(rowIndex),
  });
  function handleDrop(rowIndex) {
    if (rowIndex === dragSource) {
      handleMatch(rowIndex);
    }
  }
  return (
    <div
      ref={dropRef}
      className={`trening__item trening__item--box trening__item--${
        canDrop ? "can-drop" : "cant-drop"
      } trening__item--${isOver ? "hovered" : "not-hovered"}`}
    >
      {text}
    </div>
  );
};
