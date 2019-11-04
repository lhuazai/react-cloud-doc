import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import classNames from "classnames";
import './TabList.scss'

const TabList = ({ fileData, activeId, unSaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {
        fileData.map(item => {
          let withUnSaveMark = unSaveIds.indexOf(item.id) > -1
          const fClassName = classNames({
            'nav-link': true,
            'active': item.id === activeId,
            'withUnsaved': withUnSaveMark
          })
          return (
            <li className="nav-item" key={item.id}>
              <a href="##" 
                className={fClassName}
                onClick={(e)=>{e.preventDefault(); onTabClick(item.id)}}
              >
                {item.title}
                <span className="mx-2 close-icon" onClick={(e)=>{e.stopPropagation(); onCloseTab(item.id)}}>
                  <FontAwesomeIcon icon={faTimes} title="关闭"/>
                </span>
                { withUnSaveMark && <span className="rounded-circle unsaved-icon mx-2" onClick={(e)=>{e.stopPropagation()}}></span>}
              </a>
            </li>
          )
        })
      }
    </ul>
  )
}

TabList.propTypes = {
  fileData: PropTypes.array,
  activeId: PropTypes.string,
  unSaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func,
}
TabList.defaultProps = {
  unSaveIds: []
}
export default TabList
