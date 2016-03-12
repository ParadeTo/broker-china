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
    enrollAdviserHandler.errorType.realName = true;
    return false;
  }
  // 身份证号
  var idNumber = $("#enroll-1-idNum").val();
  if(!validIdNum(idNumber)) {
    $('#enroll-1-error').html("请输入正确身份证号");
    enrollAdviserHandler.errorType.idNum = true;
    return false;
  }
  // 执业编码
  var licenceCode = $("#enroll-1-proCode").val();
  if(!validProCode(licenceCode)) {
    $('#enroll-1-error').html("请输入执业编码");
    enrollAdviserHandler.errorType.proCode = true;
    return false;
  }
  // 所属机构
  var oId = $("#enroll-1-org-id").val();
  if(!oId){
    $('#enroll-1-error').html("请选择机构");
    enrollAdviserHandler.errorType.oId = true;
    return false;
  }
  // 所属营业部
  var dept = $("#enroll-1-office").val();
  if(!dept){
    $('#enroll-1-error').html("请输入所属营业部");
    enrollAdviserHandler.errorType.office = true;
    return false;
  }
  // 所在城市
  var cityId = $("#enroll-1-city-id").val();
  if(!cityId){
    $('#enroll-1-error').html("请选择城市");
    enrollAdviserHandler.errorType.cityId = true;
    return false;
  }
  // 头像
  var certImgs = $("#enroll-1-img").val();
  if(!certImgs) {
    $('#enroll-1-error').html("请上传头像");
    enrollAdviserHandler.errorType.img = true;
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

var enrollAdviserHandler = window.enrollAdviserHandler || {};

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
  //enrollAdviserHandler.uploadDebug();
  enrollAdviserHandler.upload();
};

// 清除验证提示信息
enrollAdviserHandler.clearErrorMsg = function() {
  // 真实姓名
  $("#enroll-1-name").focus(function() {
    if(enrollAdviserHandler.errorType.realName) {
      enrollAdviserHandler.errorType.realName = false;
      $('#enroll-1-error').html("");
    }
  });
  // 身份证号
  $("#enroll-1-idNum").focus(function() {
    if(enrollAdviserHandler.errorType.idNum) {
      enrollAdviserHandler.errorType.idNum = false;
      $('#enroll-1-error').html("");
    }
  });
  // 执业编号
  $("#enroll-1-proCode").focus(function() {
    if(enrollAdviserHandler.errorType.proCode) {
      enrollAdviserHandler.errorType.proCode = false;
      $('#enroll-1-error').html("");
    }
  });
  // 所属营业部
  $("#enroll-1-office").focus(function() {
    if(enrollAdviserHandler.errorType.office) {
      enrollAdviserHandler.errorType.office = false;
      $('#enroll-1-error').html("");
    }
  })
};

// 提交申请
enrollAdviserHandler.apply = function() {
  $("#enroll-apply").click(function() {
    var $this = $(this);
    var param = validForm();
    if(!param) {
      return ;
    }
    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);

    J_app.ajax(J_app.api.verify, param, function(data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if(data.code === 0) {
        J_app.alert("已提交审核");
        setTimeout(function(){
          window.location.href = enrollAdviserHandler.api;
        }, 1000);
      } else {
        J_app.alert(data.message);
      }
    }, function(){
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert("请求失败");
    });
  });

}

// 绑定头部back事件
enrollAdviserHandler.back = function() {
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
enrollAdviserHandler.chooseOrg = function() {
  $("#enroll-org-btn").click(function() {
    var $this = $(this);
    // 去掉验证信息
    if(enrollAdviserHandler.errorType.oId) {
      enrollAdviserHandler.errorType.oId = false;
      $('#enroll-1-error').html("");
    }
    // 获取机构数据
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);
    J_app.ajax(J_app.api.organization, param, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // 显示机构列表，隐藏信息列表
        var $ul = $("#org ul");
        var _html = enrollAdviserHandler.orgList(data.result.datas);
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
      J_app.alert('请求失败！');
    });
  });
};

// 选择城市
enrollAdviserHandler.chooseCity = function () {
  $("#enroll-city-btn").click(function () {
    var $this = $(this);
    // 去掉验证信息
    if(enrollAdviserHandler.errorType.cityId) {
      enrollAdviserHandler.errorType.cityId = false;
      $('#enroll-1-error').html("");
    }
    // 获取省份数据
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    // 防重发
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // 加载动画
    J_app.loading(true);
    J_app.ajax(J_app.api.province, param, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // 显示省份列表，隐藏信息列表
        var $ul = $("#pro ul");
        var _html = enrollAdviserHandler.proList(data.result.datas,"provId");
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
      J_app.alert('请求失败');
    });
  });
};

// 生成省市或城市列表
enrollAdviserHandler.proList = function (list,id) {
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
    _html += '<li class="enroll-address-row" data-id="' + list[index]['oId'] + '">';
    _html += list[index]['oName'];
    _html += '</li>';
  }
  return _html;
};

// 绑定点击机构事件
enrollAdviserHandler.clickOrg = function() {
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
enrollAdviserHandler.clickPro = function() {
  var pros = $("#pro .enroll-address-row");

  pros.click(function () {
    var $this = $(this);
    var $li = $(this);
    // 得到省市id
    var proId = $li.data("id");
    // 获取城市列表
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    param['provId'] = proId;
    // 防重发
    if($this.hasClass('locked')){
      return ;
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
        var _html = enrollAdviserHandler.proList(data.result.datas,"cityId");
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
      J_app.alert('请求失败');
    });
  });
};

// 绑定点击城市事件
enrollAdviserHandler.clickCity = function() {
  var citys = $("#city .enroll-address-row");
  citys.click(function() {
    // 得到城市id和名字
    var cityId = $(this).data("id");
    var cityName = $(this).html();
    enrollAdviserHandler.cityName += ' ' + cityName;
    // 将城市id和名字赋值给input
    $("#enroll-1-city-id").val(cityId);
    $("#enroll-1-city").val(enrollAdviserHandler.cityName);
    // 显示信息列表，隐藏省市和城市列表
    $("#enroll-1-city").show();
    $("#info").show();
    $("#pro").hide();
    $("#city").hide();
  });
};

// 上传图片-调试版
enrollAdviserHandler.uploadDebug = function() {
  var options = {
    dataType: 'json',
    success: function (data) {
              alert(data.code);
              $("#enroll-upload-img").attr("src",data.result.urls);
              $("#enroll-1-img").val(data.result.urls);
    }
  };

  // ajaxForm
  //$("#roll-upload-form").ajaxForm(options);

  // ajaxSubmit
  $("#submitDebug").click(function () {
    alert(1);
    $("#enroll-upload-form").submit(function() {
      $(this).ajaxSubmit({
        type: 'post',
        url: "http://192.168.1.19/common_api/upload_image",
        dataType: 'json',
        success: function(data) {
          alert(data.code);
          $("#enroll-upload-img").attr("src", data.result.urls);
          $("#enroll-1-img").val(data.result.urls);
        },
        error: function(XmlHttpRequest, textStatus, errorThrown) {
          alert(textStatus);
        }
      });
    });
  });

  //$("#enroll-upload-btn").change(function() {
  //  $("#enroll-upload-form").attr("action",J_app.api.image).ajaxSubmit({
  //      dataType: 'json',
  //      success: function(data) {
  //        alert(data.code);
  //        $("#enroll-upload-img").attr("src",data.result.urls);
  //        $("#enroll-1-img").val(data.result.urls);
  //    }
  //  });
  //});
};

// 上传图片
enrollAdviserHandler.upload = function() {
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
    if(enrollAdviserHandler.errorType.img) {
      enrollAdviserHandler.errorType.img = false;
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
}

$(function () {
  J_app.checkSign(function() {
    enrollAdviserHandler.adviserInit();
  });
});