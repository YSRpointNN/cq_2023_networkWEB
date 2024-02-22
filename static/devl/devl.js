var layELEMENT = layui.element;
var layLAYER = layui.layer;
var layFORM = layui.form;
var SHEETCACHE_LIST = {};
var SHEETCACHE_DATA = {};
var SEDMVCACHE = {};
var ROWCLICK = 1;

var USRST_TAB_edit = false;

layLAYER.config({
    type: 1,
    skin: 'layui-layer-win10',
    anim: 0,
});

function table_render(sheet_id, table_data){
    var tablehtml = `<div class="sheet-head layui-row">
        <ul>
            <li col="1"><span>行</span><div class="sheet-split"></div></li>
            <li col="2"><span>设备位置一</span><div class="sheet-split"></div></li>
            <li col="3"><span>设备位置二</span><div class="sheet-split"></div></li>
            <li col="4"><span>设备型号</span><div class="sheet-split"></div></li>
            <li col="5"><span>设备名称</span><div class="sheet-split"></div></li>
            <li col="6"><span>设备IP</span><div class="sheet-split"></div></li>
            <li col="7"><span>固资</span><div class="sheet-split"></div></li>
            <li col="8"><span>SN</span><div class="sheet-split"></div></li>
            <li col="9"><span>备注说明</span><div class="sheet-split"></div></li>
        </ul>
    </div>
    <div class="sheet-body">`;
    for(i in table_data){
        let row = table_data[i];
        tablehtml += `
        <ul devi="${row.devi}">
        <li><span>${row.index}</span><div class="sheet-split"></div></li>
        <li><span>${row.loca1}</span><div class="sheet-split"></div></li>
        <li><span>${row.loca2}</span><div class="sheet-split"></div></li>
        <li><span>${row.model}</span><div class="sheet-split"></div></li>
        <li><span>${row.name}</span><div class="sheet-split"></div></li>
        <li><span>${row.ip}</span><div class="sheet-split"></div></li>
        <li><span>${row.assets}</span><div class="sheet-split"></div></li>
        <li><span>${row.sn}</span><div class="sheet-split"></div></li>
        <li><span>${row.mark}</span><div class="sheet-split"></div></li>
    </ul>`
    }
    let tabopt = {
        title: SHEETCACHE_LIST[sheet_id],
        content: `<div class="sheet-idlayer" id="${sheet_id}">\n${tablehtml}\n</div>`,
        id: sheet_id,
        change: true
    }
    if(sheet_id == 's999'){
        tabopt.title = '搜索结果';
    } 
    layELEMENT.tabAdd('sheet-tab', tabopt);
    SHEETCACHE_DATA[sheet_id] = table_data;
    $(`#${sheet_id} .sheet-split`).mousedown(coldrag);
    $(`#${sheet_id} .sheet-body ul`).dblclick(usrClickRow);
}

function devi_mapping(devi){
    let html_sheet_id = $('.sheet-bar .layui-this').attr('lay-id');
    let data = SHEETCACHE_DATA[html_sheet_id];
    for(i in data){
        let line = data[i];
        if(devi == line['devi']){
            return line;
        }
    }
}
function devi_mapping_2(devi){
    for(html_sheet_id in SHEETCACHE_DATA){
        let data = SHEETCACHE_DATA[html_sheet_id];
        for(i in data){
            let line = data[i];
            if(devi == line['devi']){
                return line;
            }
        }
    }
}

function coldrag(spc){
    var mouse_m = spc.pageX;
    var col_obj = $(this).parent();
    var owidth = col_obj.width();
    var col_strfit = `.layui-show ul li:nth-child(${col_obj.attr('col')})`;
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



function conf_usroperate(ntline){
    var devi = ntline.devi;
    var opty_str;
    if(SEDMVCACHE[devi]){
        return 0;
    }
    switch(ntline.opty){
        case 'on': opty_str='上线:'; break;
        case 'off': opty_str='下线:'; break;
        default: opty_str='移动';break;
    }
    if(Object.keys(SEDMVCACHE).length == 0){
        layLAYER.open({
            ntbtnflag: true,
            area: ['300px', '200px'],
            title: '执行',
            offset: 'rt',
            closeBtn: 0,
            shade: 0,
            btn: ['确认', '取消'],
            btn1: usrNtbtnSumbit,
            btn2: usrPoplExit,
            content:`<div class="popl-ntbtns-item"><label>${opty_str}</label><span>${ntline.name}</span></div>\n`,
        });
    }else{
        $('.layui-layer-content').append(`<div class="popl-ntbtns-item"><label>${opty_str}</label><span>${ntline.name}</span></div>\n`);
    }
    SEDMVCACHE[devi] = ntline;
}

function conf_online(arload){
    if(arload.length > 0){
        $.post('/ms/devl/operate/online/', {data:JSON.stringify(arload)}, function(resu){
            null
        });
    }
}

function conf_offline(arload){
    if(arload.length > 0){
        let devis = [];
        for(ntline of arload){
            devis.push(ntline.devi);
        }
        $.post('/ms/devl/operate/offline/', {data:JSON.stringify(devis)}, function(resu){
            null
        });
    }
}



function Init(){
    $.post('/ms/devl/sheet/', function(data){
        let sheet_list = data['sheet_list'];
        let sheet_data = data['osheet'];
        let tohtml = '';
        for(i in sheet_list){
            let sheet_id = 's00'+i;
            SHEETCACHE_LIST[sheet_id] = sheet_list[i];
            tohtml += `<li class="sheet-sel-item" name="${sheet_id}">${sheet_list[i]}</li>`;
        }
        let sheet_sel_height = sheet_list.length * 24;
        let tablebox_height = $('.tablebox').height();
        if(tablebox_height < sheet_sel_height - 70){
            sheet_sel_height = tablebox_height - 70;
        }
        $('.sheet-sel ul').css('height', sheet_sel_height + 'px');
        $('.sheet-sel ul').html(tohtml);
        $('.sheet-sel-item').click(usrSelTable);
        layELEMENT.render('tab', 'sheet-tab');
        table_render('s000', sheet_data);
    });
}

function newpopl_findfiller(line){
    let con = confirm('将会清空当前输入,是否确认?');
    if(con){
        $('.popl-usredit input').val('');
        for(i in line){
            $(`.popl-devinfo input[name="${i}"]`).val(line[i]);
        }
    }
}


// // // // // //
function usrFind_sumbit(){
    let usrin = $('#usrfind-input').val();
    let findtype = $('.leftcard select').val();
    if(usrin.length < 2){
        alert('请至少输入2个字符');
    }else{
        layELEMENT.tabDelete('sheet-tab', 's999');
        var resf = [];
        switch(findtype){
            case "1":
                let html_sheet_id = $('.sheet-bar .layui-this').attr('lay-id');
                let data = SHEETCACHE_DATA[html_sheet_id];
                for(i in data){
                    let line = data[i];
                    let line_str = Object.values(line).toString();
                    if(line_str.includes(usrin)){
                        resf.push(line);
                    }
                }
                if(resf.length == 0){
                    alert('没找到' + usrin);
                }else{
                    table_render('s999', resf);
                }
            break;

            case "2":
                $.post('/ms/devl/findall/', {'usrin': usrin}, function(data){
                    resf = data;
                    if(resf.length == 0){
                        alert('没找到' + usrin);
                    }else{
                        table_render('s999', resf);
                    }
                });
            break;
        }
    }
}

function usrToggle(){
    let self = $(this);
    let this_id = self.attr('id');
    let now_id = $('.leftcard .catch').attr('id');
    if(this_id == now_id){
        return null;
    }
    $('.leftcard .toggle').attr('class', 'toggle');
    self.attr('class', 'toggle catch');
    $('.rightcard .ntbtn').css('margin-left', '400px');
    setTimeout(function(){
        $('.rightcard .ntbtn').toggle();
        $('.rightcard .ntbtn').css('margin-left', '10px');
    }, 160);
}


function usrNtbtnOnline(){
    let hasonlinebar = $('.layui-show .onlinebar').length > 0;
    let isfindtab = $('.layui-show .sheet-idlayer').attr('id') == 's999';
    $('.ntevent').remove();
    if(!(hasonlinebar || isfindtab)){
        var i = 2;
        $('.layui-show .sheet-body').prepend('<div class="onlinebar ntevent" index="1">1 +</div>');
        $('.layui-show .sheet-body ul').each(function(){
            $(this).after(`<div class="onlinebar ntevent" index="${i}">${i} +</div>`);
            $(this).append(`<div class="replasebar_o ntevent" devi="${$(this).attr('devi')}"><</div>`);
            i ++;
        });
        $('.sheet-body .onlinebar').click(usrClickOnline);
        $('.sheet-body .replasebar_o').on('click', function(){
            usrClickReplase();
        });
    }
}
function usrNtbtnOffline(){
    let hasofflinebar = $('.layui-show .offlinebar').length > 0;
    // let isfindtab = $('.layui-show .sheet-idlayer').attr('id') == 's999';
    $('.ntevent').remove();
    if(!(hasofflinebar)){
        $('.layui-show .sheet-body ul').each(function(){
            $(this).append(`<div class="offlinebar ntevent" devi="${$(this).attr('devi')}">X</div>`);
        });
        $('.sheet-body .offlinebar').click(usrClickOffline);
    }
}
function usrNtbtnMove(){
    let hasmovebar = $('.layui-show .movebar').length > 0;
    $('.ntevent').remove();
    if(!hasmovebar){
        $('.layui-show .sheet-body ul').each(function(){
            $(this).append(`<div class="movebar ntevent" devi="${$(this).attr('devi')}"><</div>`);
        });
        $('.sheet-body .movebar').click(usrClickMove1);
    }
}
function usrNtbtnSumbit(){
    var onload = [];
    var offload = [];
    for(devi in SEDMVCACHE){
        let ntline = SEDMVCACHE[devi];
        switch(ntline.opty){
            case 'on': onload.push(ntline); break;
            case 'off': offload.push(ntline); break;
            default: break;
        }
    }
    conf_offline(offload);
    conf_online(onload);
    window.parent.MSAPI_ifmJump('/ms/devm/', JSON.stringify(SEDMVCACHE));
}



function usrClickOnline(){
    var popl_area = ['850px', '640px'];
    if(window.innerHeight < 700){
        popl_area = ['700px', '520px'];
    }
    var devinfo = {};
    devinfo['sheet'] = SHEETCACHE_LIST[$('.sheet-bar .layui-this').attr('lay-id')];
    devinfo['index'] = $(this).attr('index');
    layLAYER.open({
        area: popl_area,
        title: '上线新设备',
        shade: 0.1,
        shadeClose: true,
        btn: ['确认','取消'],
        btn1: usrClickOnline_sumbit,
        btn2: usrPoplExit,
        content: `<div class="popl-devinfo">
        <form class="layui-form layui-form-pane" lay-filter="popl-online">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">当前工作表</label>
                    <div class="layui-input-inline">
                        <input type="text" name="sheet" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.sheet}">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">行号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="index" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.index}">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">系统UID</label>
                <div class="layui-input-block">
                    <input type="text" name="devi" autocomplete="off" class="layui-input" readonly="readonly" value="*自动生成">
                </div>
            </div>
            <div class="popl-usredit">
                <div class="layui-form-item">
                    <label class="layui-form-label">设备来源</label>
                    <div class="layui-input-inline">
                        <select>
                            <option value="1" selected>设备库存清单</option>
                        </select>
                    </div>
                    <div class="layui-input-inline">
                        <input type="text" autocomplete="off" class="layui-input" id="newpopl-findinput" placeholder="关键字...">
                    </div>
                    <div class="layui-input-inline"> 
                        <button type="button" class="layui-btn layui-btn-primary" id="newpopl-findbtn"><i class="layui-icon layui-icon-search"></i> 搜索</button>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备类型</label>
                    <div class="layui-input-block">
                        <input type="text" name="model" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备IP</label>
                    <div class="layui-input-block">
                        <input type="text" name="ip" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备固资</label>
                    <div class="layui-input-block">
                        <input type="text" name="assets" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">SN码</label>
                    <div class="layui-input-block">
                        <input type="text" name="sn" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">设备位置一</label>
                        <div class="layui-input-inline">
                            <input type="text" name="loca1" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">设备位置二</label>
                        <div class="layui-input-inline">
                            <input type="text" name="loca2" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">备注说明</label>
                    <div class="layui-input-block">
                        <input type="text" name="mark" autocomplete="off" class="layui-input">
                    </div>
                </div>
            </div>
        </form>
    </div>`
    });
    $('.popl-usredit input').css('background-color', '#ffffff');
    layFORM.render(null, 'popl-online');
    $('#newpopl-findbtn').click(usrClickOnline_find);
}
function usrClickOnline_find(){
    let usrin = $('#newpopl-findinput').val();
    let hasfindsel = $('#newpopl-findsel').length > 0;
    if(hasfindsel){
        $(this).html('<i class="layui-icon layui-icon-search"></i> 搜索');
        $('#newpopl-findsel').remove();
        return 0;
    }
    if(usrin.length < 2){
        alert('请至少输入个两个字符');
        return 0;
    }
    var loadq = layLAYER.load(0);
    var thisbtn = $(this);
    $.post('/ms/deva/usrfind/', {usrin:usrin}, function(data){
        layLAYER.close(loadq);
        if(data.length == 0){
            alert('未找到相匹配的对象');
        }else if(data.length == 1){
            newpopl_findfiller(data[0]);
        }else{
            thisbtn.html('取消');
            $('.popl-devinfo').append(`<div id="newpopl-findsel"><table id="layuitable"></table></div>`);
            layui.table.render({
                elem:'#layuitable',
                height: '#newpopl-findsel-0',
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
                newpopl_findfiller(data);
                $('#newpopl-findsel').remove();
                thisbtn.html('<i class="layui-icon layui-icon-search"></i> 搜索');
            });
        }
    });
}

function usrClickOnline_sumbit(index, layero, that){
    var ntline = {};
    for(const key of ['devi', 'sheet', 'index', 'loca1', 'loca2', 'model', 'name', 'ip', 'assets', 'sn', 'mark']){
        ntline[key] = $(`.popl-devinfo input[name="${key}"]`).val();
    }
    ntline['opty'] = 'on';
    conf_usroperate(ntline);
    usrPoplExit(index, layero, that);
}

function usrClickOffline(){
    var devi = $(this).attr('devi');
    var ntline = devi_mapping(devi);
    ntline['opty'] = 'off';
    conf_usroperate(ntline);
}
function usrClickMove1(){
    let hasmovebar = $('.sheet .movebar2').length > 0;
    $('.ntevent').remove();
    if(!hasmovebar){
        var devi = $(this).attr('devi');
        var ntline = devi_mapping(devi);
        ntline['opty']  = 'move';
        layLAYER.msg('已选择 '+ntline.name);
        $('.sheet .sheet-body').each(function(){
            let isfindtab = $(this).parents('.sheet-idlayer').attr('id') == 's999';
            if(isfindtab){ return 0; }
            $(this).prepend('<div class="movebar2 ntevent" index="1">1 +</div>');
            var i = 2;
            $(this).find('ul').each(function(){
                $(this).after(`<div class="movebar2 ntevent" index="${i}">${i} +</div>`);
                $(this).append(`<div class="replasebar_m ntevent" devi="${$(this).attr('devi')}"><</div>`);
                i ++;
            });
        });
        $('.sheet-body .movebar2').on('click', function(){
            usrClickMove2(devi);  
        });
        $('.sheet-body .replasebar_m').on('click', function(){
            usrClickReplase();  
        });
    }
}
function usrClickMove2(devi){
    let index = $(this).attr('index');
    let ntline = devi_mapping_2(devi);
    let sheet = SHEETCACHE_LIST[$('.sheet-bar .layui-this').attr('lay-id')];
    ntline['opty'] = {'sheet':sheet, 'index':index};
    conf_usroperate(ntline);
    $('.ntevent').remove();
    $('.layui-show .sheet-body ul').each(function(){
        $(this).append(`<div class="movebar ntevent" devi="${$(this).attr('devi')}"><</div>`);
    });
    $('.sheet-body .movebar').click(usrClickMove1);
}
function usrClickReplase(){
    alert('替换按钮')
}



function usrClickRow(){
    var devinfo = {};
    var devi = ($(this).attr('devi'));
    datas = SHEETCACHE_DATA[$('.sheet-bar .layui-this').attr('lay-id')];
    for(i in datas){
        let line = datas[i];
        if(devi == line['devi']){
            devinfo = line;
            break;
        }
    }
    var popl_area = ['850px', '640px'];
    if(window.innerHeight < 700){
        popl_area = ['700px', '520px'];
    }
    layLAYER.open({
        area: popl_area,
        title: devinfo.name,
        shade: 0.1,
        btn: '取消',
        btn1: usrPoplExit,
        content: `<div class="popl-devinfo">
        <form class="layui-form layui-form-pane" action="">
            <div class="layui-form-item">
                <div class="layui-inline">
                    <label class="layui-form-label">所在工作表</label>
                    <div class="layui-input-inline">
                        <input type="text" name="sheet" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.sheet}">
                    </div>
                </div>
                <div class="layui-inline">
                    <label class="layui-form-label">行号</label>
                    <div class="layui-input-inline">
                        <input type="text" name="index" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.index}">
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">系统UID</label>
                <div class="layui-input-block">
                    <input type="text" name="devi" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.devi}">
                </div>
            </div>
            <div class="popl-usredit">
                <div class="layui-form-item">
                    <label class="layui-form-label">设备名称</label>
                    <div class="layui-input-block">
                        <input type="text" name="name" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.name}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备类型</label>
                    <div class="layui-input-block">
                        <input type="text" name="model" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.model}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备IP</label>
                    <div class="layui-input-block">
                        <input type="text" name="ip" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.ip}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">设备固资</label>
                    <div class="layui-input-block">
                        <input type="text" name="assets" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.assets}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">SN码</label>
                    <div class="layui-input-block">
                        <input type="text" name="sn" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.sn}">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <label class="layui-form-label">设备位置一</label>
                        <div class="layui-input-inline">
                            <input type="text" name="loca1" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.loca1}">
                        </div>
                    </div>
                    <div class="layui-inline">
                        <label class="layui-form-label">设备位置二</label>
                        <div class="layui-input-inline">
                            <input type="text" name="loca2" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.loca2}">
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">备注说明</label>
                    <div class="layui-input-block">
                        <input type="text" name="mark" autocomplete="off" class="layui-input" readonly="readonly" value="${devinfo.mark}">
                    </div>
                </div>
            </div>
            <div class="layui-form-item popl-usrbtns">
                <button type="button" class="layui-btn layui-btn-primary" onclick="usrPoplEdit()">直接编辑</button>
            </div>
        </form>
    </div>`
    });
}

function usrPoplExit(index, layero, that){
    if(that.config.ntbtnflag){
        SEDMVCACHE = {};
    }
    layLAYER.close(index);
}
function usrPoplEdit(){
    if(!USRST_TAB_edit){
        alert('直接编辑用于修改错误的记录,不会同步数据');
        USRST_TAB_edit = true;
    }
    $('.popl-usredit input').removeAttr('readonly');
    $('.popl-usredit input').css('background-color', '#ffffff');
    $('.layui-layer .popl-usrbtns').html('<button type="button" class="layui-btn">提交修改</button>');
    $('.popl-usrbtns button').click(usrPoplEdit_sumbit);
}
function usrPoplEdit_sumbit(){
    var line = {};
    for(const key of ['devi', 'sheet', 'loca1', 'loca2', 'model', 'name', 'ip', 'assets', 'sn', 'mark']){
        line[key] = $(`.popl-devinfo input[name="${key}"]`).val();
    }
    $.post('/ms/devl/direct/', {data:JSON.stringify(line)}, function(data){
        if(data){
            location.reload();

            // layLAYER.closeAll('page');
        }else{
            alert('修改失败');
        }
    });
}



function usrSelTable(){
    let sheet_id = $(this).attr('name');
    layELEMENT.tabDelete('sheet-tab', sheet_id);
    var loadq = layLAYER.load(0);
    $.post('/ms/devl/sheet/', {sheet_name:SHEETCACHE_LIST[sheet_id]}, function(data){
        layLAYER.close(loadq);
        let sheet_data = data['osheet'];
        table_render(sheet_id, sheet_data);
    });
}



Init();
$(document).ready(function(){
    $(".toggle").click(usrToggle);
    $('.rightcard #online').click(usrNtbtnOnline);
    $('.rightcard #offline').click(usrNtbtnOffline);
    $('.rightcard #move').click(usrNtbtnMove);
    $('#usrfind-sumbit').click(usrFind_sumbit);
    $('#usrfind-input').keydown(function(event){
        if(event.which == 13){
            usrFind_sumbit();
        }
    });
});
