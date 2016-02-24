'use strict';

var express = require('express');
var app = express();

app.static('dist'); // 主文件

app.listen(9003);