var layDATE = layui.laydate;
var layLAYER = layui.layer;
var layFORM = layui.form;

var TABLECACHE = {};
var SEDMVCACHE = {};
var POPL_AREA = [];

var USRST_TAB_edit = false;


function viewswto_SEDMV(){
    $('.leftcard .toggle').attr('class', 'toggle');
    $('.leftcard #toggle-sedmv').attr('class', 'toggle catch');
    $('.rightcard .ntbtn').css('margin-left', '400px');
    setTimeout(function(){
        $('.rightcard .ntbtn').toggle();
        $('.rightcard .ntbtn').css('margin-left', '10px');
    }, 160);
    $('.tablebox').fadeOut(200);
    setTimeout(function(){
        $('.sedmvbox').fadeIn(200);
    }, 100);
}
function viewswto_TABLE(){
    $('.leftcard .toggle').attr('class', 'toggle');
    $('.leftcard #toggle-table').attr('class', 'toggle catch');
    $('.rightcard .ntbtn').css('margin-left', '400px');
    setTimeout(function(){
        $('.rightcard .ntbtn').toggle();
        $('.rightcard .ntbtn').css('margin-left', '10px');
    }, 160);
    $('.sedmvbox').fadeOut(200);
    setTimeout(function(){
        $('.tablebox').fadeIn(200);
    }, 100);
}
function sedmv_add(someinfo){
    var tohtml;
    for(index in someinfo){
        l = someinfo[index];
        tohtml = `<li class="sedmv-item sedmv-item-new" index="${index}">
        <div class="device">
            <div class="device-img">
                <img src="/static/images/m_network-hub.png">
            </div>
            <ul class="device-opt">
                <li name="name">
                    <label>设备名称</label>
                    <span>${l.name}</span>
                </li>
                <li name="model">
                    <label>设备类型</label>
                    <span>${l.model}</span>
                </li>
                <li name="assets">
                    <label>固资</label>
                    <span>${l.assets}</span>
                </li>
                <li name="ip">
                    <label>IP地址</label>
                    <span>${l.ip}</span>
                </li>
            </ul>
            <i class="editbtn fa-solid fa-pen-to-square"></i>
        </div>
        <div class="arrow">
            <div class="arrow-source">
                <label>原位置</label>
                <span>${l.loca2}</span>
            </div>
            <div class="arrow-icons">
                <i class="fa-solid fa-dolly"></i>
                <i class="fa-solid fa-right-long"></i>
            </div>
            <div class="arrow-alter">
                <label>变更为</label>
                <span>...</span>
            </div>
        </div>
        <div class="reason">
            <label>备注原因:</label>
            <textarea readonly="readonly"></textarea>
        </div>
    </li>`;
        $('.sedmv-project').append(tohtml);
        $(".sedmv-project .sedmv-item-new").animate({'top': '0px'}, 400); 
        $('.sedmv-item-new .editbtn').click(usrClickEdit_SEDMV);
        $('.sedmv-project .sedmv-item-new').attr('class', 'sedmv-item');
    }
}
function coldrag(spc){
    var mouse_m = spc.pageX;
    var col_obj = $(this).parent();
    var owidth = col_obj.width();
    var col_strfit = `#sheet ul li:nth-child(${col_obj.attr('col')})`;
    $(document).mouseup(function(){
        $(document).off('mouseup');
        $(document).off('mousemove');
    });
    $(document).mousemove(function(c){
        let nwidth = owidth + c.pageX - mouse_m;
        if(nwidth < 60){
            nwidth = 60;
        }
        $(col_strfit).css('width', nwidth+'px');
    });
}
function table_render(table_data){
    var tablehtml = `<div class="sheet-head layui-row">
        <ul>
            <li col="1"><span>变更时间</span><div class="sheet-split"></div></li>
            <li col="2"><span>固资</span><div class="sheet-split"></div></li>
            <li col="3"><span>SN</span><div class="sheet-split"></div></li>
            <li col="4"><span>设备型号</span><div class="sheet-split"></div></li>
            <li col="5"><span>设备名称</span><div class="sheet-split"></div></li>
            <li col="6"><span>设备IP</span><div class="sheet-split"></div></li>
            <li col="7"><span>原位置</span><div class="sheet-split"></div></li>
            <li col="8"><span>变更后位置</span><div class="sheet-split"></div></li>
            <li col="9"><span>处理人员</span><div class="sheet-split"></div></li>
            <li col="10"><span>备注原因</span><div class="sheet-split"></div></li>
        </ul>
    </div>
    <div class="sheet-body">`;
    for(i in table_data){
        let row = table_data[i];
        tablehtml += `<ul index="${row.devi}">
        <li><span>${row.timebar}</span><div class="sheet-split"></div></li>
        <li><span>${row.assets}</span><div class="sheet-split"></div></li>
        <li><span>${row.sn}</span><div class="sheet-split"></div></li>
        <li><span>${row.model}</span><div class="sheet-split"></div></li>
        <li><span>${row.name}</span><div class="sheet-split"></div></li>
        <li><span>${row.ip}</span><div class="sheet-split"></div></li>
        <li><span>${row.locas}</span><div class="sheet-split"></div></li>
        <li><span>${row.locan}</span><div class="sheet-split"></div></li>
        <li><span>${row.opter}</span><div class="sheet-split"></div></li>
        <li><span>${row.mark}</span><div class="sheet-split"></div></li>
    </ul>`
    }
    $('#sheet').html(tablehtml);
    $(`#sheet .sheet-split`).mousedown(coldrag);
    $(`#sheet .sheet-body ul`).dblclick(usrClickRow_TABLE);    
}
function sedmv_popl_findfill(line){
    let index = $('.popl-sedmv-edit').attr('index');
    let devi = line['devi'];
    SEDMVCACHE[index]['devi'] = devi;
    let con = confirm('将会清空当前输入,是否确认?');
    if(con){
        $('.popl-sedmv-edit layui-input').val('');
        for(i in line){
            $(`.popl-sedmv-edit input[name="${i}"]`).val(line[i]);
        }
    }
}



function usrToggle(){
    let wias = $(this).attr('id');
    let now_id = $('.leftcard .catch').attr('id');
    if(wias == now_id){
        return null;
    }
    if(wias == 'toggle-table'){
        viewswto_TABLE();
    }else if(wias == 'toggle-sedmv'){
        viewswto_SEDMV();
    }
}
function usrNtbtnNew_SEDMV(){
    let index = 'NEW__' + $.now();
    let buf = ['devi','name','ip','model','sn','assets','loca1','loca2','opty','sedmvdate','type','sedmvowner','sedmvloca','sedmvopter','sedmvmark'];
    let line = {};
    for(i in buf){
        line[buf[i]] = '';
    }
    line['devi'] = index;
    SEDMVCACHE[index] = line;
    debug = {};
    debug[index] = line;
    sedmv_add(debug);
}
function usrNtbtnDel_SEDMV(){
    let hasdelitem = $('.sedmv-item-del').length > 0;
    if(hasdelitem){
        $('.sedmv-item-del .arrow-icons').html('<i class="fa-solid fa-dolly"></i>\n<i class="fa-solid fa-right-long"></i>');
        $('.sedmv-item-del').attr('class', 'sedmv-item');
        $('.sedmv-item .arrow-icons').off('click');
    }else{
        $('.sedmv-item').attr('class', 'sedmv-item sedmv-item-del');
        $('.sedmv-item .arrow-icons').html('<i class="fa-solid fa-trash-can"></i>');
        $('.sedmv-item .arrow-icons').click(usrClickDel_SEDMV);
    }
}

function usrNtbtnSumbit_SEDMV(){
    console.log(SEDMVCACHE);
    var notm = 0;
    if(SEDMVCACHE.length < 1){
        return 0;
    }
    for(index in SEDMVCACHE){
        sedline = SEDMVCACHE[index];
        nots = 0;
        for(i in sedline){
            if(i == 'loca1' || i == 'opty'){
                null
            }else{
                if(sedline[i] == ''){
                    notm += 1;
                    nots += 1;
                    $(`.sedmv-item[index="${index}"]`).css('background-color', '#bd45451f');
                }
            }
        }
        if(nots == 0){
            $(`.sedmv-item[index="${index}"]`).css('background-color', '#45a1bd0f');
        }
    }
    if(notm == 0){
        usrNtbtnSumbit_conf_SEDMV();
    }else{
        setTimeout(function(){
            con = confirm('仍有未填写完整的信息(红色部分),确认提交吗?');
            if(con){
                usrNtbtnSumbit_conf_SEDMV();
            }
        }, 100);
    }
}
function usrNtbtnSumbit_conf_SEDMV(){
    var loadq = layLAYER.load(0);
    $.post('/ms/devm/sedmv/', {data:JSON.stringify(SEDMVCACHE)}, function(data){
        layLAYER.close(loadq);
        alert('Success');
        location.reload();
    });
}


function usrClickEdit_SEDMV(){
    var index = $(this).parents('.sedmv-item').attr('index');
    var l = {};
    l = SEDMVCACHE[index];
    layLAYER.open({
        type: 1,
        area: POPL_AREA,
        title: '编辑',
        skin: 'layui-layer-win10',
        shade: 0.1,
        anim: 0,
        btn:['确认', '取消'],
        btn1:usrClickEdit_sumbit_SEDMV,
        btn2:usrPoplExit,
        content:`<form class="layui-form layui-form-pane popl-sedmv-edit" lay-filter="popl-sedmv-edit" index="${index}">
            <div class="layui-form-item">
                <label class="layui-form-label">设备来源</label>
                <div class="layui-input-inline">
                    <select class="popl-sedmv-select">
                        <option value="0" selected>设备监控清单</option>
                        <option value="1">设备库存清单</option>
                    </select>
                </div>
                <div class="layui-input-inline">
                    <input type="text" autocomplete="off" class="layui-input" id="popl-sedmv-findinput" placeholder="关键字...">
                </div>
                <div class="layui-input-inline"> 
                    <button type="button" class="layui-btn layui-btn-primary" id="popl-sedmv-find"><i class="layui-icon layui-icon-search"></i> 搜索</button>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">设备名称</label>
                <div class="layui-input-inline">
                    <input type="text" autocomplete="off" class="layui-input" value="${l.name}" name="name">
                </div>
                <label class="layui-form-label">IP</label>
                <div class="layui-input-inline">
                    <input type="text" autocomplete="off" class="layui-input" value="${l.ip}" name="ip">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">变更日期</label>
                    <div class="layui-input-inline layui-input-wrap">
                        <div class="layui-input-prefix">
                            <i class="layui-icon layui-icon-date"></i>
                        </div>
                        <input type="text" id="popl-sedmv-date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input" value="${l.sedmvdate}" name="sedmvdate">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">设备类型</label>
                <div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${l.type}" name="type"></div>
                <label class="layui-form-label">设备型号</label>
                <div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${l.model}" name="model"></div>
                <label class="layui-form-label">SN</label>
                <div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${l.sn}" name="sn"></div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">固资</label>
                <div class="layui-input-inline">
                    <input type="text" autocomplete="off" class="layui-input" value="${l.assets}" name="assets">
                </div>
                <label class="layui-form-label">保管人</label>
                <div class="layui-input-inline">
                    <input type="text" autocomplete="off" class="layui-input" value="${l.sedmvowner}" name="sedmvowner">
                </div>
                <button type="button" class="layui-btn layui-btn-primary" id="popl-sedmv-refresh"><i class="layui-icon layui-icon-refresh"></i></button>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">原位置</label>
                <div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${l.loca2}" name="loca2"></div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">变更位置为</label>
                <div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${l.sedmvloca}" name="sedmvloca"></div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">处理人员</label>
                <div class="layui-input-block"><input type="text" autocomplete="off" class="layui-input" value="${l.sedmvopter}" name="sedmvopter"></div>
            </div>
            <div class="layui-form-item layui-form-text">
                <label class="layui-form-label">备注原因</label>
                <div class="layui-input-block">
                    <textarea placeholder="......" class="layui-textarea" name="sedmvmark">${l.sedmvmark}</textarea>
                </div>
            </div>
        </form>`,
    });
    // <input class="layui-hide" type="text" value="${l.devi}" name="devi">
    layFORM.render(null, 'popl-sedmv-edit');
    layDATE.render({elem: '#popl-sedmv-date', max:0, theme:'grid',});
    $('#popl-sedmv-find').click(usrClickEdit_find_SEDMV);
    $('#popl-sedmv-refresh').click(usrClickEdit_refresh_SEDMV);
}
function usrClickEdit_find_SEDMV(){
    let usrin = $('#popl-sedmv-findinput').val();
    let usrsou = $('.popl-sedmv-select').val();
    let hasfindsel = $('#popl-sedmv-findsel').length > 0;
    if(hasfindsel){
        $(this).html('<i class="layui-icon layui-icon-search"></i> 搜索');
        $('#popl-sedmv-findsel').remove();
        return 0;
    }
    if(usrin.length < 2){
        alert('请至少输入个两个字符');
        return 0;
    }
    var loadq = layLAYER.load(0);
    var thisbtn = $(this);
    var path = '';
    switch(usrsou){
        case "0": path = '/ms/devl/findall/';break;
        case "1": path = '/ms/deva/usrfind/';break;
    }
    $.post(path, {usrin:usrin}, function(data){
        layLAYER.close(loadq);
        if(data.length == 0){
            alert('未找到相匹配的对象');
            return 0;
        }else if(data.length == 1){
            sedmv_popl_findfill(data[0]);
        }else{
            thisbtn.html('取消');
            $('.popl-sedmv-edit').append(`<div id="popl-sedmv-findsel"><table id="layuitable"></table></div>`);
            layui.table.render({
                elem:'#layuitable',
                height: '#popl-sedmv-findsel-0',
                data:data,
                cols: [[
                    {field:'assets', title:'固资',},
                    {field:'sn', title:'SN码',},
                    {field:'model', title:'型号',},
                    {field:'loca2', title:'当前位置',},
                  ]],
            });
            layui.table.on('row(layuitable)', function(obj){
                let data = obj.data;
                sedmv_popl_findfill(data);
                $('#popl-sedmv-findsel').remove();
                thisbtn.html('<i class="layui-icon layui-icon-search"></i> 搜索');
            });
        }

    });
}

function usrClickEdit_refresh_SEDMV(){
    // 这里会得到固资对应的devi, 请确认是否更新SEDMVCACHE中的devi
    //
    // 暂不更新   记得修改usrClickEdit_SEDMV()函数
    var finddevastr = $('.popl-sedmv-edit input[name="assets"]').val();
    if(finddevastr.length == 0){
        return 0;
    }
    var loadq = layLAYER.load(0);
    $.post('/ms/devm/finddeva2/', {asset:finddevastr}, function(data){
        layLAYER.close(loadq);
        console.log(data)
        if(data.length == 0){
            alert('未找到该固资');
        }else{
            $('.popl-sedmv-edit input[name="type"]').val(data.type);
            $('.popl-sedmv-edit input[name="model"]').val(data.model);
            $('.popl-sedmv-edit input[name="sedmvowner"]').val(data.owner);
            // $('.popl-sedmv-edit input[name="devi"]').val(data.devi);
        }
    });
}

function usrClickEdit_sumbit_SEDMV(popli){
    var index = $('.popl-sedmv-edit').attr('index');
    var obj_item = $(`.sedmv-item[index="${index}"]`);
    $('.popl-sedmv-edit input').each(function(){
        let key = $(this).attr('name');
        let val = $(this).val();
        if(key == undefined){
            null
        }else{
            SEDMVCACHE[index][key] = val;
        }
    });
    SEDMVCACHE[index]['sedmvmark'] = $('.popl-sedmv-edit textarea').val();
    let l = SEDMVCACHE[index];
    obj_item.find('.device-opt li').each(function(){
        $(this).find('span').html(l[$(this).attr('name')]);
    });
    obj_item.find('.arrow-source span').html(l.loca2);
    obj_item.find('.arrow-alter span').html(l.sedmvloca);
    obj_item.find('.reason textarea').val(l.sedmvmark);
    usrPoplExit(popli);
}



function usrClickDel_SEDMV(){
    let thisitem = $(this).parents('.sedmv-item');
    let index = thisitem.attr('index');
    delete SEDMVCACHE[index];
    thisitem.animate({'opacity': '0'}, {duration:200, complete:function(){
        thisitem.remove();
        $(".sedmv-project .sedmv-item").css('top', '120px');
        $(".sedmv-project .sedmv-item").animate({'top': '0px'}, 200);
    }});
}

function usrClickEdit_TABLE(){
    if(!USRST_TAB_edit){
        alert('直接编辑用于修改错误的记录,不会同步数据');
        USRST_TAB_edit = true;
    }
    $('.popl-table-edit input').removeAttr('readonly');
    $('.popl-table-edit textarea').removeAttr('readonly');
    $('.popl-table-edit input').css('background-color', '#fff');
    $('.popl-table-btnbar').html('<button type="button" class="layui-btn" id="popl-table-sumbitbtn">提交修改</button>');
    $('#popl-table-sumbitbtn').click(usrEditSumbit_TABLE);
}

function usrEditSumbit_TABLE(){
    var line = {};
    $('.popl-table-edit input').each(function(){
        let key = $(this).attr('name');
        let val = $(this).val();
        line[key] = val;
    });
    line['devi'] = $('.popl-table-edit').attr('devi');
    line['mark'] = $('.popl-table-edit textarea').val();
    var loadq = layLAYER.load(0);
    $.post('/ms/devm/direct/', {data:JSON.stringify(line)}, function(data){
        if(data){
            location.reload();
            layLAYER.close(loadq);
        }else{
            layLAYER.close(loadq);
            alert('Error');
        }
    });
}

function usrClickRow_TABLE(){
    let devi = $(this).attr('index');
    let l = TABLECACHE[devi];
    layLAYER.open({
        type: 1,
        area: POPL_AREA,
        title: '编辑',
        skin: 'layui-layer-win10',
        shade: 0.1,
        anim: 0,
        btn:['取消'],
        btn2:usrPoplExit,
        content:`<form class="layui-form layui-form-pane popl-table-edit" lay-filter="popl-table-edit" devi="${devi}">
        <div class="layui-form-item">
            <label class="layui-form-label">设备名称</label>
            <div class="layui-input-inline">
                <input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.name}" name="name">
            </div>
            <label class="layui-form-label">IP</label>
            <div class="layui-input-inline">
                <input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.ip}" name="ip">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">设备类型</label>
            <div class="layui-input-block"><input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.type}" name="type"></div>
            <label class="layui-form-label">设备型号</label>
            <div class="layui-input-block"><input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.model}" name="model"></div>
            <label class="layui-form-label">SN</label>
            <div class="layui-input-block"><input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.sn}" name="sn"></div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">固资</label>
            <div class="layui-input-inline">
                <input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.assets}" name="assets">
            </div>
            <label class="layui-form-label">保管人</label>
            <div class="layui-input-inline">
                <input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.owner}" name="owner">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">处理人员</label>
            <div class="layui-input-block"><input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.opter}" name="opter"></div>
        </div>
        <div class="layui-form-item">
            <div class="layui-inline">
                <label class="layui-form-label">变更日期</label>
                <div class="layui-input-inline layui-input-wrap">
                    <div class="layui-input-prefix">
                        <i class="layui-icon layui-icon-date"></i>
                    </div>
                    <input readonly="readonly" type="text" id="popl-table-date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input" value="${l.timebar}" name="timebar">
                </div>
                <button type="button" class="layui-btn layui-btn-primary" id="popl-table-seldev"><i class="layui-icon layui-icon-list"></i>查看历史</button>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">原位置</label>
            <div class="layui-input-block"><input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.locas}" name="locas"></div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">变更为</label>
            <div class="layui-input-block"><input readonly="readonly" type="text" autocomplete="off" class="layui-input" value="${l.locan}" name="locan"></div>
        </div>
        <div class="layui-form-item layui-form-text">
            <label class="layui-form-label">备注原因</label>
            <div class="layui-input-block">
                <textarea readonly="readonly" placeholder="......" class="layui-textarea" name="mark">${l.mark}</textarea>
            </div>
        </div>
        <div class="layui-form-itemc popl-table-btnbar">
            <button type="button" class="layui-btn layui-btn-primary" id="popl-table-editbtn">直接编辑</button>
        </div>
    </form>`,
    });
    $('#popl-table-editbtn').click(usrClickEdit_TABLE);
}

function usrSelDate_TABLE(){
    let tdate = $('#table-date').val();
    var loadq = layLAYER.load(0);
    $.post('/ms/devm/sheet/', {date: tdate}, function(data){
        layLAYER.close(loadq);
        for(i in data){
            l = data[i];
            TABLECACHE[l.devi] = l;
        }
        table_render(data);
    });
}

function usrNtbtnDel_TABLE(){
    let hasdelbar = $('#sheet .delbar').length > 0;
    $('#sheet .delbar').remove();
    $('.sheet-body .delbar').off('click');
    if(!(hasdelbar)){
        $('.sheet-body ul').each(function(){
            $(this).append(`<div class="delbar" index="${$(this).attr('index')}">X</div>`);
        });
        $('.sheet-body .delbar').click(usrClickDel_TABLE);
    }
}

function usrClickDel_TABLE(){
    let con = confirm('确认删除?');
    let ti = $(this).attr('index');
    var loadq = layLAYER.load(0);
    if(con){
        $.post('/ms/devm/delete/', {index:ti}, function(data){
            layLAYER.close(loadq);
            location.reload();
        });
    }
}



function usrPoplExit(index){
    layLAYER.close(index);
}



function Init(){
    POPL_AREA = ['860px', '680px'];
    if(window.innerHeight < 700){
        POPL_AREA = ['700px', '520px'];
    }

    layDATE.render({
        elem: '#table-date',
        type: 'month',
        theme: ['grid','#45a1bd'],
        min: -2190,
        max: 1,
        btns: ['now', 'confirm'],
        done: usrSelDate_TABLE,
    });
    var now = new Date();
    var year = now.getFullYear();
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    $.post('/ms/devm/sheet/', {date: `${year}-${month}`}, function(data){
        for(i in data){
            l = data[i];
            TABLECACHE[l.devi] = l;
        }
        table_render(data);
    });

    if(SSC_DATA){
        var ssc = JSON.parse(SSC_DATA);
        viewswto_SEDMV();
        let finddevastr = JSON.stringify(Object.keys(SEDMVCACHE));
        let timei = +$.now();
        for(devi in ssc){
            timei ++;
            SEDMVCACHE['NEW__'+timei] = ssc[devi];
        }
        sedmv_add(SEDMVCACHE);
        $.post('/ms/devm/finddeva/', {devis:finddevastr}, function(data){
            var buf = ['sedmvdate','type','sedmvloca','sedmvowner','sedmvopter','sedmvmark'];
            for(i in SEDMVCACHE){
                for(j in buf){
                    SEDMVCACHE[i][buf[j]] = '';
                }
                if(data[i]){
                    SEDMVCACHE[i]['type'] = data[i].type;
                    SEDMVCACHE[i]['sedmvowner'] = data[i].owner;
                }
            }
        });
    }else{
        usrNtbtnNew_SEDMV();
    }
}

$(document).ready(function(){
    $(".toggle").click(usrToggle);
    $("#newn").click(usrNtbtnNew_SEDMV);
    $("#deln").click(usrNtbtnDel_SEDMV);
    $("#del").click(usrNtbtnDel_TABLE);
    $("#sumbn").click(usrNtbtnSumbit_SEDMV);
    Init();
});
