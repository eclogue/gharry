<?php
$serv = new Swoole\Http\Server("127.0.0.1", 9502);

$serv->on('Request', function($request, $response) {
    var_dump($request->header);
    var_dump($request->server);
    $response->cookie("User", "Swoole");
    $response->header("X-Server", "Swoole");
    $response->end("<h1>Fuck world!</h1>");
});
$serv->start();