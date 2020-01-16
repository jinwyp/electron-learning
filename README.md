# YouElectron

Download youtube videos and convert any audio to mp3 tool For Mac and Windows. Using electron, ffmpeg and youtube-d.

<div align="center">
	<br>
	<div>
		<img src="docs/demo.gif"/>
	</div>
</div>


## Features

1. Download youtube video, choose any video and audio format easily!
2. Convert any audio to mp3



## Usage

### Installation On Mac

1. Download dmg file from [release page](https://github.com/jinwyp/electron-learning/releases)
2. Extract to mac /Applications folder and run.

### Installation On Windows

1. Download exe file from [release page](https://github.com/jinwyp/electron-learning/releases)
2. Run exe file, extract to any folder and run.


### FAQ & Troubleshooting

1. YouElectron base on ffmpeg and youtube-dl,  as default ffmpeg and youtube-dl are included in the release package. For any reason, you can install ffmpeg and youtube-dl by yourself.
2. On mac, run  ```brew install youtube-dl ``` After install youtube-dl, then copy youtube-dl file to YouElectron folder /resources/mac. ``` cp /usr/local/bin/youtube-dl ./resources/mac ```
3. On mac, run ```brew install ffmpeg--with-libvpx ``` After install ffmpeg, then copy ffmpeg file to YouElectron folder /resources/mac. ``` cp /usr/local/bin/ffmpeg ./resources/mac ```
4. On windows, open link [youtube-dl site](https://youtube-dl.org/) . Download windows platform version. Then copy youtube-dl.exe file to YouElectron folder /resources/win
5. On windows, open link [FFmpeg site](https://ffmpeg.zeranoe.com/builds/). Download windows platform version. Then copy ffmpeg.exe to YouElectron folder /resources/win



## Usage 使用方法

###  Mac下安装

1. 在 [下载页面](https://github.com/jinwyp/electron-learning/releases) 下载 dmg 文件 
2. 解压后复制到 /Applications 然后运行即可.


### Windows 下安装

1. 在 [下载页面](https://github.com/jinwyp/electron-learning/releases) 下载 exe 文件 
2. 运行exe 解压到任意目录,  然后运行即可.


### 问题解答

1. 本软件依赖于ffmpeg和youtube-dl, 默认已经包括在程序中. 如遇到问题, 可以自己安装这两个软件.
2. Mac 上安装 youtube-dl , 运行 ```brew install youtube-dl ``` 然后运行 ```which youtube-dl ``` 显示youtube-dl所在路径, 然后把 youtube-dl 可执行文件复制到本项目的/resources/mac ``` cp /usr/local/bin/youtube-dl ./resources/mac ```
3. Mac 上安装 ffmpeg 用来转换音频格式, 运行 ```brew install ffmpeg--with-libvpx ```  然后把 ffmpeg 可执行文件复制到本项目的/resources/mac ``` cp /usr/local/bin/ffmpeg ./resources/mac ```
4. 在 Windows 上下载 youtube-dl.exe 浏览器打开 [youtube-dl官方网站](https://youtube-dl.org/) 下载对应版本. 然后把 youtube-dl.exe 可执行文件复制到本项目的/resources/win下
5. 在 Windows 上下载 FFmpeg, 浏览器打开 [FFmpeg官方网站](https://ffmpeg.zeranoe.com/builds/) 下载对应版本.  然后把 ffmpeg.exe 可执行文件复制到本项目的/resources/win下





## Development 



### Setting environment On Mac 

1. Install node.js on Mac. Git Clone this project
2. Enter project folder and  run ```npm install``` and ```npm install -g @vue/cli``` and ``` vue add electron-builder ```
3. On mac, run  ```brew install youtube-dl ``` After install youtube-dl, then copy youtube-dl file to YouElectron folder /resources/mac. ``` cp /usr/local/bin/youtube-dl ./resources/mac ```
4. On mac, run ```brew install ffmpeg--with-libvpx ``` After install ffmpeg, then copy ffmpeg file to YouElectron folder /resources/mac. ``` cp /usr/local/bin/ffmpeg ./resources/mac ```
5. Run ```npm run electron:serve```  To development .


### Setting environment On Windows

1. Install node.js on Mac. Git Clone this project
2. Enter project folder and  run ```npm install``` and ```npm install -g @vue/cli```
3. On windows, open link [youtube-dl site](https://youtube-dl.org/) . Download windows platform version. Then copy youtube-dl.exe file to YouElectron folder /resources/win
4. On windows, open link [FFmpeg site](https://ffmpeg.zeranoe.com/builds/). Download windows platform version. Then copy ffmpeg.exe to YouElectron folder /resources/win
5. Run ```npm run electron:serve```  To development .
 


### How to Build 

1. Run ```npm run electron:build```  to build, and all files package to dist_electron folder




## Development 开发环境搭建


### 安装环境 Mac

1. 安装node.js, git clone 该项目.
2. 进入项目目录后, 运行 ```npm install``` 与  ```npm install -g @vue/cli``` 与 ``` vue add electron-builder ```
3. Mac 上安装 youtube-dl , 运行 ```brew install youtube-dl ``` 然后运行 ```which youtube-dl ``` 显示youtube-dl所在路径, 然后把 youtube-dl 可执行文件复制到本项目的/resources/mac ``` cp /usr/local/bin/youtube-dl ./resources/mac ```
4. Mac 上安装 ffmpeg 用来转换音频格式, 运行 ```brew install ffmpeg--with-libvpx ```  然后把 ffmpeg 可执行文件复制到本项目的/resources/mac ``` cp /usr/local/bin/ffmpeg ./resources/mac ```
5. 启动程序, 运行 ```npm run electron:serve``` 进入开发热更新环境.

6. 如果npm i 卡住 可以安装淘宝的npm源 ``` npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver ```
7. 或把 https://npm.taobao.org/mirrors/electron/4.0.5/chromedriver-v4.0.5-darwin-x64.zip 下载 解压后  替换该项目 electron-learning/node_modules/spectron/node_modules/electron-chromedriver/bin




### 安装环境 Windows 

1. 安装node.js, git clone 该项目.
2. 进入项目目录后, 运行 ```npm install``` 与  ```npm install -g @vue/cli```
3. 在 Windows 上下载 youtube-dl.exe 浏览器打开 [youtube-dl官方网站](https://youtube-dl.org/) 下载对应版本. 然后把 youtube-dl.exe 可执行文件复制到本项目的/resources/win下
4. 在 Windows 上下载 FFmpeg, 浏览器打开 [FFmpeg官方网站](https://ffmpeg.zeranoe.com/builds/) 下载对应版本.  然后把 ffmpeg.exe 可执行文件复制到本项目的/resources/win下
5. 启动程序, 运行 ```npm run electron:serve```  开启程序.

6. 如果npm i 卡住 可以安装淘宝的npm源 ``` npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver ```
7. 或把 https://npm.taobao.org/mirrors/electron/4.0.5/chromedriver-v4.0.5-darwin-x64.zip 下载 解压后  替换该项目 electron-learning/node_modules/spectron/node_modules/electron-chromedriver/bin



### 打包编译 

1. 运行 ```npm run electron:build```  打包编译, 最后生成的文件在dist_electron 下



### File structure / 文件结构

1. Entry file 入口文件为 src/background.js, 此为electron 主进程文件. 在package.json可以修改该入口文件.
2. src/background.js 运行后启动 public/index.html,  进入页面后启动 src/main.js  即Vue的第一个js文件.
3. src/main.js 调用IndexApp.vue组件 运行Vue的第一个组件.









## Electron Tutorial / 快速入门 教程

[Electron 快速入门](https://github.com/nodejh/nodejh.github.io/issues/39)


## Resource / 相关资源

[youtube-dl 下载youtube视频工具](https://github.com/rg3/youtube-dl)

[ffmpeg 音频视频转换工具](https://ffmpeg.org/documentation.html)

[ffmpeg 按照脚本 带各种解码器](https://gist.github.com/clayton/6196167)

[electron taobao的镜像 chromedriver-v4.0.5-darwin-x64.zip](https://npm.taobao.org/mirrors/electron/4.0.5/)




