var layTABLE = layui.table;
var layLAYER = layui.layer;
var layFORM = layui.form;


var TABLEOB = null;
var TABLE_SOUCOL = [];
var TABLE_COLSET = [[
    { field: 'index', title: '行', sort:true, minWidth:70, width: 70},
    { field: 'assets', title: '固资' },
    { field: 'sn', title: 'SN' },
    { field: 'type', title: '类型' },
    { field: 'model', title: '品名' },
    { field: 'owner', title: '保管人' },
    { field: 'hook', title: '挂账部门' }
]];


function Init(){
    layLAYER.config({
        skin:'layui-layer-win10',
    });
    TABLEOB = layTABLE.render({
        id:'main-table',
        elem: '#main-table',
        height: '#block-table-0',
        page: {
            layout: ['prev', 'page', 'next', 'skip', 'count'],
            theme: '#45a1bd',
            groups: 7,
            limit: 15,
          },
        cellMinWidth: 160,
        cols: TABLE_COLSET,
        data: [],
    });

    $.post('/ms/deva/sheet/', function(data){
        line = data[0];
        for (i in line){
            TABLE_SOUCOL.push(line[i]);
        }
        data.shift();
        table_update(data);
    });
}

function table_update(idata){
    TABLEOB.reload({
        cols:TABLE_COLSET,
        data:idata,
    },false);
}

function btns_desc01_in(){
    switch ($(this).attr('id')){
        case '0101': $('#btns-g01 .btns-desc').html('设置表格每页所显示的行数');break;
        case '0102': $('#btns-g01 .btns-desc').html('从后台表格的列里选择要显示出来的列');break;
        case '0103': $('#btns-g01 .btns-desc').html('( 注意 ! ) 管理表格的列,影响后台数据,删除列的同时会失去整列的数据'); break;
        case '0104': $('#btns-g01 .btns-desc').html('直接编辑表格'); break;
    }
}
function btns_desc01_out(){
    $('#btns-g01 .btns-desc').html('......');
}


function usrClickBtns_pageline(){
    layLAYER.prompt({
        title:'设置每页显示的行数',
        formType: 3,
    }, 
    function (usrin, index) {
        layLAYER.close(index);
        if (/^\d+$/.test(usrin)){
            TABLEOB.reload({
                page: {
                    layout: ['prev', 'page', 'next', 'skip', 'count'],
                    theme: '#45a1bd',
                    groups: 7,
                    limit: +usrin,
                },
            });
        }else{
            layLAYER.msg('设置失败');
        }
    });
}

function usrClickBtns_showcol(){
    let tohtml = '';
    for(i of TABLE_SOUCOL){
        tohtml += `
            <input type="checkbox" title="${i}" checked>
        `
    }
    layLAYER.open({
        title: '勾选要显示的列',
        type: 1,
        area: ['800px', '600px'],
        btn: ['确定', '取消'],
        btn1: usrClickBtns_showcol_sumbit,
        btn2: function(){ return true },
        content: '<div class="layui-form popl-showcol">'+tohtml+'</div>',
    });
    layFORM.render();
}

function usrClickBtns_showcol_sumbit(index, layero, that){
    layLAYER.close(index);
}

$(document).ready(function(){
    $('#btns-g01 button').hover(btns_desc01_in, btns_desc01_out);
    $('#btns-g01 #0101').click(usrClickBtns_pageline);
    $('#btns-g01 #0102').click(usrClickBtns_showcol);
    Init();
});