  /**
   *    root  : $('.choose-main')
   *    dept  : $('.choose-dept')
   *    people  : $('.choose-people')
   *    box   : $('.choose-choosedBox')
   *    num   : $('.choose-head .num span')
   *    send  : $('.choose-send'),
   *    cancel  : $('.choose-cancel'),
  */

  function People(cfg){
    this.deptIdArr   = [];
    this.peopleIdArr = [];
    this.peopleWholeInfo = [];
    this.phones = [];
    this.cfg = cfg;
    this.init();
  }
  People.prototype = {
    init:function(){
      this.bind();
      // this.getOrgList();
      this.getDept(0, 0, 1);
      // this.clearChooseBox();
      // this.setUserToBox();
    },
    getOrgList:function(){
      var me = this;
      $.get(contextPath+'/getorglist',function(data){
        if(data.status == 200)
          me.renderOrg(data.result);
      }, 'json');
      me.getDept();
    },
    getDept:function(orgid, id, level){
      var me = this;
      $.post(G.url.getDept, {pid : id}, function(data){
        if(data.status == 200 && data.result !== null){
          me.renderDept(data.result, id, level, orgid);
          //隐藏部门加载loading
          me.cfg.dept.find('li[data-id="'+id+'"]').children('.deptLoading').addClass('hide');
        }
      }, "json");
    },
    getUser:function(item){
      var me = this,
        id = $(item).attr("data-id"),
        org = $(item).attr('data-orgid');
      if(typeof(id) != "undefined") {
        me.cfg.dept.find(".select_li").removeClass("select_li");
        $(item).addClass("select_li");
        me.getUserList(id, org);
      }
    },
    getUserList : function(deptId, org){
      org = 0;
      var me = this;
      $.ajax({
        type: "POST",
        url: G.url.getUser,
        data : { orgId : org, deptId: deptId },
        dataType: "json",
        success: function(data){
          if(data.status == 200){
            me.renderUser(data.result);
          }
        }
      });
    },
    renderOrg:function(data){
      var me = this;
      var panel = "";
      $.each(data, function(i, e){
        panel += "<ul class='media-dept'>"
              +  "<li class='dept-li' data-orgid='"+e.id+"' data-id='0' data-level='0'><img class='deptLoading hide' src='"+contextPath+"/styles/images/dept.gif' width='15px' height='15px' alt='' />"
              +  "<i class='iconfont glyplay'>&#xe607;</i><i class='iconfont icon-company' >&#xe60a;</i><span class='name'>" + (e.name.length>10?(e.name.substr(0,10)+'...'):e.name) +"</span></li></ul>";
      });
      me.cfg.dept.html(panel);
      //默认展开第一个公司
      var obj = me.cfg.dept.find('ul.media-dept:eq(0)').find('li');
      obj.find(".glyplay").addClass('glyplay90');
      var orgid = obj.attr('data-orgid');
      me.getDept(orgid, 0, 1);
    },
    renderDept:function(data, id, level, orgid){
      var item   = ''
        , me     = this
        , margin = level * 12
        , panel  = "";
      if (id == 0) {
        panel += "<ul class='media-dept'>"
              +  "<li class='dept-li' data-orgid='"+ 0 +"' data-id='0' data-level='0'><img class='deptLoading hide' src='"+ROOT+"/styles/images/loading.gif' width='15px' height='15px' alt='' />"
              +  "<i class='icon icon-shouqi glyplay90'></i><span class='name'>" + (data.orgname.length>10?(data.orgname.substr(0,10)+'...'):data.orgname) +"</span>("+data.orgcount+"人)</li>"
              +  "<ul class='media-dept pid-0' data-orgid='0'>";
      } else {
        panel  = "<ul class='media-dept pid-"+id+"' data-orgid='"+orgid+"'>";
      }

      $.each(data.deptList, function(i, n) {
        // n = data[i];
        panel += "<li class='dept-li data-orgid='"+orgid+"' data-lower="+n.lower+" data-level="+ level +" data-pid="+ id +" data-id='"+ n.id;
        if(n.lower){
          panel += "' style='padding-left:"+ margin +"px;'><img class='deptLoading hide' src='"+ROOT+"/styles/images/loading.gif' width='15px' height='15px' alt='' /> <i class='icon icon-shouqi'></i>";
        }else{
          panel += "' style='padding-left:"+ (margin + 10) +"px;'>";
        }
        panel += "<span class='name'>" + (n.name.length>10?(n.name.substr(0,10)+'...'):n.name) +"</span></li>";
      });
      panel +="</ul>";

      if (id == 0) {
        panel +="</ul>";
        me.cfg.dept.html(panel);
      } else {
        me.cfg.dept.find('li[data-id="'+id+'"]').after(panel);
      }
      //获取人员
      // me.getUser(item);
    },
    searchData : function(keyword) {
      var me = this;
      $.ajax({
        type: "POST",
        url: G.url.searchUser ,
        data: {keyword: keyword},
        dataType: "json",
        success: function(data){
          if(data.status == 200){
            me.renderUser(data.result);
          } else {
            alert("搜索失败，状态码："+data.status);
          }
        }
      });
    },
    renderUser:function(data){
      var me = this;
      var html = '<table><thead><tr>'
               + '<td><div class="box chooseAll"></div>'
               + '<td>姓名</td>'
               + '<td>手机号</td></tr></thead><tbody>';
      if(data && data.length > 0) {
        $.each(data, function(i, el) {
          html += '<tr><td data-id="'+data[i].uid
               +  '" data-name="'+data[i].name
               +  '" data-phone="'+data[i].mobile
               +  '"><div class="box rbox"></div><td>'+G.substrs(data[i].name, 3)
               +  '</td><td>'+data[i].mobile+'</td></tr>';
        });
        html += '</tbody></table>';
      } else {
        html = '<p style="text-align:center;margin-top:100px;color: #aaa;">抱歉，暂无人员！</p>';
      }
      me.cfg.people.html(html);

      // 本身的选择盒子中的选人也带回来
      $.each(me.cfg.box.find('.user'), function(i, el) {
        me.cfg.people.find('td[data-id="'+$(this).data('peopleid')+'"]').children('.box').addClass('checked');
      }); 

      // 使用对象，已在页面中的置灰 
      if (setPeoplePanel.hasClass('userBox')) {
        $.each($('.config').find('tr'), function(i, el) {
          $(this).find('td:eq(0)').find('span').each(function(index, el) {
            me.cfg.people.find('td[data-id="'+$(this).data('uid')+'"]').children('.box').addClass('disabled');  
          });
        });
      }
    },
    setUserToBox: function () {
      var me = this;
      var str = "";
      // 界面中已选择的带回来显示  在盒子中即可
      $.each(setPeoplePanel.parent().find('.u'), function(i, el) {
        if( me.cfg.box.find('span[data-peopleid="'+$(this).data('uid')+'"]').length === 0 ){
          str = '<span class="user" data-peopleid="'+$(this).data('uid')+'">'+$(this).data('name')+' <i class="iconfont clear">&times;</i></span>';
          me.cfg.box.append(str);

          me.peopleIdArr.push($(this).data('uid'));
          me.peopleWholeInfo.push($(this).data('uid') + "_" + ($(this).data('mobile') ? $(this).data('mobile') : "null") + "_" + $(this).data('name'));
        }
      }); 
    },
    arrPop:function(arr, id){
      var index = $.inArray(id, arr);
          arr.splice(index, 1);
    },
    arrPopWholeInfo:function(id){
      var me = this;
      //遍历 peopleWholeInfo 已有元素
      for(var i=0; i< me.peopleWholeInfo.length; i++){
        var n = me.peopleWholeInfo[i].split('_')[0];
        if( n == String(id) ){
          //如果相等 则删除数组中的这一项
          me.peopleWholeInfo.splice(i, 1);          
        }
      }
    },
    clearChooseBox:function(){
      // me.cfg.dept.find('.box.checked').removeClass('checked');
      // this.cfg.people.find('.box.checked').removeClass('checked');
      this.cfg.people.find('table').remove();
      this.deptIdArr = [];
      this.peopleIdArr = [];
      this.phones = [];
      this.peopleWholeInfo = [];
      this.cfg.box.find('span').remove();
      //设置右上角的人员数量
      // me.cfg.num.html('0');
      this.getDept(0, 0, 1);
    },
    bind:function(){
      var me = this;

      // 选择人员弹框初始化
      // me.cfg.box.find('.clearAll').click();

      //点击展开 或者 收起按钮
      me.cfg.dept.delegate(".icon", "click", function(){
        // var orgid = $(this).parent().attr("data-orgid"),
        var orgid = 0,
            id    = $(this).parent().attr('data-id'),
            level = $(this).parent().attr("data-level");

          if( $(this).hasClass("glyplay90") ){
            $(this).parent().next('ul').addClass("hide");
            $(this).removeClass("glyplay90");
          }else{
            if( $(this).parent().next('ul').length > 0 ){
              $(this).parent().next('ul').removeClass("hide");
              $(this).addClass("glyplay90");
            }else{
              level++;
              // 判断level是否为1， 1为展开企业
              if( level == 1 ){
                me.getDept(orgid, 0, level);
                $(this).siblings('img').removeClass('hide');
              }
              else{
                me.getDept(orgid, id, level);
                $(this).siblings('img').removeClass('hide');
              }
              $(this).addClass("glyplay90");
            }
          }
        });

        me.cfg.dept.delegate("span.name", "click", function(ev){
          me.getUser($(this).parent());
        });

        //人员全选 复选框
        me.cfg.root.delegate('.chooseAll', 'click', function(){
          if( $(this).hasClass('checked') ){
            $(this).removeClass('checked');

            me.cfg.people.find('.rbox').each(function(){
              if (!$(this).hasClass('disabled')) {
                $(this).removeClass('checked');
                var id = $(this).parent().attr('data-id');

                me.arrPop(me.peopleIdArr, id);
                me.arrPopWholeInfo(id);
                me.cfg.box.find('span[data-peopleid="'+id+'"]').remove();
              }
            });
          }else{
          //全选
          $(this).addClass('checked');
            me.cfg.people.find('.rbox').each(function(){
              if (!$(this).hasClass('disabled')) {
                $(this).addClass('checked');
                var id = $(this).parent().attr('data-id'),
                    name = $(this).parent().attr('data-name'),
                    phone = $(this).parent().attr('data-phone'); 
                
                me.peopleIdArr.push(id);
                var uid_mobile_username = id+"_"+phone+"_"+name;
                    me.peopleWholeInfo.push(uid_mobile_username);

                // 添加到box
                if( me.cfg.box.find('span[data-peopleid="'+id+'"]').length === 0 ){
                  var str = '<span class="user" data-peopleid="'+id+'">'+name+' <i class="iconfont clear">&times;</i></span>';
                  me.cfg.box.append(str);
                }
              }
            });
          }
        });

        //点击人员 复选框 （部门复选框在这里去掉！）
        me.cfg.root.delegate('.rbox', 'click', function(){
          var id = $(this).parent().attr('data-id');
          //判断部门 还是 人员
          if( $(this).hasClass('rbox') ){
            //人员复选框
            var name = $(this).parent().attr('data-name'),
                phone = $(this).parent().attr('data-phone'); 
            if( !$(this).hasClass('checked') ){
              $(this).addClass('checked');
              me.peopleIdArr.push(id);

              var uid_mobile_username = id+"_"+phone+"_"+name;
                  me.peopleWholeInfo.push(uid_mobile_username);

              // 添加到box
              if( me.cfg.box.find('span[data-peopleid="'+id+'"]').length === 0 ){
                var str = '<span class="user" data-peopleid="'+id+'">'+name+' <i class="iconfont clear">&times;</i></span>';
                me.cfg.box.append(str);
                //设置右上角的人员数量
                // me.cfg.num.html( String(parseInt(me.cfg.num.html())+1) );
              }
            }
            else{
              $(this).removeClass('checked');
              me.arrPop(me.peopleIdArr, id);

              me.arrPopWholeInfo(id);

              me.cfg.box.find('span[data-peopleid="'+id+'"]').remove();
              //设置右上角的人员数量
              // me.cfg.num.html( String( parseInt(me.cfg.num.html())-1>0?parseInt(me.cfg.num.html())-1:0 ) );

              me.cfg.people.find('.chooseAll').removeClass('checked');
            }
          }else{
            //部门复选框
            var orgid = $(this).parent().attr('data-orgid'),
               name2 = $(this).next().html();
            if( !$(this).hasClass('checked') ){
              // 当前不是选中
              $(this).addClass('checked');
              // 将当前id添加进数组
              me.deptIdArr.push(id);
              // 添加到box
              var str2 = '<span data-orgid="'+orgid+'" data-deptid="'+id+'">'+name2+' <i class="iconfont clear">&times;</i></span>';
              me.cfg.box.append(str2);
            }
            else{
              // 当前是勾选的
              $(this).removeClass('checked');
              // 在数组中删除这个元素id
              me.arrPop(me.deptIdArr, id);
              //从box中移除这个元素
              me.cfg.box.find('span[data-orgid="'+orgid+'"][data-deptid="'+id+'"]').remove();
            }
          }
        });

      //点击 盒子中的 清除单个人
      me.cfg.box.delegate('.clear', 'click', function(){
        $(this).parent().remove();
        if( $(this).parent().attr('data-orgid') ){
          //清除单个部门
          var orgid = $(this).parent().attr('data-orgid'),
              id1   = $(this).parent().attr('data-deptid');
              me.arrPop(me.deptIdArr, id1);
          // 去掉当前企业下的勾选
          me.cfg.dept.find('li[data-orgid="'+orgid+'"][data-id="'+id+'"]').find('.box').removeClass('checked');           
        }else{
          //清除个人
          var id = $(this).parent().attr('data-peopleid');
              me.arrPop(me.peopleIdArr, id);
              me.cfg.people.find('td[data-id="'+id+'"]').find('.box').removeClass('checked');
              me.arrPopWholeInfo(id);
          //设置右上角的人员数量
          // me.cfg.num.html( String( parseInt(me.cfg.num.html())-1>0?parseInt(me.cfg.num.html())-1:0 ) );
        }
      });

      //点击清除全部
      me.cfg.root.delegate('.clearAll', 'click', function () {
        me.clearChooseBox();
      });

      //搜索
      $('#J_search').keyup(function(event) {
        var val = $(this).val();
        if( event.keyCode == 13 ){
          if( $.trim(val) == "" ) return false;
          me.searchData(val);
          $(this).val("");
        } 
      });
    } // bind结束
  }; // 结束

  // module.exports = People;
// });

