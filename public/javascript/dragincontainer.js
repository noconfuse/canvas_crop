function xhrOnProgress(fun) {
    xhrOnProgress.onprogress = fun; //绑定监听
    //使用闭包实现监听绑
    return function () {
        //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
        var xhr = $.ajaxSettings.xhr();
        //判断监听函数是否为函数
        if (typeof xhrOnProgress.onprogress !== 'function')
            return xhr;
        //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
        if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
        }
        return xhr;
    }
}
(function(root,$){
    $('.resize-crop').on('mouseenter',function(e){
        this.style.cursor = "move";
    })
    var crop_left = getStyle($('.resize-crop')[0],'left'),//裁剪起始点
        crop_top = getStyle($('.resize-crop')[0],'top');
    $('.resize-crop').on('mousedown',function(e){
        var startPoint_x = e.clientX;
        var startPoint_y = e.clientY;
        var numL = parseInt(window.getComputedStyle(this,null)['left']);
        var numT = parseInt(window.getComputedStyle(this,null)['top']);
        $('.resize-crop').on('mousemove',function(e){
            this.style.left = numL + e.clientX - startPoint_x+"px";
            this.style.top = numT + e.clientY - startPoint_y+"px";
            var num1   = parseInt(this.style.left);
            if(num1 >= 0){
                this.style.left = 0
            }else if(num1 <=  this.parentNode.offsetWidth - this.offsetWidth){
                this.style.left = this.parentNode.offsetWidth - this.offsetWidth+'px'
            }
            var num2 = parseInt(this.style.top);
            if(num2 >= 0){
                this.style.top = 0
            }else if(num2 <=  this.parentNode.offsetHeight - this.offsetHeight){
                this.style.top = this.parentNode.offsetHeight - this.offsetHeight+'px'
            }
        })
        $('.resize-crop').on('mouseup mouseleave',function(){
            crop_left = getStyle(this,'left');
            crop_top = getStyle(this,'top');
            $('.resize-crop').off('mousemove')
        })
    })
    var canvas1 = document.createElement('canvas');
    var cxt1 = canvas1.getContext('2d');
    var img = new Image();
    img.src = $('.resize-crop').attr('src');
    img.onload = function(){
        canvas1.width = $('.resize-crop').width();
        canvas1.height = $('.resize-crop').height();
        cxt1.drawImage(img,0,0);
    }
    function crop(){
        //获取容器的宽高
        width = $('.overlay').width();
        height = $('.overlay').height();
        var dataImg = cxt1.getImageData(-crop_left,-crop_top,width,height)//得到裁剪的图片
        var canvas2 = document.createElement('canvas');
        canvas2.width = width;
        canvas2.height = height;
        var cxt2 = canvas2.getContext('2d');
        cxt2.putImageData(dataImg,0,0,0,0,width,height);
        var created_img = canvas2.toDataURL("image/png");
        $('.created_img').attr('src',created_img)
    }
    function getStyle(dom,attr){
        if(document.currentStyle){
            return parseInt(dom.currentStyle.attr)
        }else if(window.getComputedStyle){
            return parseInt(window.getComputedStyle(dom,null)[attr])
        }
    }
    $('.crop').on('click',crop)

    $('.upload').on('click',function(){
        var imgData = $('.created_img').attr('src');
        var formData = new FormData();
        formData.append('file',imgData);
        $.ajax({
            url:'/uploadAvatar',
            data: formData,
            type: 'POST',
            processData: false,
            contentType: false,
            xhr:xhrOnProgress(function(e){
                console.log(e)
            }),
            success: function(data){
                // console.log(data)
            },
            error: function(err){
                // console.log(err)
            }
        })
    })

    var regist = function(){
        var data = {};
        var username = $('#username').val(),
            pwd = $('#password').val();
        if(username){
            data.username = username;
        }else {
            return false;
        }
        if(pwd){
            data.password = pwd;
        }else {
            return false
        }
        if(Object.keys(data).length>0){
            $.ajax({
                url:'regist',
                data: data,
                type:'POST',
                dataType:'json',
            }).done(function(data){
                console.log(data)
            }).fail(function(){
                $('#regist').one('click',regist);
            })
        }
    }
    $('#regist').one('click',regist);

})(this,jQuery);