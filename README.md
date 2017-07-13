# gharry

为 [courser](https://github.com/racecourse/courser) 而写的自动重载工具,
    基于 nodejs `fs.watch`, 文件更改自动重载应用,适用所有 swoole 程序


### install
`npm install gharry`   

or `npm install gharry -g`

### get start
config:
```
{
  "watch": ".", // listen dir string or array
  "script": "demo/index.php", // 
  "language": "php", // execute file
  "ignore": ["node_modules"] // ignore string or array
  "safe": "true" // safe relaod server
  "args": {
    "--env": "dev"
  }
}
```
- watch 监听目录，字符串或者数组
- script 执行脚本 默认 index.js
- language 语言 默认 node
- ignored 忽略的目录 字符或者数组
- safe 是否安全重载程序，默认为 true， 设为 false 时每次更改将强制杀掉程序再重启
- args 命令行参数 如执行 php index.php `--env dev` 对应 args => { "--env": "dev" }


`gharry -c gharry.json` 

`gharry --help`


