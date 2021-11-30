import { useRef, useState, useEffect } from "react";

const Dropdown = ({ prompt, value, onChange, option, type }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  //   useEffect(() => {
  //     document.addEventListener("click", close);
  //     return () => document.removeEventListener("click", close);
  //   }, []);
  //   const close = (event) => {
  //     setOpen(event && event.target === ref.curent);
  //   };

  return (
    <div className="dropdown">
      <div className="control" onClick={() => setOpen(!open)}>
        <div className="selected-value" ref={ref}>
          {type} : {value ? value.name : prompt}
        </div>
        <div className={`arrow ${open ? "open" : null}`} />
      </div>
      <div className={`options ${open ? "open" : null}`}>
        {option?.results.map((elem, i) => {
          //   console.log(elem);
          return (
            <div
              key={i}
              className={`option ${value === elem ? "selected" : null}`}
              onClick={() => {
                onChange(elem);
                setOpen(false);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setOpen(false);
                }, 200);
              }}
            >
              {elem.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
