import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import "./App.scss";

export const Box = ({
  text,
  accepts: accept,
  handleMatch,
  rowIndex,
  dragSource,
}) => {
  const [willLeave, setWillLeave] = useState(false);
  useEffect(() => {
    if (willLeave) {
      setTimeout(() => {
        setWillLeave(false);
        handleMatch(rowIndex);
      }, 300);
    }
  }, [willLeave, rowIndex, handleMatch]);
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
      setWillLeave(true);
    }
  }
  return (
    <div
      ref={dropRef}
      className={`trening__item 
        trening__item--box 
        trening__item--${canDrop ? "can-drop" : "cant-drop"}
        trening__item--${isOver ? "hovered" : "not-hovered"} 
        trening__item--${willLeave ? "will-leave" : "wont-leave"}`}
    >
      {text}
    </div>
  );
};
