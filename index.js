const monitor = require('chokidar');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const color = require('cli-color');
const fs = require('fs');
const util = require('util');
const commander = require('commander');
const os = require('os');


const pwd = process.env.PWD;
let config = {
  pid: os.tmpDir() + '/gharry.pid',
  pwd: pwd,
  script: 'js',
  execute: 'index.js',
  ignored: '',
  watch: '.',
};


const run = function () {
  console.log(config);
  monitor.watch('.', { ignored: ['node_modules'] })
    .on('change', function (path) {
      console.log('%%%%%%%%change');
      startUp();
    })
    .on('ready', function () {
      console.log('rrrrrrrready');
      startUp();
    })
    .on('unlink', function () {
      startUp();
    })
    .on('error', function (err) {
      console.log(err);
      stop();
    });

};

const startUp = function () {
  if (!fs.existsSync(config.pid)) {
    let fd = fs.openSync(config.pid, 'w+');
    fs.writeSync(fd, '');
    fs.close(fd);
  }
  let pid = fs.readFileSync(config.pid);
  pid = pid.toString().replace(/(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))/g, '');
  if (pid) {
    let cmd = util.format("ps -C %s | grep -v PID | awk '{print $1}' | xargs kill -15", pid);
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        console.log(color.red(err.message));
        console.log(stdout, stderr);
      } else {
        watching();
      }
    });
  } else {
    watching();
  }
};

const stop = function () {

};


const watching = () => {
  const server = spawn.apply(null, [config.script, [config.execute], { cwd: config.pwd }]);
  console.log(color.green('child process pid: ', server.pid));
  console.log(config.pid);
  const fd = fs.openSync(config.pid, 'w+');
  fs.writeSync(fd, server.pid);
  fs.close(fd);
  server.stdout.on('data', function (data) {
    console.log(color.blue(data.toString()));
  });

  // 捕获标准错误输出并将其打印到控制台
  server.stderr.on('data', function (data) {
    console.log(color.red.bgBlackBright(data.toString()));
  });
  server.on('error', function (err) {
    console.log(color.red('error on process:', err.code), err.message);
    console.log(color.red('stack:', err.stack));
    console.log(color.yellow('wait for change....'))
  });

  server.on('exit', function (code, signal) {
    console.log(color.yellow('start process fail or process exit, waiting for file changing ...'));
  });
};

commander.version('0.0.1')
// .option('-h, --help', '--help show menus')
  .option('--config <file>', 'use config file')
  .option('--start <action>', 'start process')
  .option('--stop <action>', 'manage worker stop')

commander.on('--help', function () {
  console.log(color.green('   --config, use config file'));
  console.log(color.green('   --start, start process'));
  console.log(color.green('   --stop, start process'));
});
commander.parse(process.argv);

if (commander.config) {
  let conf = fs.readFileSync(pwd + '/' + commander.config);
  console.log(conf.toString());
  conf = JSON.parse(conf);
  config = Object.assign(config, conf);
  console.log(config);
}
if (commander.start || commander.restart) {
  run();
}

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


