import React, { useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "easymde/dist/easymde.min.css";
import uuidv4 from 'uuid/v4';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFiles';
import BottomButton from './components/BottomButton'
import TabList from './components/TabList'
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import SimpleMDE from "react-simplemde-editor";


function App() {
  const [ files, setFiles ] = useState(defaultFiles);
  const [ activeFileId, setActiveFileId ] = useState('')
  const [ openedFileIds, setOpenedIds ] = useState([]);
  const [ unSaveFileIds, setUnSaveFileIds ] = useState([]);
  const [ searchFiles, setSearchFiles ] = useState([])

  const fileList = searchFiles.length > 0 ? searchFiles : files

  const activeFile = files.find(file => file.id === activeFileId)

  const openFiles = openedFileIds.map(openId => {
    return files.find(file => file.id === openId)
  })

  const fileSearch = (value) => {
    const newFiles = files.filter(file => file.title.includes(value))
    setSearchFiles(newFiles)
  }

  const fileDelete = (fileId) => {
    const newFiles = files.filter(file => file.id !== fileId)
    setFiles(newFiles)
    tabClose(fileId)
  }

  const updateFileName = (id, title) => {
    const newFiles = files.map(file => {
      if (file.id === id){
        file.title = title
        file.isNew = false
      }
      return file
    })
    setFiles(newFiles)
  }

  const onTabClick = (id) => {
    setActiveFileId(id)
  }

  const tabClose = (id) => {
    const tabWithout = openedFileIds.filter(fileId => fileId !== id)
    setOpenedIds(tabWithout)
    if (tabWithout.length > 0) {
      setActiveFileId(tabWithout[0])
    }else {
      setActiveFileId('')
    }
  }

  const createNewFile = () => {
    const newID = uuidv4()
    const newFile = [
      ...files,
      {
        id: newID,
        title: '',
        data: '## 请输入 Markdown',
        createAt: new Date().getTime(),
        isNew: true
      }
    ]
    setFiles(newFile)
  }

  const fileClick = (id) => {
    setActiveFileId(id)
    if (!openedFileIds.includes(id)) {
      setOpenedIds([...openedFileIds,id])
    }
  }

  const fileChange = (id, value) => {
    const newFiles = files.map(file => {
      if (file.id === id){
        file.data = value
      }
      return file
    })
    setFiles(newFiles)
    if (!unSaveFileIds.includes(id)) {
      setUnSaveFileIds([ ...unSaveFileIds, id])
    }
  }

  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-4 bg-light left-panel" style={{}}>
          <FileSearch title='我的云文档' 
            onFileSearch={(value)=>{ fileSearch(value) }}
          />
          <FileList 
            fileData={fileList}
            onSaveEdit={(id,value)=>{ updateFileName(id, value) }}
            onFileClick={(id)=>{ fileClick(id) }}
            onFileDelete={(id)=>{ fileDelete(id) }}
          />
          <div className="row no-gutters button-group">
            <div className='col'>
              <BottomButton text={'新建'} icon={faPlus} colorClass='btn-primary' onClickBtn={()=>{createNewFile()}}/>
            </div>
            <div className="col">
              <BottomButton text={'导入'} icon={faFileImport} colorClass='btn-success' onClickBtn={()=>{}}/>
            </div>
          </div>
        </div>
        <div className="col-8 right-panel">
          { !activeFile && <div className="start-page">选择或者新建 Markdown 文件</div>}
          { activeFile && 
            <div>
              <TabList 
                fileData={openFiles}
                activeId={activeFileId}
                unSaveIds={unSaveFileIds}
                onTabClick={(id)=>{ onTabClick(id) }}
                onCloseTab={(id)=>{ tabClose(id) }}
              />
              <SimpleMDE 
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.data}
                onChange={(value) => { fileChange(activeFileId, value) }}
                options={{
                  minHeight: '460px'
                }}
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
