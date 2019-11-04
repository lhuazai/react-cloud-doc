import React, { useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "easymde/dist/easymde.min.css";
import uuidv4 from 'uuid/v4';
import { flattenArr, objToArr } from './utils/helper'
import fileHelper from './utils/fileHelper'
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import defaultFiles from './utils/defaultFiles';
import BottomButton from './components/BottomButton'
import TabList from './components/TabList'
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import SimpleMDE from "react-simplemde-editor";


const { join, basename, extname, dirname } = window.require('path')
const { remote } = window.require('electron')
const Store = window.require('electron-store')

const fileStore = new Store({ 'name': 'FilesData' })
console.log(fileStore);

const saveFilesToStore = (files) => {
  const fileStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createAt } = file
    result[id] = {
      id,
      path,
      title,
      createAt
    }
    console.log('result', result);
    return result
  },{})
  fileStore.set('files', fileStoreObj)
}
function App() {
  const [ files, setFiles ] = useState(fileStore.get('files') || {} );
  const [ activeFileId, setActiveFileId ] = useState('');
  const [ openedFileIds, setOpenedIds ] = useState([]);
  const [ unSaveFileIds, setUnSaveFileIds ] = useState([]);
  const [ searchFiles, setSearchFiles ] = useState([]);

  const savedLocation = remote.app.getPath('downloads')
  console.log(files);
  const filesArr = objToArr(files)
  const fileList = searchFiles.length > 0 ? searchFiles : filesArr

  const openFiles = openedFileIds.map(openId => {
    return files[openId]
  })

  var activeFile = files[activeFileId]

  const fileSearch = (value) => {
    const newFiles = filesArr.filter(file => file.title.includes(value))
    setSearchFiles(newFiles)
  }

  const tabClose = (id) => {
    const tabWithout = openedFileIds.filter(fileId => fileId !== id)
    if (tabWithout.length > 0) {
      setActiveFileId(tabWithout[0])
    }else {
      setActiveFileId('')
    }
    setOpenedIds(tabWithout)
  }

  const fileDelete = (fileId) => {
    console.log('files[fileId].path', files[fileId].path);
    fileHelper.deleteFile(files[fileId].path).then(()=>{
      delete files[fileId]
      setFiles(files)
      saveFilesToStore(files)
      tabClose(fileId)
    })
    
  }

  const updateFileName = (id, title, isNew) => {
    const newPath = join(savedLocation, `${title}.md`)
    const newFiles = { ...files[id], title, isNew: false ,path: newPath }
    const newFile = { ...files, [id]: newFiles }
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].data).then(()=>{
        setFiles(newFile)
        saveFilesToStore(newFile)
      })
    } else {
      const oldPath = join(savedLocation, `${files[id].title}.md`)
      fileHelper.renameFile(oldPath, newPath).then(()=>{
        setFiles(newFile)
        saveFilesToStore(newFile)
      })
    }
  }

  const onTabClick = (id) => {
    setActiveFileId(id)
  }

  const createNewFile = () => {
    const newID = uuidv4()
    const newFile = {
      id: newID,
      title: '',
      data: '## 请输入 Markdown',
      createAt: new Date().getTime(),
      isNew: true
    }
    setFiles({ ...files, [newID]: newFile })
  }

  const fileClick = (id) => {
    setActiveFileId(id)
    if (!openedFileIds.includes(id)) {
      setOpenedIds([...openedFileIds,id])
    }
  }

  const fileChange = (id, value) => {
    const newFiles ={ ...files[id], data: value }
    setFiles({ ...files, newFiles })
    if (!unSaveFileIds.includes(id)) {
      console.log('unSaveFileIds', unSaveFileIds);
      setUnSaveFileIds([ ...unSaveFileIds, id])
    }
  }
  const saveFile = () => {
    fileHelper.writeFile(join(savedLocation, `${activeFile.title}.md`), activeFile.data).then(()=>{
      setUnSaveFileIds(unSaveFileIds.filter(id => id !== activeFileId))
    })
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
            onSaveEdit={(id, value, isNew)=>{ updateFileName(id, value, isNew) }}
            onFileClick={(id)=>{ fileClick(id) }}
            onFileDelete={(id)=>{ fileDelete(id) }}
          />
          <div className="row no-gutters button-group">
            <div className='col'>
              <BottomButton text={'新建'} icon={faPlus} colorClass='btn-primary' onClickBtn={createNewFile}/>
            </div>
            <div className="col">
              <BottomButton text={'导入'} icon={faFileImport} colorClass='btn-success' onClickBtn={()=>{}}/>
            </div>
          </div>
        </div>
        <div className="col-8 right-panel">
          { (!openFiles || openFiles.length === 0) && <div className="start-page">选择或者新建 Markdown 文件</div>}
          { (openFiles && openFiles.length !== 0) && 
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
              <BottomButton text={'保存'} icon={faPlus} colorClass='btn-primary' onClickBtn={saveFile}/>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
