1、创建文件夹koa-sever

2、在终端执行  koa2 （前提 全局已安装koa2）

3、依次执行以下代码，添加相应的依赖

```
// mysql 数据库连接的
npm install co-mysql -S
//解决前后台跨域问题的
npm install core-js -S

//....


{
  "name": "koa-sever",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "./node_modules/.bin/nodemon bin/www",
    "prd": "pm2 start bin/www",
    "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "ts-node ./src/bin/index.ts",
    "start": "nodemon --watch src/bin/index.ts",
    "build": "tsc",
    "debugger": "nodemon  --watch ./src -e  ts,tsx  --exec node --inspect -r ts-node/register  ./src/bin/index.ts",
    "watch-serve": "nodemon  --watch './src/**/*' -e  ts,tsx  --exec ts-node  ./src/bin/index.ts"
  },
  "dependencies": {
    "co-mysql": "^1.0.0",
    "core-js": "^3.2.1",
    "debug": "^4.1.1",
    "koa": "^2.7.0",
    "koa-bodyparser": "^4.2.1",
    "koa-convert": "^1.2.0",
    "koa-json": "^2.0.2",
    "koa-router": "^7.4.0",
    "koa-cors": "0.0.16",
    "pug": "^2.0.3",
    "koa-jwt": "^3.6.0"
  },
  "devDependencies": {
    "@types/koa": "^2.0.49",
    "@types/koa-bodyparser": "^4.3.0",
    "@types/koa-jwt": "^3.3.0",
    "@types/koa-router": "^7.0.42",
    "@types/node": "^12.7.5",
    "jasmine-core": "~3.4.0",
    "jasmine-spec-reporter": "~4.2.1",
    "karma": "~4.2.0",
    "karma-chrome-launcher": "~3.0.0",
    "karma-coverage-istanbul-reporter": "~2.0.1",
    "karma-jasmine": "~2.0.1",
    "karma-jasmine-html-reporter": "^1.4.2",
    "koa": "^2.7.0",
    "koa-bodyparser": "^4.2.1",
    "koa-mysql-session": "0.0.2",
    "koa-router": "^7.4.0",
    "koa-session-minimal": "^3.0.4",
    "koa-static": "^5.0.0",
    "koa-static-cache": "^5.1.2",
    "koa-views": "^6.2.0",
    "markdown-it": "^9.0.1",
    "md5": "^2.2.1",
    "mocha": "^6.1.4",
    "moment": "^2.24.0",
    "mysql": "^2.17.1",
    "nodemon": "^1.19.1",
    "protractor": "~5.4.0",
    "ts-node": "~8.3.0",
    "tslint": "~5.11.0",
    "typescript": "~3.4.5"
  }
}



```



4、npm install



5、添加model 文件夹

​    编写数据库操作代码

6、添加middleware 编写中间件，如返回值封装等



7、在bin中添加config.js 连接数据库，声明基础变量



8、处理app.js 运行代码

++++++++++++++++++++++++++++++++++++++++++++++++++++++++

如果使用typescript编写程序的话

5、新建src文件里面装待编译代码（ts编写的）

6、新建dist 装编译完成后的代码

7、在src中重复以上步骤





