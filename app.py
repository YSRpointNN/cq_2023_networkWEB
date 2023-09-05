from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
import json, openpyxl

app = Flask(__name__)

DEVICE_SHEET_LIST = ['sheet']

# ======================================================================================================== #
# ======================================================================================================== #
# font-family: 'Microsoft JhengHei UI', Arial;
# #76a797

# json更新函数  通用
def json_update(path:str, data:dict):
    with open(path, 'r', encoding='utf-8') as f:
        old_data = json.load(f)
    with open(path, 'w', encoding='utf-8') as f:
        old_data.update(data)
        json.dump(old_data, f, ensure_ascii=False, indent=4)


# excel根据uid查找行坐标  通用
def exc_find_uid(find_uid:str, sheet_name = '') -> int:
    sourceWB = openpyxl.load_workbook('device_list.xlsx', read_only=True)
    findrb = None
    if sheet_name:
        staticWS = sourceWB[sheet_name]
        for line in staticWS.iter_rows(min_row=0):
            if line[0].value == find_uid:
                findrb = line[0].row
                return findrb
    else:
        for activ_name in DEVICE_SHEET_LIST:
            activWS = sourceWB[activ_name]
            for line in activWS.iter_rows(min_row=0):
                if line[0].value == find_uid:
                    findrb = line[0].row
                    return findrb, activ_name
    


# excel单个sheet查找 通用
def exc_find_withsheet(ws_name:str, col_i:int, find_val:str):
    sourceWB = openpyxl.load_workbook('device_list.xlsx', read_only=True)
    sourceWS = sourceWB[ws_name]
    retrun_info = list()
    for row in sourceWS.iter_rows(min_row=2, values_only=True):
        if row[col_i] == find_val:
            if retrun_info:
                return 'beyond'
            else:
                retrun_info = row
    if retrun_info:
        return retrun_info
    else:
        return 'not'



# ======================================================================================================== #
# Server页面  专用过程   页面加载时调用
# 从json文件读取
def ServerShowData(data_type):
    redata = dict()
    addstatus = dict()
    with open('./static/des_server/group_list_pdl.json', 'r', encoding='utf-8') as f:
        group_data = json.load(f)
    with open('./static/des_server/info_pdl.json', 'r', encoding='utf-8') as f:
        info_data = json.load(f)
    group_uid_list = list()
    for group_name in group_data:
        single = dict()
        addstatus[group_name] = 0
        group_list = group_data[group_name]
        group_uid_list.extend(group_list)
        for uid in group_list:
            info_line = info_data[uid]
            single[uid] = {'name':info_line['name'], 'ip':info_line['ip'], 'location':info_line['location'], 'assets':info_line['assets'], 'model':info_line['model'], 'status':info_line['status']}
            if info_line['status'] in (1, 2):
                addstatus[group_name] = info_line['status']
        redata[group_name] = single

    lost_uid_list = list()
    pdl_uid_list = info_data.keys()
    for pdl_uid in pdl_uid_list:
        if pdl_uid in group_uid_list:
            pass
        else:
            lost_uid_list.append(pdl_uid)
    if lost_uid_list:
        try:
            group_data.update({'Default':group_data['Default'] + lost_uid_list})
        except KeyError:
            ServerNewGroup('1', 'Default')
            with open('./static/des_server/group_list_pdl.json', 'r', encoding='utf-8') as f:
                group_data = json.load(f)
            group_data.update({'Default':lost_uid_list})
        with open('./static/des_server/group_list_pdl.json', 'w', encoding='utf-8') as f:
            json.dump(group_data, f, ensure_ascii=False, indent=4)
    return redata, addstatus

# Server页面  专用过程  新建组
# 在group_list.json文件增加一个{group_name(传入):[(空list)]}
def ServerNewGroup(data_type, group_name):
    with open('./static/des_server/group_list_pdl.json', 'r', encoding='utf-8') as f:
        old_data = json.load(f)
    if group_name in old_data:
        pass
    else:
        old_data[group_name] = list()
        with open('./static/des_server/group_list_pdl.json', 'w', encoding='utf-8') as f:
            json.dump(old_data, f, ensure_ascii=False, indent=4)

# Server页面  专用过程  删除组
# 在group_list.json文件删除整个{group_name(传入):[device_uid...]}
def ServerDelGroup(data_type, group_name):
    with open('./static/des_server/group_list_pdl.json', 'r', encoding='utf-8') as f:
        old_data = json.load(f)
    if group_name in old_data:
        del old_data[group_name]
        with open('./static/des_server/group_list_pdl.json', 'w', encoding='utf-8') as f:
            json.dump(old_data, f, ensure_ascii=False, indent=4)
    else:
        pass

# Server页面  专用过程  新增一台服务器
# 直接利用json更新函数更新info.json文件,然后更新group_list.json文件
def JsonUpdate_new_server(data:dict, group:str):
    json_update('./static/des_server/info_pdl.json', data)
    with open('./static/des_server/group_list_pdl.json', 'r', encoding='utf-8') as f:
        old_data = json.load(f)
    old_data[group].append(next(iter(data)))
    with open('./static/des_server/group_list_pdl.json', 'w', encoding='utf-8') as f:
        json.dump(old_data, f, ensure_ascii=False, indent=4)
# ======================================================================================================== #



# ======================================================================================================== #



# ======================================================================================================== #
@app.route('/')
def MasterTEM():
    return render_template('master.html')

@app.route('/static_file/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename, max_age=5)
# ----------------------------------------------------------------------------------------- server V
@app.route('/Server/<tem_type>/')
def sp_ServerTEM(tem_type):
    if tem_type == 'PD_info':
        to_html_title = '产线服务器'
    else:
        to_html_title = 'OA服务器'
    to_html_data, to_html_status = ServerShowData(tem_type)
    return render_template('sp_server.html', data=to_html_data, status_list=to_html_status, title=to_html_title)

@app.route('/Server/Opgroup/<n_or_d>/<group_name>/')
def res_ServerGroupOpt(n_or_d, group_name):
    if n_or_d == 'new':
        ServerNewGroup('1', group_name)
    elif n_or_d == 'del':
        ServerDelGroup('1', group_name)
    return '/'

@app.route('/Server/Revisegroup/', methods=['POST'])
def res_ServerGroupUpdate():
    old_uid = request.form.get('uid')
    new_group = request.form.get('group')
    with open('static/des_server/group_list_pdl.json', 'r', encoding='utf-8') as f:
        revi_data = json.load(f)
    for group_name in revi_data:
        if old_uid in revi_data[group_name]:
            revi_data[group_name].remove(old_uid)
    revi_data[new_group].append(old_uid)
    with open('static/des_server/group_list_pdl.json', 'w', encoding='utf-8') as f:
        json.dump(revi_data, f, ensure_ascii=False, indent=4)
    return '/'

@app.route('/Server/Updateinfo/', methods=['POST'])
def res_ServerInfoUpdate():
    newinfo = json.loads(request.form.get('data'))
    json_update('static/des_server/info_pdl.json', newinfo)
    return '/'

@app.route('/Server/Newserver/', methods=['POST'])
def res_Newserver():
    new_line_data = json.loads(request.form.get('data'))
    device_uid = request.form.get('uid')
    group = request.form.get('group')
    JsonUpdate_new_server({device_uid:new_line_data}, group)
    return '/'

@app.route('/Server/Serverfind/', methods=['POST'])
def res_ServerFind():
    type_to_list = {'uid':0, 'name':4, 'ip':5, 'assets':6, 'sn':7}
    input_type = request.form.get('type')
    input_val = request.form.get('input')
    sheet_name_list = ('DL2核心及Server', 'OQC&DL1核心及Server', 'SMT BL')
    for sheet_name in sheet_name_list:
        i = exc_find_withsheet(sheet_name, type_to_list[input_type], input_val)
        if isinstance(i, tuple):
            redata = {'uid':i[0], 'location':i[2], 'model':i[3], 'name':i[4], 'ip':i[5], 'assets':i[6], 'sn':i[7]}
            break
        elif i == 'beyond':
            redata = sheet_name + ' 表内有多个匹配项'
            break
        else:
            redata = f'未找到项目,请确认输入的项目类型是: {input_type}'
    return redata

@app.route('/Server/results/<toggle>/<device_uid>/')
def res_Serverresultstoggle(toggle, device_uid):
    status_val = 0
    if toggle == 'to_off':
        status_val = 3
    with open('static/des_server/info_pdl.json', 'r', encoding='utf-8') as f:
        old_data = json.load(f)
    old_data[device_uid].update({'status': status_val})
    with open('static/des_server/info_pdl.json', 'w', encoding='utf-8') as f:
        json.dump(old_data, f, ensure_ascii=False, indent=4)
    return '/'
# ----------------------------------------------------------------------------------------- server A





# ----------------------------------------------------------------------------------------- switch V
@app.route('/Switch/<tem_type>/')
def sp_SwitchTEM(tem_type):
    if tem_type == 'PD_info':
        to_html_title = '产线交换机'
    else:
        to_html_title = 'OA交换机'
    return render_template('sp_switch.html', title=to_html_title)
# ----------------------------------------------------------------------------------------- switch A





# ----------------------------------------------------------------------------------------- AP V
@app.route('/AP/<tem_type>/')
def sp_APTEM(tem_type):
    if tem_type == 'PD_info':
        to_html_title = '产线 AP信息'
    else:
        to_html_title = 'OA AP信息'
    return render_template('sp_AP.html', title=to_html_title)
# ----------------------------------------------------------------------------------------- AP A





# ======================================================================================================== #
@app.route('/device_list/table_info/')
def bp_devicelistTEM():
    global DEVICE_SHEET_LIST
    sourceWB = openpyxl.load_workbook('./device_list.xlsx', read_only=True)
    sourceWS = sourceWB['LAN(CORE SW)']
    DEVICE_SHEET_LIST = sourceWB.sheetnames
    return render_template('bp_devicelist.html', sheet_list = DEVICE_SHEET_LIST)
# ----------------------------------------------------------------------------------------- devicelist V
@app.route('/device_list/table_cache/', methods=['POST'])
def reb_devicelistTabCache():
    sourceWB = openpyxl.load_workbook('./device_list.xlsx', read_only=True)
    redata = dict()
    for sheet_name in DEVICE_SHEET_LIST:
        activ_table = list()
        sourceWS = sourceWB[sheet_name]
        for line in sourceWS.iter_rows(min_row=2, values_only=True):
            activ_table.append(line)
        redata[sheet_name] = activ_table
    sourceWB.close()
    return jsonify(redata)

@app.route('/device_list/sheet_rename/', methods=['POST'])
def reb_devicelistRenameSheet():
    old_name = request.form.get('old_name')
    new_name = request.form.get('new_name')
    sourceWB = openpyxl.load_workbook('./device_list.xlsx', read_only=False)
    revise_sheet = sourceWB[old_name]
    revise_sheet.title = new_name
    sourceWB.save('./device_list.xlsx')
    sourceWB.close()
    return '/'

@app.route('/device_list/sheet_newdef/')
def reb_devicelistNewSheet():
    sourceWB = openpyxl.load_workbook('./device_list.xlsx', read_only=False)
    sourceWB.create_sheet(title='NewSheet')
    sourceWB.save('./device_list.xlsx')
    sourceWB.close()
    return '/'

@app.route('/device_list/xls_revise/', methods=['POST'])
def reb_devicelistUpdateXls():
    j = json.loads(request.form.get('str_data'))
    targ_uid = j['device_uid']
    sheet = j['sheet']
    targ_line = exc_find_uid(targ_uid, sheet)
    sourceWB = openpyxl.load_workbook('device_list.xlsx', read_only=False)
    sourceWS = sourceWB[sheet]
    data_list = [targ_uid, j['location1'], j['location2'], j['model'], j['name'], j['ip'], j['assets'], j['sn'], j['remark']]
    for i, item in enumerate(data_list, start=1):
        sourceWS.cell(row=targ_line, column=i, value=item)
    sourceWB.save('device_list.xlsx')
    sourceWB.close()
    return '/'

# 设备监控清单增加一行接口{str_data:{'device_uid':, 'location1':,...}, sheet_name:, targ_uid:,}
@app.route('/device_list/xls_add/', methods=['POST'])
def reb_devicelistNewXls():
    j = json.loads(request.form.get('str_data'))
    sheet_name = request.form.get('sheet_name')
    targ_uid = request.form.get('targ_uid')
    sourceWB = openpyxl.load_workbook('device_list.xlsx', read_only=False)
    sourceWS = sourceWB[sheet_name]
    data_list = ['testuid', j['location1'], j['location2'], j['model'], j['name'], j['ip'], j['assets'], j['sn'], j['remark']]
    if len(targ_uid) <= 5:
        sourceWS.append(data_list)
    else:
        targ_row = exc_find_uid(targ_uid, sheet_name)
        sourceWS.insert_rows(targ_row, 1)
        for i, item in enumerate(data_list, start=1):
            sourceWS.cell(row=targ_row, column=i, value=item)
    sourceWB.save('device_list.xlsx')
    sourceWB.close()
    return '/'

# 设备监控清单删除一行接口{'device_uid':str}
@app.route('/device_list/xls_delete/', methods=['POST'])
def reb_devicelistDelXls():
    targ_uid = request.form.get('device_uid')
    sourceWB = openpyxl.load_workbook('device_list.xlsx', read_only=False)
    targ_row, targ_sheet = exc_find_uid(targ_uid)
    sourceWS = sourceWB[targ_sheet]
    sourceWS.delete_rows(targ_row)
    sourceWB.save('device_list.xlsx')
    sourceWB.close()
    return '/'

# 设备监控清单关键字搜索{'find_some':str};
@app.route('/device_list/xls_find/<buffmod>', methods=['POST'])
def reb_devicelist_find_fromxls(buffmod):
    usr_find = request.form.get('find_some')
    sourceWB = openpyxl.load_workbook('device_list.xlsx', read_only=True)
    sheet_list = sourceWB.sheetnames

    find_s_load = list()
    for sheet_name in sheet_list:
        sheet = sourceWB[sheet_name]
        for i, row in enumerate(sheet.iter_rows(values_only=True)):
            if usr_find in str(row):
                if buffmod == 'havebuff':
                    find_s_load.append({'sheet':sheet_name, 'index':i})
                else:
                    find_s_load.append({'device_uid':row[0], 'location1':row[1], 'location2':row[2], 'model':row[3], 'name':row[4], 'ip':row[5], 'assets':row[6], 'sn':row[7], 'remark':row[8]})
    return jsonify(find_s_load)
# ----------------------------------------------------------------------------------------- devicelist A



# ----------------------------------------------------------------------------------------- assetmove V
@app.route('/asset_move/table_info/')
def bp_assetmoveTEM():

    return render_template('bp_assetmove.html')

@app.route('/asset_move/send_API/', methods=['POST'])
def reb_assetmoveAPI():

    return render_template('bp_assetmove.html')
# ----------------------------------------------------------------------------------------- assetmove A



# ----------------------------------------------------------------------------------------- repairlogging V
@app.route('/repair_logging/table_info/')
def bp_repairloggingTEM():

    return render_template('bp_repairlogging.html')
# ----------------------------------------------------------------------------------------- repairlogging A
# ======================================================================================================== #

app.run(port=6651, debug = True)
