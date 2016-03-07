/**
 * 报名参赛
 * Created by ayou on 2016-03-03.
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
  var re = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
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
function validForm(){
  // 真实姓名
  var realName = $("#enroll-1-name").val();
  if(!validName(realName)) {
    $('#enroll-1-error').html("请输入真实姓名");
    enrollHandler.errorType.realName = true;
    return false;
  }
  // 身份证号
  var idNumber = $("#enroll-1-idNum").val();
  if(!validIdNum(idNumber)) {
    $('#enroll-1-error').html("请输入正确身份证号");
    enrollHandler.errorType.idNum = true;
    return false;
  }
  // 执业编码
  var licenceCode = $("#enroll-1-proCode").val();
  if(!validProCode(licenceCode)) {
    $('#enroll-1-error').html("请输入执业编码");
    enrollHandler.errorType.proCode = true;
    return false;
  }
  // 所属机构
  var oId = $("#enroll-1-org-id").val();
  if(!oId){
    $('#enroll-1-error').html("请选择机构");
    enrollHandler.errorType.oId = true;
    return false;
  }
  // 所属营业部
  var dept = $("#enroll-1-office").val();
  if(!dept){
    $('#enroll-1-error').html("请输入所属营业部");
    enrollHandler.errorType.office = true;
    return false;
  }
  // 所在城市
  var cityId = $("#enroll-1-city-id").val();
  if(!cityId){
    $('#enroll-1-error').html("请选择城市");
    enrollHandler.errorType.cityId = true;
    return false;
  }
  // 头像
  var certImgs = $("#enroll-1-img").val();
  if(!certImgs) {
    $('#enroll-1-error').html("请上传头像");
    enrollHandler.errorType.img = true;
    return false;
  }
  // cId
  var cId = $.cookie("fachinaId");
  if(!cId){
    $('#enroll-1-error').html("请登录");
    return false;
  }
  // 返回数据
  var param = {};
  param['cId'] = cId;
  param['realName'] = realName;
  param['idNumber'] = idNumber;
  param['licenceCode'] = licenceCode;
  param['oId'] = oId;
  param['cityId'] = cityId;
  param['dept'] = dept;
  param['certImgs'] = [certImgs];
  return param;
}

var enrollHandler = window.enrollHandler || {};

// 报名参赛跳转
enrollHandler.api = "index.html";
// 城市名称
enrollHandler.cityName = "";
// 错误类型
enrollHandler.errorType = {
  realName: false,
  idNum: false,
  oId: false,
  proCode: false,
  office: false,
  cityId: false,
  img: false
}

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
};

// 投顾
enrollHandler.adviserInit = function () {
  enrollHandler.uploadImg();
  enrollHandler.chooseOrg();
  enrollHandler.chooseCity();
  enrollHandler.back();
  enrollHandler.apply();
  enrollHandler.clearErrorMsg();
};

// 清除验证提示信息
enrollHandler.clearErrorMsg = function() {
  // 真实姓名
  $("#enroll-1-name").focus(function() {
    if(enrollHandler.errorType.realName) {
      enrollHandler.errorType.realName = false;
      $('#enroll-1-error').html("");
    }
  });
  // 身份证号
  $("#enroll-1-idNum").focus(function() {
    if(enrollHandler.errorType.idNum) {
      enrollHandler.errorType.idNum = false;
      $('#enroll-1-error').html("");
    }
  });
  // 执业编号
  $("#enroll-1-proCode").focus(function() {
    if(enrollHandler.errorType.proCode) {
      enrollHandler.errorType.proCode = false;
      $('#enroll-1-error').html("");
    }
  });
  // 所属营业部
  $("#enroll-1-office").focus(function() {
    if(enrollHandler.errorType.office) {
      enrollHandler.errorType.office = false;
      $('#enroll-1-error').html("");
    }
  })
};

// 提交申请
enrollHandler.apply = function() {
  $("#enroll-apply").click(function() {
    var param = validForm();
    if(param){
      console.log(param);
      J_app.ajax(J_app.api.verify, param, function(data) {
        console.log(data);
        if(data.code === 0) {

        } else {

        }
      }, function(){
        J_app.alert("认证失败");
      });
    }
  });

}

// 绑定头部back事件
enrollHandler.back = function() {
  // 省市列表
  $("#enroll-pro-back").click(function() {
    // 显示信息列表
    $("#info").show();
    // 隐藏省市、城市列表
    $("#pro").hide();
    $("#city").hide();
  });
  // 城市列表
  $("#enroll-city-back").click(function() {
    // 显示省市列表
    $("#pro").show();
    // 隐藏信息、城市列表
    $("#info").hide();
    $("#city").hide();
  });
  // 机构列表
  $("#enroll-org-back").click(function() {
    // 显示信息列表
    $("#info").show();
    // 隐藏省市、城市列表
    $("#org").hide();
  });
};

// 选择机构
enrollHandler.chooseOrg = function() {
  $("#enroll-org-btn").click(function() {
    // 去掉验证信息
    if(enrollHandler.errorType.oId) {
      enrollHandler.errorType.oId = false;
      $('#enroll-1-error').html("");
    }
    // 获取机构数据
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    J_app.ajax(J_app.api.organization, param, function (data) {
      console.log(data);
      if (data.code === 0) {
        // 显示机构列表，隐藏信息列表
        var $ul = $("#org ul");
        var _html = enrollHandler.orgList(data.result.datas);
        $ul.html(_html);
        $("#org").show();
        $("#info").hide();
        // 绑定点击机构的事件
        enrollHandler.clickOrg();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      J_app.alert('请求失败！');
    });
  });
};

// 选择城市
enrollHandler.chooseCity = function () {
  $("#enroll-city-btn").click(function () {
    // 去掉验证信息
    if(enrollHandler.errorType.cityId) {
      enrollHandler.errorType.cityId = false;
      $('#enroll-1-error').html("");
    }
    // 获取省份数据
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    J_app.ajax(J_app.api.province, param, function (data) {
      console.log(data);
      if (data.code === 0) {
        // 显示省份列表，隐藏信息列表
        var $ul = $("#pro ul");
        var _html = enrollHandler.proList(data.result.datas,"provId");
        $ul.html(_html);
        $("#pro").show();
        $("#info").hide();
        // 绑定点击省市的事件
        enrollHandler.clickPro();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      J_app.alert('请求失败！');
    });
  });
};

// 生成省市或城市列表
enrollHandler.proList = function (list,id) {
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

// 生成机构列表
enrollHandler.orgList = function (list) {
  if (list.length <= 0) {
    return null;
  }
  var _html = '';
  for (index in list) {
    _html += '<li class="enroll-address-row" data-id="' + list[index]['oId'] + '">';
    _html += list[index]['oName'];
    _html += '</li>';
  }
  return _html;
};

// 绑定点击机构事件
enrollHandler.clickOrg = function() {
  var orgs = $("#org .enroll-address-row");

  orgs.click(function() {
    // 得到机构id和名字
    var oId = $(this).data("id");
    var oName = $(this).html();
    // 将机构id和名字赋值给input
    $("#enroll-1-org-id").val(oId);
    $("#enroll-1-org").val(oName);
    // 显示信息列表，隐藏机构列表
    $("#enroll-1-org").show();
    $("#info").show();
    $("#org").hide();
  })
};

// 绑定点击省市事件
enrollHandler.clickPro = function() {
  var pros = $("#pro .enroll-address-row");

  pros.click(function () {
    var $li = $(this);
    // 得到省市id
    var proId = $li.data("id");
    // 获取城市列表
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    param['provId'] = proId;
    console.log(param);
    J_app.ajax(J_app.api.city, param, function (data) {
      console.log(data);
      if (data.code === 0) {
        // 显示城市列表，隐藏省市列表、信息列表
        var $ul = $("#city ul");
        var _html = enrollHandler.proList(data.result.datas,"cityId");
        $ul.html(_html);
        $("#city").show();
        $("#pro").hide();
        $("#info").hide();
        // 将省市名赋值给城市名称
        enrollHandler.cityName = $li.html();
        // 绑定城市点击事件
        enrollHandler.clickCity();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      J_app.alert('请求失败！');
    });
  });
};

// 绑定点击城市事件
enrollHandler.clickCity = function() {
  var citys = $("#city .enroll-address-row");
  citys.click(function() {
    // 得到城市id和名字
    var cityId = $(this).data("id");
    var cityName = $(this).html();
    enrollHandler.cityName += ' ' + cityName;
    // 将城市id和名字赋值给input
    $("#enroll-1-city-id").val(cityId);
    $("#enroll-1-city").val(enrollHandler.cityName);
    // 显示信息列表，隐藏省市和城市列表
    $("#enroll-1-city").show();
    $("#info").show();
    $("#pro").hide();
    $("#city").hide();
  });
};

// 上传图片
enrollHandler.uploadImg = function () {
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
    fileSingleSizeLimit: 10 * 1024 * 1024, // 单个文件大小限制:2 M
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
  //
  //});

  uploader.on("error", function (type) {
    J_app.alert(type);
    if (type == "Q_TYPE_DENIED") {
      J_app.alert("请上传JPG、PNG格式文件");
    } else if (type == "F_EXCEED_SIZE") {
      J_app.alert("文件大小不能超过8M");
    }
  });
  // 上传成功
  uploader.on('uploadSuccess', function (file, response) {
    console.log(file);
    console.log(response);
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
      // 去掉验证信息
      if(enrollHandler.errorType.img) {
        enrollHandler.errorType.img = false;
        $('#enroll-1-error').html("");
      }
    } else {
      J_app.alert("上传失败");
    }

  });

  // 上传失败
  uploader.on('uploadError', function (file) {
    J_app.alert("上传失败");
  });
};

$(function () {
  enrollHandler.rookieInit();
  enrollHandler.adviserInit();

});