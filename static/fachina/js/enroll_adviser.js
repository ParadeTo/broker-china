/**
 * ��������-Ͷ��
 * Created by ayou on 2016-03-10.
 */

// ��֤����
function validName(name) {
  var re = /^[\u4e00-\u9fa5]{1,5}$/;
  if (re.test(name)) {
    return true;
  } else {
    return false;
  }
}
// ��֤���֤��
function validIdNum(idNum) {
  var re = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/;
  if (re.test(idNum)) {
    return true;
  } else {
    return false;
  }
}
// ��ִ֤ҵ���
function validProCode(proCode) {
  var re = /^\w+$/;
  if (re.test(proCode)) {
    return true;
  } else {
    return false;
  }
}
// ��֤��
function validForm(){
  // ��ʵ����
  var realName = $("#enroll-1-name").val();
  if(!validName(realName)) {
    $('#enroll-1-error').html("��������ʵ����");
    enrollAdviserHandler.errorType.realName = true;
    return false;
  }
  // ���֤��
  var idNumber = $("#enroll-1-idNum").val();
  if(!validIdNum(idNumber)) {
    $('#enroll-1-error').html("��������ȷ���֤��");
    enrollAdviserHandler.errorType.idNum = true;
    return false;
  }
  // ִҵ����
  var licenceCode = $("#enroll-1-proCode").val();
  if(!validProCode(licenceCode)) {
    $('#enroll-1-error').html("������ִҵ����");
    enrollAdviserHandler.errorType.proCode = true;
    return false;
  }
  // ��������
  var oId = $("#enroll-1-org-id").val();
  if(!oId){
    $('#enroll-1-error').html("��ѡ�����");
    enrollAdviserHandler.errorType.oId = true;
    return false;
  }
  // ����Ӫҵ��
  var dept = $("#enroll-1-office").val();
  if(!dept){
    $('#enroll-1-error').html("����������Ӫҵ��");
    enrollAdviserHandler.errorType.office = true;
    return false;
  }
  // ���ڳ���
  var cityId = $("#enroll-1-city-id").val();
  if(!cityId){
    $('#enroll-1-error').html("��ѡ�����");
    enrollAdviserHandler.errorType.cityId = true;
    return false;
  }
  // ͷ��
  var certImgs = $("#enroll-1-img").val();
  if(!certImgs) {
    $('#enroll-1-error').html("���ϴ�ͷ��");
    enrollAdviserHandler.errorType.img = true;
    return false;
  }
  // cId
  var cId = $.cookie("fachinaId");
  if(!cId){
    $('#enroll-1-error').html("���¼");
    return false;
  }
  // ��������
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

// ����������ת
enrollAdviserHandler.api = "index.html";
// ��������
enrollAdviserHandler.cityName = "";
// ��������
enrollAdviserHandler.errorType = {
  realName: false,
  idNum: false,
  oId: false,
  proCode: false,
  office: false,
  cityId: false,
  img: false
}

// Ͷ��
enrollAdviserHandler.adviserInit = function () {
  enrollAdviserHandler.chooseOrg();
  enrollAdviserHandler.chooseCity();
  enrollAdviserHandler.back();
  enrollAdviserHandler.apply();
  enrollAdviserHandler.clearErrorMsg();
  enrollAdviserHandler.upload();
};

// �����֤��ʾ��Ϣ
enrollAdviserHandler.clearErrorMsg = function() {
  // ��ʵ����
  $("#enroll-1-name").focus(function() {
    if(enrollAdviserHandler.errorType.realName) {
      enrollAdviserHandler.errorType.realName = false;
      $('#enroll-1-error').html("");
    }
  });
  // ���֤��
  $("#enroll-1-idNum").focus(function() {
    if(enrollAdviserHandler.errorType.idNum) {
      enrollAdviserHandler.errorType.idNum = false;
      $('#enroll-1-error').html("");
    }
  });
  // ִҵ���
  $("#enroll-1-proCode").focus(function() {
    if(enrollAdviserHandler.errorType.proCode) {
      enrollAdviserHandler.errorType.proCode = false;
      $('#enroll-1-error').html("");
    }
  });
  // ����Ӫҵ��
  $("#enroll-1-office").focus(function() {
    if(enrollAdviserHandler.errorType.office) {
      enrollAdviserHandler.errorType.office = false;
      $('#enroll-1-error').html("");
    }
  })
};

// �ύ����
enrollAdviserHandler.apply = function() {
  $("#enroll-apply").click(function() {
    var $this = $(this);
    var param = validForm();
    if(!param) {
      return ;
    }
    // ���ط�
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // ���ض���
    J_app.loading(true);

    J_app.ajax(J_app.api.verify, param, function(data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if(data.code === 0) {
        J_app.alert("���ύ���");
        setTimeout(function(){
          window.location.href = enrollAdviserHandler.api;
        }, 1000);
      } else {
        J_app.alert(data.message);
      }
    }, function(){
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert("��֤ʧ��");
    });
  });

}

// ��ͷ��back�¼�
enrollAdviserHandler.back = function() {
  // ʡ���б�
  $("#enroll-pro-back").click(function() {
    // ��ʾ��Ϣ�б�
    $("#info").show();
    // ����ʡ�С������б�
    $("#pro").hide();
    $("#city").hide();
  });
  // �����б�
  $("#enroll-city-back").click(function() {
    // ��ʾʡ���б�
    $("#pro").show();
    // ������Ϣ�������б�
    $("#info").hide();
    $("#city").hide();
  });
  // �����б�
  $("#enroll-org-back").click(function() {
    // ��ʾ��Ϣ�б�
    $("#info").show();
    // ����ʡ�С������б�
    $("#org").hide();
  });
};

// ѡ�����
enrollAdviserHandler.chooseOrg = function() {
  $("#enroll-org-btn").click(function() {
    var $this = $(this);
    // ȥ����֤��Ϣ
    if(enrollAdviserHandler.errorType.oId) {
      enrollAdviserHandler.errorType.oId = false;
      $('#enroll-1-error').html("");
    }
    // ��ȡ��������
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    // ���ط�
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // ���ض���
    J_app.loading(true);

    J_app.ajax(J_app.api.organization, param, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // ��ʾ�����б�������Ϣ�б�
        var $ul = $("#org ul");
        var _html = enrollAdviserHandler.orgList(data.result.datas);
        $ul.html(_html);
        $("#org").show();
        $("#info").hide();
        // �󶨵���������¼�
        enrollAdviserHandler.clickOrg();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('����ʧ�ܣ�');
    });
  });
};

// ѡ�����
enrollAdviserHandler.chooseCity = function () {
  $("#enroll-city-btn").click(function () {
    var $this = $(this);
    // ȥ����֤��Ϣ
    if(enrollAdviserHandler.errorType.cityId) {
      enrollAdviserHandler.errorType.cityId = false;
      $('#enroll-1-error').html("");
    }
    // ��ȡʡ������
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    // ���ط�
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // ���ض���
    J_app.loading(true);
    J_app.ajax(J_app.api.province, param, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // ��ʾʡ���б�������Ϣ�б�
        var $ul = $("#pro ul");
        var _html = enrollAdviserHandler.proList(data.result.datas,"provId");
        $ul.html(_html);
        $("#pro").show();
        $("#info").hide();
        // �󶨵��ʡ�е��¼�
        enrollAdviserHandler.clickPro();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('����ʧ�ܣ�');
    });
  });
};

// ����ʡ�л�����б�
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

// ���ɻ����б�
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

// �󶨵�������¼�
enrollAdviserHandler.clickOrg = function() {
  var orgs = $("#org .enroll-address-row");

  orgs.click(function() {
    // �õ�����id������
    var oId = $(this).data("id");
    var oName = $(this).html();
    // ������id�����ָ�ֵ��input
    $("#enroll-1-org-id").val(oId);
    $("#enroll-1-org").val(oName);
    // ��ʾ��Ϣ�б����ػ����б�
    $("#enroll-1-org").show();
    $("#info").show();
    $("#org").hide();
  })
};

// �󶨵��ʡ���¼�
enrollAdviserHandler.clickPro = function() {
  var pros = $("#pro .enroll-address-row");

  pros.click(function () {
    var $this = $(this);
    var $li = $(this);
    // �õ�ʡ��id
    var proId = $li.data("id");
    // ��ȡ�����б�
    var param = {};
    param['cId'] = $.cookie("fachinaId");
    param['provId'] = proId;
    // ���ط�
    if($this.hasClass('locked')){
      return ;
    }
    $this.addClass('locked');
    // ���ض���
    J_app.loading(true);
    J_app.ajax(J_app.api.city, param, function (data) {
      $this.removeClass('locked');
      J_app.loading(false);
      if (data.code === 0) {
        // ��ʾ�����б�����ʡ���б���Ϣ�б�
        var $ul = $("#city ul");
        var _html = enrollAdviserHandler.proList(data.result.datas,"cityId");
        $ul.html(_html);
        $("#city").show();
        $("#pro").hide();
        $("#info").hide();
        // ��ʡ������ֵ����������
        enrollAdviserHandler.cityName = $li.html();
        // �󶨳��е���¼�
        enrollAdviserHandler.clickCity();
      } else {
        J_app.alert(data.message);
      }
    }, function () {
      $this.removeClass('locked');
      J_app.loading(false);
      J_app.alert('����ʧ�ܣ�');
    });
  });
};

// �󶨵�������¼�
enrollAdviserHandler.clickCity = function() {
  var citys = $("#city .enroll-address-row");
  citys.click(function() {
    // �õ�����id������
    var cityId = $(this).data("id");
    var cityName = $(this).html();
    enrollAdviserHandler.cityName += ' ' + cityName;
    // ������id�����ָ�ֵ��input
    $("#enroll-1-city-id").val(cityId);
    $("#enroll-1-city").val(enrollAdviserHandler.cityName);
    // ��ʾ��Ϣ�б�����ʡ�кͳ����б�
    $("#enroll-1-city").show();
    $("#info").show();
    $("#pro").hide();
    $("#city").hide();
  });
};

// �ϴ�ͼƬ
enrollAdviserHandler.upload = function() {
  // ���ͼƬ������ֵ
  $("#enroll-1-img").val("");

  // �����ϴ�����
  var uploader = WebUploader.create({
    auto: true, // �Զ��ϴ�
    swf: '../../static/common/js/libs/webuploader/Uploader.swf', // swf�ļ�·��(��falsh��ʽ֧��IE�ϴ�)
    server: J_app.api.image, // �ļ����շ����
    pick: '#enroll-upload-btn',
    // ֻ����ѡ���ļ�����ѡ��
    accept: {
      title: 'Images',
      extensions: 'gif,jpg,jpeg,bmp,png',
      mimeTypes: 'image/*'
    },
    //sendAsBinary: true,
    fileNumLimit: 1, //�ļ��������
    fileSingleSizeLimit: 5 * 1024 * 1024, // �����ļ���С����:2 M
    thumb: {
      width: 120,
      height: 120,
      quality: 50, // ͼƬ������ֻ��typeΪ`image/jpeg`��ʱ�����Ч
      allowMagnify: false, // �Ƿ�����Ŵ������Ҫ����Сͼ��ʱ��ʧ�棬��ѡ��Ӧ������Ϊfalse
      crop: true, // �Ƿ�����ü�
      type: 'image/jpeg' // Ϊ�յĻ�����ԭ��ͼƬ��ʽ������ǿ��ת����ָ��������
    },
    duplicate: true //Ĭ��Ϊundefined���Ƿ������ظ��ļ���trueΪͬһ�ļ������ظ��ϴ���falseͬһ���ļ�ֻ�����ϴ�һ�Σ�
  });

  // ��ʼ�ϴ�ʱ���ѽ�������Ϊ0
  uploader.on('uploadBeforeSend', function() {
    // ȥ����֤��Ϣ
    if(enrollAdviserHandler.errorType.img) {
      enrollAdviserHandler.errorType.img = false;
      $('#enroll-1-error').html("");
    }
    $("#enroll-bar").css('width',0);
  });

  uploader.on("error", function (type) {
    if (type == "Q_TYPE_DENIED") {
      J_app.alert("���ϴ�JPG��PNG��ʽ�ļ�");
    } else if (type == "F_EXCEED_SIZE") {
      J_app.alert("�ļ���С���ܳ���5M");
    }
  });
  // �ϴ��ɹ�
  uploader.on('uploadSuccess', function (file, response) {
    if (response.code === 0) {
      var $img = $("#enroll-upload-img");
      var height = $img.height();
      var width = $img.width();
      // ��������ͼ
      uploader.makeThumb(file, function (error, src) {
        if (error) {
          $img.replaceWith('<span>����Ԥ��</span>');
          return;
        }
        $img.attr('src', src);
      }, width, height);

      $("#enroll-1-img").val(response.result.urls);
    } else {
      J_app.alert("�ϴ�ʧ��");
    }

  });
  // �ϴ�ʧ��
  uploader.on('uploadError', function (file) {
    J_app.alert("�ϴ�ʧ��");
  });
  // ������
  uploader.on("uploadProgress", function(file,percentage) {
    $("#enroll-bar").css('width', percentage * 100 + '%');
  });
  // ����ϴ�
  uploader.on( 'uploadComplete', function(file) {
    uploader.removeFile(file);
  });
}

$(function () {
  J_app.checkSign(function() {
    enrollAdviserHandler.adviserInit();
  });
});