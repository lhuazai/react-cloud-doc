
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BottomButton = ({ text, icon, colorClass, onClickBtn}) => {
  return (
    <button type="button" className={`btn btn-block no-border ${colorClass}`} onClick={()=>{onClickBtn()}}>
      <FontAwesomeIcon icon={icon} size="lg" className="mr-2"/>
      {text}
    </button>
  )
}
export default BottomButton
