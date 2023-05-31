import React, { useRef, useEffect } from "react";

/**
 * Использование действия по скрытию.
 */
function useOutside(ref, callback) {
  useEffect(() => {
    /**
     * Сделать действие, если нажали за переделом.
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    // Подписка на событие
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Отписка от события
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Компонент, который делает действие по нажатию за переделом за ним.
 */
export default function OutsideAction(props) {
  const wrapperRef = useRef(null);
  useOutside(wrapperRef, props.callback);

  return <div ref={wrapperRef}>{props.children}</div>;
}