import React from "react";
import { useDrag } from "react-dnd";

const Card = ({ text, type, rowIndex, handleDragBegin }) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { rowIndex, type },
    begin: () => {
      handleDragBegin(rowIndex);
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const statusClassName = isDragging ? "dragging" : "default";
  return (
    <div
      ref={dragRef}
      className={`quextractor__item quextractor__item--card quextractor__item--${statusClassName}`}
    >
      {text}
    </div>
  );
};

export default Card;
