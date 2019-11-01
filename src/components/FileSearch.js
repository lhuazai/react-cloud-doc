import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress'

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const enterPress = useKeyPress(13)
  const escPress = useKeyPress(27)
  
  let node = useRef(null);
  const closeKeyBoard = () => {
    setInputActive(false);
    setInputValue('');
    onFileSearch(false)
  };
  useEffect(() => {
    if(enterPress && inputActive) {
      onFileSearch(inputValue)
    }
    if(escPress && inputActive) {
      closeKeyBoard()
    }
  });
  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  },[inputActive]);

  return (
    <div className="" style={{}}>
      {!inputActive && (
        <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
          <span>{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => { setInputActive(true);}}
          >
            <FontAwesomeIcon icon={faSearch} title="搜索" size="sm" />
          </button>
        </div>
      )}
      {inputActive && (
        <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
          <input
            defaultValue={inputValue}
            ref={node}
            className="form-control"
            onChange={e => {
              setInputValue(e.target.value);
            }}
            
          />
          <button
            type="button"
            className="icon-button"
            onClick={e => {
              closeKeyBoard()
            }}
          >
            <FontAwesomeIcon icon={faTimes} title="关闭" size="sm" />
          </button>
        </div>
      )}
    </div>
  );
};

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}
FileSearch.defaultProps = {
  title: '我的文档'
}

export default FileSearch;
