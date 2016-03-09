/**
 * 报名参赛，上传图片
 * Created by ayou on 2016-03-09.
 */

$(function() {
  // 清空图片隐藏域值
  $("#enroll-1-img").val("");

  // 定义上传对象
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
    //sendAsBinary: true,
    fileNumLimit: 1, //文件最多数量
    fileSingleSizeLimit: 5 * 1024 * 1024, // 单个文件大小限制:2 M
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

  // 开始上传时，把进度条置为0
  uploader.on('uploadBeforeSend', function() {
    // 去掉验证信息
    if(enrollHandler.errorType.img) {
      enrollHandler.errorType.img = false;
      $('#enroll-1-error').html("");
    }
    $("#enroll-bar").css('width',0);
  });

  uploader.on("error", function (type) {
    if (type == "Q_TYPE_DENIED") {
      J_app.alert("请上传JPG、PNG格式文件");
    } else if (type == "F_EXCEED_SIZE") {
      J_app.alert("文件大小不能超过5M");
    }
  });
  // 上传成功
  uploader.on('uploadSuccess', function (file, response) {
    if (response.code === 0) {
      var $img = $("#enroll-upload-img");
      var height = $img.height();
      var width = $img.width();
      // 创建缩略图
      uploader.makeThumb(file, function (error, src) {
        if (error) {
          $img.replaceWith('<span>不能预览</span>');
          return;
        }
        $img.attr('src', src);
      }, width, height);

      $("#enroll-1-img").val(response.result.urls);
    } else {
      J_app.alert("上传失败");
    }

  });
  // 上传失败
  uploader.on('uploadError', function (file) {
    J_app.alert("上传失败");
  });
  // 进度条
  uploader.on("uploadProgress", function(file,percentage) {
    $("#enroll-bar").css('width', percentage * 100 + '%');
  });
  // 完成上传
  uploader.on( 'uploadComplete', function(file) {
    uploader.removeFile(file);
  });
});