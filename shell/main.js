// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, ipcMain,dialog,globalShortcut,screen} = require('electron')
const path = require('path')
const fs = require('fs')
const nodeExcel = require('excel-export');
let xlsx = require('node-xlsx');
let mainWindow = null;
//创建窗口
function createWindow () {
  // Create the browser window.
  let size = screen.getPrimaryDisplay().workAreaSize
  let width = parseInt(size.width)
  let height = parseInt(size.height)
  mainWindow = new BrowserWindow({
    // icon:"logo.ico",
    width: width,
    height: height,
    show: true,
    transparent: true,
    frame: true,
    resizable: false,
    movable: true,
    minimizable: true,
    maximizable: true,
    minWidth:1280,
    minHeight:720,
    maxWidth:2556,
    maxHeight:1440,
    nativeWindowOpen: true, //是否使用原生的window.open()
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    }
  })
  mainWindow.loadFile('web-mobile/index.html')
  mainWindow.setResizable(true);
}
//IPC通讯建立
function ipcList(){
  //关闭软件
  ipcMain.on('closewindow', (e) => {
    app.quit()
  })
  let lastPos = null;
  //  ******************** 拖拽开始  ***********************
  ipcMain.on('movewindow_move', (e,arg) => {
    let p = mainWindow.getPosition();
    let mousePos = screen.getCursorScreenPoint();
    if(!lastPos){
      lastPos = mousePos;
    }
    let cx = lastPos.x - mousePos.x;
    let cy = lastPos.y - mousePos.y;
    p[0] -= cx
    p[1] -= cy
    mainWindow.setPosition(p[0],p[1]);
    lastPos = mousePos;
  })
  ipcMain.on('movewindow_start', (e,arg) => {
    lastPos = null;
  })
  ipcMain.on('movewindow_end', (e,arg) => {
    lastPos = null;
  })
  //  ******************** 拖拽结束  ***********************
  let isMax = false;
  //最大化窗口
  ipcMain.on('maxWindow', (e) => {
    if(isMax){
      mainWindow.unmaximize();
    }else{
      mainWindow.maximize();
    }
    isMax = !isMax;
  })
  //最小化窗口
  ipcMain.on('minWindow', (e) => {
    mainWindow.minimize();
  })
  //鱼线导出
  ipcMain.on('outjson', (event,content) => {
    console.log('>>>>>>>>>>>>>> 收到 ',content)
    const options = {      title: '保存鱼组',
      filters: [ { name: '鱼组', extensions: ['json'] } ]
    }
    filename = dialog.showSaveDialog(options).then(result => {
      filename = result.filePath;
      if (filename === undefined) {
        console.log('搞了个空文件 \'t 先创建一个！');
        return;
      }
      let space4Str = JSON.stringify(JSON.parse(content),null,4);
      fs.writeFile(filename, space4Str,'utf8', (err,data) => {
        if (err) {
          console.log('出了点小问题 ' + err.message);
          return
        }
        console.log('搞定！');
      })
    }).catch(err => {
      console.log(err)
    })
  })
  //保存导出设置（个性化） 数据 -- 导出
  ipcMain.on('OutSettingData', (event,content) => {
    console.log('>>>>>>>>>>>>>> 收到 ',content)
    const options = {      title: '保存导出设置',
      filters: [ { name: '导出设置', extensions: ['json'] } ]
    }
    filename = dialog.showSaveDialog(options).then(result => {
      filename = result.filePath;
      if (filename === undefined) {
        console.log('搞了个空文件 \'t 先创建一个！');
        return;
      }
      let space4Str = JSON.stringify(JSON.parse(content),null,4);
      fs.writeFile(filename, space4Str,'utf8', (err,data) => {
        if (err) {
          console.log('出了点小问题 ' + err.message);
          return
        }
        console.log('搞定！');
      })
    }).catch(err => {
      console.log(err)
    })
  })
  //鱼资源导出
  ipcMain.on('outfishjson', (event,content) => {
    console.log('>>>>>>>>>>>>>> 收到 ',content)
    const options = {      title: '保存鱼资源',
      filters: [ { name: '保存鱼资源', extensions: ['json'] } ]
    }
    filename = dialog.showSaveDialog(options).then(result => {
      filename = result.filePath;
      if (filename === undefined) {
        console.log('搞了个空文件 \'t 先创建一个！');
        return;
      }
      let space4Str = JSON.stringify(JSON.parse(content),null,4);
      fs.writeFile(filename, space4Str,'utf8', (err,data) => {
        if (err) {
          console.log('出了点小问题 ' + err.message);
          return
        }
        console.log('搞定！');
      })
    }).catch(err => {
      console.log(err)
    })
  })
  //导出鱼表 ，废弃
  ipcMain.on('outFishConfig', (event,content) => {
    console.log('>>>>>>>>>>>>>> 收到 ',content)
    const options = {      title: '保存鱼表',
      filters: [ { name: '鱼表', extensions: ['json'] } ]
    }
    filename = dialog.showSaveDialog(options).then(result => {
      filename = result.filePath;
      if (filename === undefined) {
        console.log('搞了个空文件 \'t 先创建一个！');
        return;
      }
      let space4Str = JSON.stringify(JSON.parse(content),null,4);
      fs.writeFile(filename, space4Str,'utf8', (err,data) => {
        if (err) {
          console.log('出了点小问题 ' + err.message);
          return
        }
        console.log('搞定！');
      })
    }).catch(err => {
      console.log(err)
    })
  })
  //导入 鱼表 excel表格
  ipcMain.on('inFishTable', (event) =>  {
    const window = BrowserWindow.fromWebContents(event.sender)
    console.log(">> event.sender ",event.sender)
    dialog.showOpenDialog(window,{
      title: '打开鱼Excel表',
      filters: [ { name: '鱼Excel表', extensions: ['xlsx'] } ],
      properties:['openFile']}).then(result => {
      let directory = result.filePaths[0];
      console.log("*****-- -- --  open filename :",directory);
      mainWindow.webContents.send('file-opened-fishTableExcelPath',directory);//存储当前的鱼表路径
      readfishTableExcel(directory);
    }).catch(err => {
      console.log(err)
    })
  })
  //下载鱼表模板
  ipcMain.on('dowmLoadExpFishTable', (event) => {
    const options = {      title: '下载鱼表模板',
      filters: [ { name: '下载鱼表模板', extensions: ['xlsx'] } ]
    }
    filename = dialog.showSaveDialog(options).then(result => {
      let filePath = result.filePath;
      if (filePath === undefined) {
        console.log('搞了个空文件 \'t 先创建一个！');
        return;
      }
      console.log("filePath ",filePath);
      // let space4Str = JSON.stringify(JSON.parse(content),null,4);
      // fs.writeFile(filename, space4Str,'utf8', (err,data) => {
      //   if (err) {
      //     console.log('出了点小问题 ' + err.message);
      //     return
      //   }
      //   console.log('搞定！');
      // })
      const conf = {};
      // 定义sheet名称
      conf.name = "Sheet";
      // 定义列的名称以及数据类型
      conf.cols = [
        {caption:'鱼类ID：',type:'string'},{caption:'鱼名',type:'string'},{caption:'鱼的描述',type:'string'},{caption:'鱼档次',type:'string'},{caption:'鱼死后触发的事件',type:'string'},{caption:'资源组ID',type:'string'},
        {caption:'是否震动（0-NO，1-YES）：',type:'string'},{caption:'捕获金币特效表现（0-3挡）：',type:'string'},{caption:'鱼的优先级（锁定使用）',type:'string'},{caption:'是否广播 0 = no  1= yes',type:'string'},
        {caption:'可游动的鱼线组',type:'string'},{caption:'击杀奖励倍数',type:'string'},{caption:'基准消耗炮弹',type:'string'},{caption:'高胜率时最小消耗炮弹',type:'string'},{caption:'高胜率时最大消耗炮弹',type:'string'},
        {caption:'低胜率时最小消耗炮弹',type:'string'},{caption:' 低胜率时最大消耗炮弹',type:'string'},{caption:'基础捕获几率',type:'string'},{caption:'鱼图是否固定',type:'int'},{caption:'帧率',type:'int'}
      ];
      // 定义row的数据
      conf.rows = [
        ['fishTypeId','fishName','fishDesc','level','deadEvent','resGroupId','shock','effectRotate','priority','broadcast','fishGroup','rewardMultiple','baseExpendShell','highMinExpendShell','highMaxExpendShell','lowMinExpendShell','lowMaxExpendShell','baseRate','fixedResource','frameRate'],
        ['int','string','string','int','int','int','int','int','int','int','array','json','int','int','int','int','int','int','int','int'],
        ['notEmpty','notEmpty','','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty','notEmpty'],
        ['','','','','','','','','','','','','','','','','','','','',],
        ['101','孔雀鱼','孔雀鱼，也称为凤尾鱼是一种热带鱼，雌雄鱼的体型和色彩差别较大，体色绚烂多彩、体型优美。孔雀鱼性情温和，能与温和的中小性型热带鱼混养，平时活泼好动，寿命较短','1','0','1','0','0','1','0', "[10000,100003]","{'2':100}", '1','1','1','1','1','3560.5','0','0']
      ];
      const content = nodeExcel.execute(conf);

      fs.writeFile(filePath,content,'binary',(err) => {
        err ? console.log(err) : null;
      });

    }).catch(err => {
      console.log(err)
    })
  })
  //导入鱼线组
  ipcMain.on('inWindow', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    dialog.showOpenDialog(window,{
      title: '打开鱼线组',
      filters: [ { name: '鱼组', extensions: ['json'] } ],
      properties:['openFile']}).then(result => {
      filename = result.filePaths[0];
      console.log("*****-- -- --  open filename :",filename);
      fs.readFile(filename, 'utf-8',(err,data) => {
        if (err) {
          console.log('出了点小问题 ' + err.message);
          return
        }
        event.sender.send('file-opened-fishline', data)
      })
    }).catch(err => {
      console.log(err)
    })
  })
  ipcMain.on('keyf12', (event) => {
    mainWindow.webContents.openDevTools()
  })
  //读取导出设置（个性化） 数据 -- 导入
  ipcMain.on('readOutSettingData', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    dialog.showOpenDialog(window,{
      title: '打开导出设置',
      filters: [ { name: '导出设置', extensions: ['json'] } ],
      properties:['openFile']}).then(result => {
      filename = result.filePaths[0];
      console.log("*****-- -- --  open filename :",filename);
      fs.readFile(filename, 'utf-8',(err,data) => {
        if (err) {
          console.log('出了点小问题 ' + err.message);
          return
        }
        event.sender.send('file-opened-readOutSettingData', data)
      })
    }).catch(err => {
      console.log(err)
    })
  })
  //监听导入鱼资源数据
  ipcMain.on('inFishResJosnFile',(event)=>{
    const window = BrowserWindow.fromWebContents(event.sender)
    dialog.showOpenDialog(window,{
      title: '打开鱼图配置文件',
      filters: [ { name: '鱼图配置JSON', extensions: ['json'] } ],
      properties:['openFile']}).then(result => {
      filename = result.filePaths[0];
      console.log("*****-- -- --  open filename :",filename);
      fs.readFile(filename, 'utf-8',(err,data) => {
        if (err) {
          console.log('出了点小问题 ' + err.message);
          return
        }
        mainWindow.webContents.send('file-opened-fishConfig',data);
      })
    }).catch(err => {
      console.log(err)
    })
  })
  //鱼表导入
  ipcMain.on('sFishPth',(event)=>{
    sFishPth();
  })
  //监听打开上次
  ipcMain.on('open-restore',(event,content)=>{
    let data = JSON.parse(content);
    console.log(data);
    if(data != null){
      if(data.atlasPath != null){//图集路径
        if(data.fishTableExcelPath != null){//鱼表路径
          selectFolder(data.atlasPath,()=>{
            setTimeout(()=>{
              readfishTableExcel(data.fishTableExcelPath);//导入鱼表
            },810);
          });//打开图集
        }
      }else{

      }
    }else{
      console.log("is null");
    }
  })
}
//读取鱼表Excel
function readfishTableExcel(tablePath) {
  let sheets = xlsx.parse(tablePath); //读取excel
  let json_fishConfig = sheets[0].data;
  let fishTable = {};
  for(let i=4;i<json_fishConfig.length;i++){
    let item = json_fishConfig[i];
    let keyList = json_fishConfig[1];
    let key = item[0];
    let obj = {};
    let isHave = false;
    for(let j=0;j<keyList.length;j++){
      if(keyList[j] == undefined || item[j] == undefined){
        break;
      }
      obj[keyList[j]] = item[j];
      isHave = true;
    }
    if(isHave)fishTable[key] = obj;
  }
  mainWindow.webContents.send('file-opened-fishexcel', JSON.stringify(fishTable));
}
const http = require('http');
const url = require('url');
function getRandomNum(Min,Max){
  let Range = Number(Max) - Number(Min);
  let Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}
let port = 8456;//测试模式使用固定端口
// let port = getRandomNum(8400,9400);
let directory = null;
let fileList = null;
//创建文件服务器，提供给远程h5 加载资源
function creatorFileServer(){
  http.createServer(function (req, res) {
    if(directory == null|| fileList == null || fileList.length === 0){
      res.statusCode = 404;
      res.end('directory or fileList is null');
      return;
    }
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // console.log(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    // let pathname = `.${parsedUrl.pathname}`;
    let pathname = `${directory}\\${parsedUrl.pathname}`
    // console.log(`read pathname: ${pathname}`);
    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext;
    // maps file extention to MIME typere
    const map = {
      '.ico': 'image/x-icon',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.plist': 'text/json',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.svg': 'image/svg+xml',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword'
    };

    fs.exists(pathname, function (exist) {
      if(!exist) {
        // if the file is not found, return 404
        res.statusCode = 404;
        res.end(`File ${pathname} not found!`);
        return;
      }

      // if is a directory search for index file matching the extention
      if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext;

      // read file from file system
      fs.readFile(pathname, function(err, data){
        if(err){
          res.statusCode = 500;
          res.end(`Error getting the file: ${err}.`);
        } else {
          // if the file is found, set Content-type and send data
          res.setHeader('Content-type', map[ext] || 'text/plain' );
          res.end(data);
        }
      });
    });


  }).listen(parseInt(port));
  console.log(`Server listening on port ${port}`);
}
let plistFileCount = 0;
function mapDir(dir, callback, finish) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      console.error(err)
      return
    }
    files.forEach((filename, index) => {
      let pathname = path.join(dir, filename)
      fs.stat(pathname, (err, stats) => { // 读取文件信息
        if (err) {
          console.log('获取文件stats失败')
          return
        }
        if (stats.isDirectory()) {
          mapDir(pathname, callback, finish)
        } else if (stats.isFile()) {
          if (!['.png','.plist'].includes(path.extname(pathname))) {  // 只做目录下的 ['.png','.plist'] 文件检查
             // console.log(">> not check ",pathname)
          }else{
            // console.log(">>pathname: ",pathname," filename ",filename)
            if(filename.indexOf('.plist') != -1){
              plistFileCount++;
            }
            if(filename.indexOf('.png') != -1){
              fileList.push(filename);
            }
          }
          if(callback != null){
            callback(index,files.length)
          }
        }
      })
    })
  })
}
//选择鱼图资源文件夹
function sFishPth(){
  dialog.showOpenDialog({
    title: '打开鱼图资源目录',
    properties:['openDirectory']}).then(result => {
    console.log("*****-- openDirectory -- --  result :",result);
    let path = result.filePaths[0];
    mainWindow.webContents.send('file-opened-atlasPath',path);//存储当前的图集路径
    selectFolder(path,null);
  }).catch(err => {
    console.log(err)
  })
}
//选择背景文件
function selectionBackground(){
  dialog.showOpenDialog({
    title: '选择背景文件',
    properties:['openFile']}).then(result => {
    let path = result.filePaths[0];
    let fileName = path.match(/\\([^\\^.]+)\.[^\\]*$/)[1];
    console.log("*****-- readFile -- --  result   :",result);
    let outFileName;
    let hzm = "";
    if(path.indexOf(".png") != -1){
      hzm = ".png";
      outFileName = fileName+hzm;
      console.log("*****-- readFile -- --  fileName :",fileName);
    }
    if(path.indexOf(".jpg") != -1){
      hzm = ".jpg";
      outFileName = fileName+hzm;
      console.log("*****-- readFile -- --  fileName :",fileName);
    }
    if(path.indexOf(".jpeg") != -1){
      hzm = ".jpeg";
      outFileName = fileName+hzm;
      console.log("*****-- readFile -- --  fileName :",fileName);
    }
    if(hzm == ""){
      return;
    }
    fs.readFile(path, 'binary', function(err, data) {
      if (err) throw err // Fail if the file can't be read.
      console.log("readFile --- 1 data  outFileName "+outFileName);
      let base64Image = new Buffer(data, 'binary').toString('base64');
      let imgSrcString = `data:image/${outFileName.split('.').pop()};base64,${base64Image}`;
      mainWindow.webContents.send('file-opened-bg-data',imgSrcString);
    });
  }).catch(err => {
    console.log(err)
  })
}
//选择一个文件，开启web文件服务器 提供给客户端下载图集
function selectFolder(path,cb){
  directory = path;
  fileList = [];
  plistFileCount = 0;
  mapDir(
      path,
      function(i,l) {
        if((l-1) == i){
          let data;
          if(fileList.length == plistFileCount){
            console.log('-----over-----  list ',fileList.join(","))
            let url = 'http://127.0.0.1:'+port;
            data = {"code":0,'fileServerUrl':url,'fileList':fileList,"msg":"ok"}
          }else{
            data = {"code":400,"msg":"图集有误，一个png对应一个plist文件请检查！"}
          }
          mainWindow.webContents.send('file-opened-fishRes',JSON.stringify(data));
          if(cb){
            cb();
          }
        }
      }
  )
}

app.whenReady().then(() => {
  createWindow()
  ipcList()
  creatorFileServer()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  //注册菜单
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '恢复上一次导入的鱼表、图集',
          click() {
            mainWindow.webContents.send('btn_restore','btn_restore');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '选择鱼图资源文件夹',
          click() {
            sFishPth();
          }
        },
        {
          label: 'Excel鱼表导入',
          click() {
            mainWindow.webContents.send('btn_importExcel','btn_importExcel');
          }
        },
        {
          label: '鱼线导入编辑器',
          click() {
            mainWindow.webContents.send('btn_in','btn_in');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '新建鱼组',
          click() {
            mainWindow.webContents.send('btn_newGroup','btn_newGroup');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '保存项目',
          click() {
            mainWindow.webContents.send('btn_save','btn_save');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '鱼线导出',
          click() {
            console.log(mainWindow.webContents)
            mainWindow.webContents.send('btn_out4','btn_out4');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '导入背景',
          click() {
            console.log("*****-- open png -- --  ");
            selectionBackground();
          }
        },
        {
          label: '关  于',
          click() {
            mainWindow.webContents.send('btn_about','btn_about');
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        {
          label: '撤销',
          click() {
            mainWindow.webContents.send('btn_revoke','btn_revoke');
          }
        },
        {
          label: '重做',
          click() {
            mainWindow.webContents.send('btn_redo','btn_redo');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '显示鱼资源编辑界面',
          click() {
            mainWindow.webContents.send('btn_showFishResEditView','btn_showFishResEditView');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '删除鱼线',
          click() {
            mainWindow.webContents.send('btn_deleteLine','btn_deleteLine');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '播放全组',
          click() {
            mainWindow.webContents.send('btn_showMc','btn_showMc');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '设置选项',
          click() {
            mainWindow.webContents.send('btn_setting','btn_setting');
          }
        }
      ]
    },
    {
      label: '面板',
      submenu: [
        {
          label: '鱼组列表',
          click() {
            mainWindow.webContents.send('btn_fishList','btn_fishList');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '资源列表',
          click() {
            mainWindow.webContents.send('btn_resList','btn_resList');
          }
        },
        {
          type: 'separator'
        },
        {
          label: '鱼线列表',
          click() {
            mainWindow.webContents.send('btn_lineList','btn_lineList');
          }
        }
      ]
    }
  ];
  const appMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(appMenu);
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})