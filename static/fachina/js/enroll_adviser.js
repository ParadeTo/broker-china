/**
 *  报名参赛
 * Created by ayou on 2016-03-10.
 */

// 验证姓名
function validName(name) {
  var re = /^[\u4e00-\u9fa5]{1,5}$/;
  if (re.test(name)) {
    return true;
  } else {
    return false;
  }
}
// 验证身份证号
function validIdNum(idNum) {
  var re = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
  if (re.test(idNum)) {
    return true;
  } else {
    return false;
  }
}
// 验证执业编号
function validProCode(proCode) {
  var re = /^\w+$/;
  if (re.test(proCode)) {
    return true;
  } else {
    return false;
  }
}
// 验证表单
function validForm() {
  // 真实姓名
  var realName = $("#enroll-1-name").val().trim();
  if (!validName(realName)) {
    $('#enroll-1-error').html("请输入真实姓名");
    enrollAdviserHandler.errorType.realName = true;
    return false;
  }
  // 身份证号
  var idNumber = $("#enroll-1-idNum").val().trim();
  if (!validIdNum(idNumber)) {
    $('#enroll-1-error').html("请输入正确身份证号");
    enrollAdviserHandler.errorType.idNum = true;
    return false;
  }
  // 执业编码
  var licenceCode = $("#enroll-1-proCode").val().trim();
  if (!validProCode(licenceCode)) {
    $('#enroll-1-error').html("请输入执业编码");
    enrollAdviserHandler.errorType.proCode = true;
    return false;
  }
  // 所属机构
  var oId = $("#enroll-1-org-id").val();
  if (!oId) {
    $('#enroll-1-error').html("请选择机构");
    enrollAdviserHandler.errorType.oId = true;
    return false;
  }
  // 所属营业部
  var dept = $("#enroll-1-office").val().trim();
  if (!dept) {
    $('#enroll-1-error').html("请输入所属营业部");
    enrollAdviserHandler.errorType.office = true;
    return false;
  }
  // 所在城市
  var cityId = $("#enroll-1-city-id").val();
  if (!cityId) {
    $('#enroll-1-error').html("请选择城市");
    enrollAdviserHandler.errorType.cityId = true;
    return false;
  }
  // 头像
  var certImgs = $("#enroll-1-img").val();
  if (!certImgs) {
    $('#enroll-1-error').html("请上传头像");
    enrollAdviserHandler.errorType.img = true;
    return false;
  }
  // cId
  if (!$.cookie('fachinaId')) {
    $('#enroll-1-error').html("请登录");
    return false;
  }
  // 返回数据
  var param = {};
  param['realName'] = realName;
  param['idNumber'] = idNumber;
  param['licenceCode'] = licenceCode;
  param['oId'] = oId;
  param['cityId'] = cityId;
  param['dept'] = dept;
  param['certImgs'] = [certImgs];
  return param;
}
// 机构列表排序
function sortOrg(orgs) {
  // 得到机构字符串首字母
  for(var i=0;i<orgs.length;i++) {
    orgs[i].py = makePy(orgs[i]['oName'])[0];
    orgs[i].firstLetter = orgs[i].py.charAt(0);
  }
  orgs.sort(function(obj1,obj2) {
      var v1 = obj1['py'];
      var v2 = obj2['py'];
      if(v1 < v2) {
        return -1;
      } else if (v1 > v2) {
        return 1;
      } else {
        return 0;
      }
    });
  return orgs;
}

var enrollAdviserHandler = window.enrollAdviserHandler || {};
// 上传头像大小限制,单位byte
enrollAdviserHandler.imgSize = 5 * 1024 * 1024;
// 上传头像文件类型
enrollAdviserHandler.imgExt = 'gif,jpg,jpeg,bmp,png';
// 报名参赛跳转
enrollAdviserHandler.api = "index.html";
// 城市名称
enrollAdviserHandler.cityName = "";
// 错误类型
enrollAdviserHandler.errorType = {
  realName: false,
  idNum: false,
  oId: false,
  proCode: false,
  office: false,
  cityId: false,
  img: false
}

// 投顾
enrollAdviserHandler.adviserInit = function () {
  enrollAdviserHandler.chooseOrg();
  enrollAdviserHandler.chooseCity();
  enrollAdviserHandler.back();
  enrollAdviserHandler.apply();
  enrollAdviserHandler.clearErrorMsg();
};

// 清除验证提示信息
enrollAdviserHandler.clearErrorMsg = function () {
  // 真实姓名
  $("#enroll-1-name").focus(function () {
    if (enrollAdviserHandler.errorType.realName) {
      enrollAdviserHandler.errorType.realName = false;
      $('#enroll-1-error').html("");
    }
  });
  // 身份证号
  $("#enroll-1-idNum").focus(function () {
    if (enrollAdviserHandler.errorType.idNum) {
      enrollAdviserHandler.errorType.idNum = false;
      $('#enroll-1-error').html("");
    }
  });
  // 执业编号
  $("#enroll-1-proCode").focus(function () {
    if (enrollAdviserHandler.errorType.proCode) {
      enrollAdviserHandler.errorType.proCode = false;
      $('#enroll-1-error').html("");
    }
  });
  // 所属营业部
  $("#enroll-1-office").focus(function () {
    if (enrollAdviserHandler.errorType.office) {
      enrollAdviserHandler.errorType.office = false;
      $('#enroll-1-error').html("");
    }
  })
};

// 提交申请
enrollAdviserHandler.apply = function () {
  $("#enroll-apply").click(function () {
    var $this = $(this);
    var param = validForm();
    if (!param) {
      return;
    }
    // 防重发
    if ($this.hasClass('locked')) {
      return;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);

    J_app.ajax(J_app.api.verify, param, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        J_app.alert("已提交审核");
        setTimeout(function () {
          window.location.href = enrollAdviserHandler.api;
        }, 1000);
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert("请求超时！");
    });
  });
}

// 绑定头部back事件
enrollAdviserHandler.back = function () {
  // 省市列表
  $("#enroll-pro-back").click(function () {
    // 显示信息列表
    $("#info").show();
    // 隐藏省市、城市列表
    $("#pro").hide();
    $("#city").hide();
  });
  // 城市列表
  $("#enroll-city-back").click(function () {
    // 显示省市列表
    $("#pro").show();
    // 隐藏信息、城市列表
    $("#info").hide();
    $("#city").hide();
  });
  // 机构列表
  $("#enroll-org-back").click(function () {
    // 显示信息列表
    $("#info").show();
    // 隐藏省市、城市列表
    $("#org").hide();
  });
};

// 选择机构
enrollAdviserHandler.chooseOrg = function () {
  $("#enroll-org-btn").click(function () {
    var $this = $(this);
    // 去掉验证信息
    if (enrollAdviserHandler.errorType.oId) {
      enrollAdviserHandler.errorType.oId = false;
      $('#enroll-1-error').html("");
    }
    // 防重发
    if ($this.hasClass('locked')) {
      return;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);
    J_app.ajax(J_app.api.organization, {}, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // 显示机构列表，隐藏信息列表
        var $ul = $("#org ul");
        var sortedList = sortOrg(data.result.datas);
        console.log(sortedList);
        var _html = enrollAdviserHandler.orgList(sortedList);
        $ul.html(_html);
        $("#org").show();
        $("#info").hide();
        // 绑定点击机构的事件
        enrollAdviserHandler.clickOrg();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('请求超时！');
    });
  });
};

// 选择城市
enrollAdviserHandler.chooseCity = function () {
  $("#enroll-city-btn").click(function () {
    var $this = $(this);
    // 去掉验证信息
    if (enrollAdviserHandler.errorType.cityId) {
      enrollAdviserHandler.errorType.cityId = false;
      $('#enroll-1-error').html("");
    }
    // 防重发
    if ($this.hasClass('locked')) {
      return;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);
    J_app.ajax(J_app.api.province, {}, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // 显示省份列表，隐藏信息列表
        var $ul = $("#pro ul");
        var _html = enrollAdviserHandler.proList(data.result.datas, "provId");
        $ul.html(_html);
        $("#pro").show();
        $("#info").hide();
        // 绑定点击省市的事件
        enrollAdviserHandler.clickPro();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('请求超时！');
    });
  });
};

// 生成省市或城市列表
enrollAdviserHandler.proList = function (list, id) {
  if (list.length <= 0) {
    return null;
  }
  var _html = '';
  for (index in list) {
    if (index === '0' || (index > 0 && list[index]['tit'] !== list[index - 1]['tit'])) {
      _html += '<li class="enroll-address-initial">';
      _html += list[index]['tit'];
      _html += '</li>';
    }
    _html += '<li class="enroll-address-row" data-id="' + list[index][id] + '">';
    _html += list[index]['name'];
    _html += '</li>';
  }
  return _html;
};

//生成机构列表
enrollAdviserHandler.orgList = function (list) {
  if (list.length <= 0) {
    return null;
  }
  var _html = '';
  for (index in list) {
    if(index === '0' || (index > 0 && list[index]['firstLetter'] !== list[index - 1]['firstLetter'])) {
      _html += '<li class="enroll-address-initial">';
      _html += list[index]['firstLetter'];
      _html += '</li>';
    }
    _html += '<li class="enroll-address-row" data-id="' + list[index]['oId'] + '">';
    _html += list[index]['oName'];
    _html += '</li>';
  }
  return _html;
};

// 绑定点击机构事件
enrollAdviserHandler.clickOrg = function () {
  var orgs = $("#org .enroll-address-row");

  orgs.click(function () {
    // 得到机构id和名字
    var oId = $(this).data("id");
    var oName = $(this).html();
    // 将机构id和名字赋值
    $("#enroll-1-org-id").val(oId);
    $("#enroll-1-org").html(oName);
    // 显示信息列表，隐藏机构列表
    $("#info").show();
    $("#org").hide();
  })
};

// 绑定点击省市事件
enrollAdviserHandler.clickPro = function () {
  var pros = $("#pro .enroll-address-row");

  pros.click(function () {
    var $this = $(this);
    var $li = $(this);
    // 得到省市id
    var proId = $li.data("id");
    // 获取城市列表
    var param = {};
    param['provId'] = proId;
    // 防重发
    if ($this.hasClass('locked')) {
      return;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);
    J_app.ajax(J_app.api.city, param, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // 示城市列表，隐藏省市列表、信息列表
        var $ul = $("#city ul");
        var _html = enrollAdviserHandler.proList(data.result.datas, "cityId");
        $ul.html(_html);
        $("#city").show();
        $("#pro").hide();
        $("#info").hide();
        // 将省市名赋值给城市名称
        enrollAdviserHandler.cityName = $li.html();
        // 绑定城市点击事件
        enrollAdviserHandler.clickCity();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('请求超时！');
    });
  });
};

// 绑定点击城市事件
enrollAdviserHandler.clickCity = function () {
  var citys = $("#city .enroll-address-row");
  citys.click(function () {
    // 得到城市id和名字
    var cityId = $(this).data("id");
    var cityName = $(this).html();
    enrollAdviserHandler.cityName += ' ' + cityName;
    // 将城市id和名字赋值给input
    $("#enroll-1-city-id").val(cityId);
    $("#enroll-1-city").html(enrollAdviserHandler.cityName);
    // 显示信息列表，隐藏省市和城市列表
    $("#info").show();
    $("#pro").hide();
    $("#city").hide();
  });
};

// 上传图片-Android版
enrollAdviserHandler.uploadAndroid = function () {
  // 进度条函数
  function onProgress(file) {
    if (file.lengthComputable) {
      var per = Math.floor(100 * file.loaded / file.total);
      $("#enroll-bar").css('width', per + '%');
    }
  }

  // 带图片验证的上传
  $('#enroll-upload-android-btn').checkFileTypeAndSize({
    allowedExtensions: enrollAdviserHandler.imgExt,
    maxSize: enrollAdviserHandler.imgSize, //单位是byte
    success: function () {
      // 去掉验证信息
      if (enrollAdviserHandler.errorType.img) {
        enrollAdviserHandler.errorType.img = false;
        $('#enroll-1-error').html("");
      }
      $("#enroll-bar").css('width', 0);
      $("#enroll-1-img").val('');
      var fileObj = document.getElementById("enroll-upload-android-btn").files[0]; // 获取文件对象
      var form = new FormData();
      form.append("file", fileObj); // 文件对象添加到form表单中
      $.ajax({
        url: J_app.api.image,
        type: 'POST',
        data: form,
        async: true, // 进度条需要异步上传
        cache: false,
        contentType: false,
        processData: false,
        xhr: function () { // 进度条
          var xhr = $.ajaxSettings.xhr();
          if (onProgress && xhr.upload) {
            xhr.upload.addEventListener("progress", onProgress, false);
            return xhr;
          }
        },
        success: function (data) {
          if (data.code === 0) {
            // 这个在android下不行呀
            // $("#enroll-1-img").val(data.result.urls);
            // 换成这个吧
            document.getElementById("enroll-1-img").value = data.result.urls;
            $("#enroll-upload-preview").attr('src', data.result.urls);
          } else {
            J_app.alert(data.message);
          }
        },
        error: function (error) {
          J_app.alert(JSON.stringify(error));
        }
      });
    },
    extensionerror: function () {
      J_app.alert('允许的图片格式为：' + enrollAdviserHandler.imgExt);
      return;
    },
    sizeerror: function () {
      J_app.alert('允许的图片大小为：' + enrollAdviserHandler.imgSize / 1024 / 1024 + "m");
      return;
    }
  });
};

// 上传图片-IOS版
enrollAdviserHandler.uploadIOS = function () {
  // 清空图片隐藏域值
  $("#enroll-1-img").val("");
  // 定义上传对象
  var uploader = WebUploader.create({
    auto: true, // 自动上传
    swf: '../../static/common/js/libs/webuploader/Uploader.swf', // swf文件路径(以falsh方式支持IE上传)
    server: J_app.api.image, // 文件接收服务端
    pick: '#enroll-upload-ios-btn',

    // 只允许选择文件，可选。
    accept: {
      title: 'Images',
      extensions: enrollAdviserHandler.imgExt, // 上传文件类型
      mimeTypes: 'image/*'
    },
    fileNumLimit: 1, //文件最多数量
    fileSingleSizeLimit: enrollAdviserHandler.imgSize, // 上传文件大小
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
  uploader.on('uploadBeforeSend', function () {
    // 去掉验证信息
    if (enrollAdviserHandler.errorType.img) {
      enrollAdviserHandler.errorType.img = false;
      $('#enroll-1-error').html("");
    }
    $("#enroll-bar").css('width', 0);
  });
  uploader.on("error", function (type) {
    if (type == "Q_TYPE_DENIED") {
      J_app.alert('允许的图片格式为：' + enrollAdviserHandler.imgExt);
    } else if (type == "F_EXCEED_SIZE") {
      J_app.alert('允许的图片大小为：' + enrollAdviserHandler.imgSize / 1024 / 1024 + "m");
    }
  });
  // 上传成功
  uploader.on('uploadSuccess', function (file, response) {
    if (response.code === 0) {
      var $img = $("#enroll-upload-preview");
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
  uploader.on("uploadProgress", function (file, percentage) {
    $("#enroll-bar").css('width', percentage * 100 + '%');
  });
  // 完成上传
  uploader.on('uploadComplete', function (file) {
    uploader.removeFile(file);
  });
}

$(function () {
  // 屏蔽微信分享
  J_app.shareByWeixin(true);

  J_app.checkSign(function () {
    enrollAdviserHandler.adviserInit();
    // 根据手机调用不同的上传图片的函数
    var ua = navigator.userAgent.toLowerCase(),
      isAndroid = -1 != ua.indexOf('android'), // 安卓版
      isIos = -1 != ua.indexOf('iphone') || -1 != ua.indexOf('ipad'); // IOS版
    if (isAndroid) {
      $("#enroll-upload-ios").hide();
      $("#enroll-upload-android").show();
      enrollAdviserHandler.uploadAndroid();
    } else {
      $("#enroll-upload-android").hide();
      $("#enroll-upload-ios").show();
      enrollAdviserHandler.uploadIOS();
    }
  });
});