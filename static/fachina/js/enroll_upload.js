/**
 * �����������ϴ�ͼƬ
 * Created by ayou on 2016-03-09.
 */

$(function() {
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
    if(enrollHandler.errorType.img) {
      enrollHandler.errorType.img = false;
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
});