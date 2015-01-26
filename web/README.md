bamboo-web
==========

Bamboo web frontend

##### For develop:
###### # initialize project
    npm install gulp -g
    npm install
###### # run
    gulp
    # open http://localhost:8000/

##### For deploy:
    # git push will auto update
    
#### Directory Structure
+ **bin**
 - **supervisor.conf** Supervisor启动配置
 - **update.js** 自动部署脚本
+ **gulpfile.js** Gulp编译配置
+ **src**
 - **css**
     - **font** iconfont资源
     - ***.less** 页面CSS
 - **img** 图片资源
 - **js**
     - **module** 页面模块
         - **index** 首页
             - **IndexModel.coffee** 逻辑
             - **IndexView.coffee** 视图
             - **template.html** 模板
         - **main** 主页
             - ...
         - **AppModel.coffee** 应用入口
     - **vender** JS第三方库
 - **index.html** 应用页面