import React from "react";
import { useDrag } from "react-dnd";
import "./App.scss";

export const Card = ({ text, type, rowIndex, handleDragBegin }) => {
  const [{ isDragging }, dragRef] = useDrag({
    item: { rowIndex, type },
    // isDragging(monitor) {
    //   const item = monitor.getItem();
    //   return text === item.text;
    // },
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
      className={`trening__item trening__item--card trening__item--${statusClassName}`}
    >
      {text}
    </div>
  );
};
