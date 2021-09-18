const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  "todo", {
    sendTodo: (ev, todo) => {
      ipcRenderer.send(ev, todo)
    },
    receiveTodo: (ev, func) => {
      ipcRenderer.on(ev, (event, ...data) => func(...data))
    },
    receiveClearTodos: (ev, func) => {
      ipcRenderer.on(ev, () => func())
    }
  }     
)
