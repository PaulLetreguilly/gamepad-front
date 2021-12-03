import { useState } from "react";

const Switch = ({ setCheck, check }) => {
  //   const [check, setCheck] = useState(false);

  const handleSwitch = (check) => {
    setCheck(!check);
    if (check) {
      // console.log("asc");
      return true;
    } else {
      // console.log("desc");
      return false;
    }
  };
  return (
    <label className="switch">
      <input
        type="checkbox"
        onClick={() => {
          handleSwitch(check);
          // console.log(handleSwitch(check));
        }}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
