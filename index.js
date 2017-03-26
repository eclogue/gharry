var monitor = require('chokidar');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var color = require('cli-color');
var fs = require('fs');
var util = require('util');
var commander = require('commander');
var os = require('os');
var path = require('path');

var pwd = process.env.PWD;
var config = {
  pid: os.tmpDir() + '/gharry.pid',
  pwd: pwd,
  script: 'js',
  execute: 'index.js',
  ignored: '',
  watch: '.',
  safe: false,
};
// process.stdout.write(color.erase.screen);
// process.stdout.write(color.reset);
var run = function () {
  monitor.watch(config.watch, { ignored: config.ignore })
    .on('change', function (path) {
      console.log(color.cyan('path changed:' + path));
      startUp(path);
    })
    .on('ready', function () {
      startUp();
    })
    .on('unlink', function (path) {
      console.log(color.cyan('path unlink:' + path));
      startUp(path);
    })
    .on('error', function (err) {
      console.log(err);
      stop();
    });

};

var startUp = function (file = '') {
  console.log(color.bgCyan('gharry start up process'));
  if (!fs.existsSync(config.pid)) {
    var fd = fs.openSync(config.pid, 'w+');
    fs.writeSync(fd, '');
    fs.close(fd);
  }
  var pid = fs.readFileSync(config.pid);
  pid = pid.toString().replace(/(\n|\r|(\r\n)|\s)/g, '');
  if (pid) {
    var cmd = '';
    if(!config.safe) {
      cmd = util.format("ps -C %s | grep -v PID | awk '{print $1}' | xargs kill -15", pid);
    } else {
      cmd = util.format("ps -C %s | grep -v PID | awk '{print $1}'", pid);
    }
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.log(color.red(err.message));
        console.log(stdout, stderr);
      }
      if(stdout && config.safe){
        if(file === config.execute) {
          process.kill(pid, 'SIGTERM'); // 重启主进程
        } else {
          process.kill(pid, 'SIGUSR1');
          process.kill(pid, 'SIGUSR2');
        }
      } else {
        watching();
      }
    });
  } else {
    watching();
  }
};

var stop = function () {

};


var watching = () => {
  var server = spawn.apply(null, [config.script, [config.execute], { cwd: config.pwd }]);
  console.log(color.green('listen process pid: ', server.pid));
  var fd = fs.openSync(config.pid, 'w+');
  fs.writeSync(fd, server.pid);
  fs.close(fd);
  server.stdout.on('data', function (data) {
    console.log(color.xterm(4)(data.toString()));
  });

  // 捕获标准错误输出并将其打印到控制台
  server.stderr.on('data', function (data) {
    console.log(color.red.bgBlackBright(data.toString()));
  });
  server.on('error', function (err) {
    console.log(err.message);
    // if(err.message === 'spawn js ENOENT') return;
    console.log(color.red('error on process:', err.code), err.message);
    console.log(color.red('stack:', err.stack));
    console.log(color.yellow('wait for change....'))
  });

  server.on('exit', function (code, signal) {
    console.log(color.yellow('process state change, waiting for file changing ...'));
  });
};

commander.version('0.1.2')
// .option('-h, --help', '--help show menus')
  .option('--config <file>', 'use config file');

commander.on('--help', function () {
  console.log(color.green('   --config, use config file'));
});
commander.parse(process.argv);
if (commander.config) {
  var conf = fs.readFileSync(pwd + '/' + commander.config);
  conf = JSON.parse(conf);
  config = Object.assign(config, conf);
}
run();

//
// commander.command('start')
//   .description('start server')
//   .action(function (name) {
//     pm2.connect(function (err) {
//       if (err) {
//         console.error(err);
//         process.exit(2);
//       }
//
//       pm2.start({
//         interpreter: "php",
//         script: executeFile,         // Script to be run
//         exec_mode: 'fork',        // Allow your app to be clustered
//         instances: 1,                // Optional: Scale your app by 4
//         max_memory_restart: config.memory   // Optional: Restart your app if it reaches 100Mo
//       }, function (err, apps) {
//         pm2.disconnect();   // Disconnect from PM2
//         if (err) throw err
//       });
//     });
//   });
//
//
// commander.arguments('<cmd>')
//   .action(function (cmd) {
//     pm2.connect(function (err) {
//       if (err) {
//         console.error(err);
//         process.exit(2);
//       }
//       if (!pm2.hasOwnProperty(cmd)) {
//         console.log('Illegal command~,Bye!');
//         process.exit(3);
//       }
//       pm2[cmd]({
//         interpreter: "php",
//         script: executeFile,
//         exec_mode: config.mode || 'fork',
//         instances: 1,
//         max_memory_restart: config.memory
//       }, function (err, apps) {
//         pm2.disconnect();
//         if (err) throw err
//       });
//     });
//   });


