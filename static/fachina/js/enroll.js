/**
 * 报名参赛
 * Created by ayou on 2016-03-03.
 */

function validName(name) {
  var re = /^[\u4e00-\u9fa5]{1,5}$/;
  if (re.test(name)) {
    return true;
  } else {
    return false;
  }
}

var enrollHandler = window.enrollHandler || {};

// 报名参赛跳转
enrollHandler.api = "index.html";

// 小白 rookie
enrollHandler.rookieInit = function () {
  // 绑定报名参赛跳转
  $('#enroll-2-btn').click(function () {
    // 得到cId
    var cId = $.cookie("fachinaId");
    // 得到真实姓名
    var realName = $('#enroll-2-name').val();
    // 验证姓名
    if (!validName(realName)) {
      $('#enroll-2-error').html("请输入真实姓名");
      return;
    }
    // 报名
    var params = {};
    params['cId'] = cId;
    params['realName'] = realName;
    J_app.ajax(J_app.api.join, params, function (data) {
      console.log(data);
      if (data.code === 0) {
        // 报名参赛成功后跳转
        window.location.href = enrollHandler.api;
      } else {
        $("#enroll-2-error").html("<p>" + data.message + "</p>");
      }
    }, function () {
      J_app.alert('请求失败！');
    });
  });
  // 输入框获取焦点时清除错误信息
  $('#enroll-2-name').focus(function () {
    $('#enroll-2-error').html("");
  });
}

// 投顾
enrollHandler.adviserInit = function () {


  //$("#enroll-1-org").val("test");

  //$("#enroll-upload-btn").change(function() {
  //
  //  $("#enroll-upload-form").attr("action",J_app.api.image);
  //  $("#enroll-upload-form").submit();
  //
  //  //console.log('1');
  //  //var file = $("#enroll-upload-btn").val();
  //  //var param = {};
  //  //param['cId'] = $.cookie("fachinaId");
  //  //param['filesData'] = file;
  //  //console.log(param);
  //  //J_app.ajax(J_app.api.image, param, function(data) {
  //  //  console.log(data);
  //  //},function() {
  //  //  J_app.alert('请求失败！');
  //  //});
  //});
  var uploader = WebUploader.create({
    auto: true, // 自动上传
    swf: '../../static/common/js/libs/webuploader/Uploader.swf', // swf文件路径(以falsh方式支持IE上传)
    server: J_app.api.image, // 文件接收服务端
    pick: '#enroll-upload-btn',
    // 只允许选择文件，可选。
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    },
    fileNumLimit: 2, //文件最多数量
    fileSingleSizeLimit: 2 * 1024 * 1024, // 单个文件大小限制:2 M
    thumb: {
      width: 120,
      height: 120,
      quality: 50, // 图片质量，只有type为`image/jpeg`的时候才有效
      allowMagnify: false, // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false
      crop: true, // 是否允许裁剪
      type: 'image/jpeg' // 为空的话则保留原有图片格式，否则强制转换成指定的类型
    },
    duplicate: true //默认为undefined，是否允许重复文件（true为同一文件可以重复上传，false同一个文件只允许上传一次）
  });



  //uploader.on('uploadBeforeSend', function(obj, data, headers) {
  //  $.extend(headers, {
  //    "Origin": "http://localhost:63342",
  //    "Access-Control-Request-Method": "POST"
  //  });
  //});

   //上传成功
  uploader.on('uploadSuccess', function (file, response) {
    alert(1);
    console.log(response);
    //var data = response.result;
    //
    //if(data !== null && data !== undefined) {
    //  var url = data.urls,
    //    hiddenHtml = '<input type="hidden" class="upload-img-val" name="img-val-' + file.id + '" value="' + url + '">';
    //
    //  //$('#' + file.id).addClass('upload-state-done');
    //  $('#' + file.id).append(hiddenHtml);
    //} else {
    //  var $li = $('#'+file.id),
    //    $error = $li.find('div.error');
    //
    //  // 避免重复创建
    //  if(!$error.length) {
    //    $error = $('<div class="error"></div>').appendTo($li);
    //  }
    //
    //  $error.text('上传失败');
    //}
  });

  uploader.on('uploadError', function (file) {
    alert("错误")
  });

}

$(function () {
  enrollHandler.rookieInit();
  enrollHandler.adviserInit();
});