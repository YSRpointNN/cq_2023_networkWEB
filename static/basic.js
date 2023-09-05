PATHTABLE = {
    '产线网络相关信息': 'PD_info',
    'OA网络相关信息': 'OA_info',
    '特殊设备信息': 'other_info',
    '各项信息记录': 'table_info',
    '服务器': 'Server',
    '交换机': 'Switch',
    '无线AP': 'AP',
    'UPS': 'UPS',
    '防火墙': 'FireWall',
    '设备监控清单': 'device_list',
    '固资异动记录': 'asset_move'
}

function hsR(){
    name_self = $(this).text();
    name_father = ($(this).parent().children().first()).text();
    path = `/${PATHTABLE[name_self]}/${PATHTABLE[name_father]}/`
    $("#hspage").css("display", "none");
    $("#hspage").attr("src", path);
    $("#hspage").fadeIn();
}

function to_assetsmoveAPI(){
    alert();
}


$(document).ready(function(){
    $(".menu_index").click(hsR);
});
