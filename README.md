# gharry

为 [courser](https://github.com/racecourse/courser) 而写的自动重载工具,
    基于 nodejs `fs.watch`, 文件更改自动重载应用,适用所有 swoole 程序


### install
`npm install gharrt`   

or `npm install gharry -g`

### get start
config:
```
{
  "watch": ".", // listen dir string or array
  "script": "php", // 
  "execute": "demo/index.php", // execute file
  "ignore": ["node_modules"] // ignore string or array
  "safe": "true" // safe relaod server
}
```
`gharry -c gharry.json` 

`gharry --help`


