import React, { useState, useEffect }  from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from 'prop-types';
import useKeyPress from '../hooks/useKeyPress'

const FileList = ({fileData, onFileClick, onSaveEdit, onFileDelete}) => {
  const [ editStatus, setEditStatus ] = useState(false)
  const [ editId, setEditId ] = useState('')
  const [ editValue, setEditValue] = useState('')
  const enterPress = useKeyPress(13)
  const escPress = useKeyPress(27)

  const openEdit = (data) => {
    setEditStatus(true)
    setEditId(data.id)
    setEditValue(data.title)
  }

  const closeEdit = (file) => {
    setEditStatus(false)
    setEditId('')
    setEditValue('')
    if (file.isNew){
      onFileDelete(file.id)
    }
  } 

  useEffect(()=>{
    const editItem = fileData.find(file => file.id === editId)
    if (enterPress && editStatus && editValue.trim() !== '') {
      onSaveEdit(editId, editValue);
      setEditId('')
      setEditValue('')
    }
    if (escPress && editStatus) {
      closeEdit(editItem)
    }
  })

  useEffect(()=>{
    const newFile = fileData.find(file => file.isNew)
    if (newFile) {
      setEditStatus(true)
      setEditId(newFile.id)
      setEditValue(newFile.title)
    }
  },[fileData])
  
  return (
    <ul className="list-group list-group-flush">
      {
        fileData.map((ele, index) => {
          return (
            <li key={index} onClick={()=>{onFileClick(ele.id)}} className="list-group-item bg-light d-flex align-items-center row mx-0">
              { 
                (editId !== ele.id && !ele.isNew) &&
                  <>
                    <span className='col-2'>
                      <FontAwesomeIcon icon={faMarkdown} title="文档" size="sm" />
                    </span>
                    <span className="col-6">{ele.title}</span>
                    <button
                      type="button"
                      className="icon-button col-2"
                      onClick={() => { openEdit(ele)}}
                    >
                      <FontAwesomeIcon icon={faEdit} title="编辑" size="sm" />
                    </button>
                    <button
                      type="button"
                      className="icon-button col-2"
                      onClick={() => {onFileDelete(ele.id) }}
                    >
                      <FontAwesomeIcon icon={faTrash} title="删除" size="sm" />
                    </button>
                  </>
              }
              {
                ((editStatus && (editId === ele.id)) || ele.isNew) && <>
                  <input
                    defaultValue={editValue}
                    className="form-control col-8"
                    placeholder='请输入文件名称'
                    onChange={(event)=>{
                      setEditValue(event.target.value)
                    }}
                  />
                  <button
                    type="button"
                    className="icon-button col-4"
                    onClick={e => {
                      closeEdit(ele)
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} title="关闭" size="sm" />
                  </button>
                </>
              }
            </li>
          )
        })
      }
    </ul>
  )
}
FileList.propTypes = {
  fileData: PropTypes.array
}
export default FileList