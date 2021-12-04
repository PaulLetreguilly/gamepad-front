import { useRef, useState, useEffect } from "react";

const Dropdown = ({ prompt, value, onChange, option, type }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  const close = (e) => {
    // console.dir([event.target, ref.current]);
    // console.log(ref.current);
    setOpen(e && e.target === ref.current);
  };

  return (
    <div className="dropdown">
      <div
        className="control"
        onClick={() => setOpen(!open)}
        // onBlur={() => console.log("close it 2")}
      >
        <div
          className="selected-value"
          ref={ref}
          // onBlur={() => console.log("clost it 3")}
        >
          {type} : {value ? value.name : prompt}
        </div>
        <div
          className={`arrow ${open ? "open" : null}`}
          // onBlur={() => console.log("close it 1")}
        />
      </div>
      <div
        className={`options ${open ? "open" : null}`}
        // onBlur={() => console.log("clost it 4")}
      >
        {option?.results.map((elem, i) => {
          //   console.log(elem);
          return (
            <div
              key={i}
              className={`option ${value === elem ? "selected" : null}`}
              onClick={() => {
                onChange(elem);
                setOpen(!open);
              }}
              // onBlur={() => {
              //   setTimeout(() => {
              //     setOpen(false);
              //   }, 200);
              // }}
              // onBlur={() => console.log("close it 5")}
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
