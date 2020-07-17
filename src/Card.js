import React from "react";
import { useDrag } from "react-dnd";
import "./App.scss";

export const Card = ({ text, type, isDropped }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { text, type },
    isDragging(monitor) {
      const item = monitor.getItem();
      return text === item.text;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const statusClassName = isDragging ? "dragging" : "default";
  return (
    <div
      ref={drag}
      className={`trening__item trening__item--card trening__item--status-${statusClassName}`}
    >
      {text}
    </div>
  );
};
