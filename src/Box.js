import React from "react";
import { useDrop } from "react-dnd";
import "./App.scss";

export const Box = ({ text, accepts: accept, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    drop: onDrop,
  });
  return (
    <div
      ref={drop}
      className={`trening__item trening__item--box ${canDrop && "can-drop"} ${
        isOver && "is-over"
      }`}
    >
      {text}
    </div>
  );
};

// export const Dustbin = ({ lastDroppedItem, accepts: accept, onDrop }) => {
//     const [{ isOver, canDrop }, drop] = useDrop({
//       accept,
//       collect: (monitor) => ({
//         isOver: monitor.isOver(),
//         canDrop: monitor.canDrop(),
//       }),
//       drop: (item) => onDrop(item),
//     })
//     const isActive = isOver && canDrop
//     let backgroundColor = '#222'
//     if (isActive) {
//       backgroundColor = 'darkgreen'
//     } else if (canDrop) {
//       backgroundColor = 'darkkhaki'
//     }
//     return (
//       <div ref={drop} style={{ ...style, backgroundColor }}>
//         {isActive
//           ? 'Release to drop'
//           : `This dustbin accepts: ${accept.join(', ')}`}

//         {lastDroppedItem && (
//           <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
//         )}
//       </div>
//     )
//   }
