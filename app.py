from flask import Flask
from flask import render_template, redirect, request, session, jsonify
from functools import wraps
import hashlib, base64, json
from scripts import excRPC, emaRPC



app = Flask(__name__)

app.jinja_env.variable_start_string = '(/'  # 修改变量开始符号
app.jinja_env.variable_end_string = '/)'

# =================================================================================================
# 基本
def DEC_Login(func):
    @wraps(func)
    def decreel(*args, **kwargs):
        auth = session.get('auth')
        if auth == 'PASS':
            return func(*args, **kwargs)
        else:
            return redirect('/refuse')
    return decreel

@app.route('/')
@app.route('/login/', methods = ['GET','POST'])
def Login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username == '38d180985d1b2e7a6014190e2cbd3c967408837188354ec93d27bfd86d09a017' and password == '09a7bc494bb0905b53fc1dd3869ec566192552e688b240d62051cdc078c45154':
            session['usr'] = username
            session['auth'] = 'PASS'
            return redirect('/ms/')
    return render_template('base/login.html')

@app.route('/refuse/')
def Refuse():
    return render_template('base/refuse.html')

@app.route('/ms/')
@DEC_Login
def Master():
    # http://127.0.0.1:6651/ms/?guide=Hello
    guide = request.args.get('guide')
    if not guide:
        return render_template('base/master.html')
    else:
        return render_template('base/master.html')

@app.route('/static/<path:filename>')
def Static(filename):
    return send_from_directory('static', filename, max_age=5)
# ======================================================================================================

# ----------------------------------------------------------------------------------------------------- V
@app.route('/user/amluZ3VhbmdmYQ/')
def rp_User():
    return render_template('base/user.html')
# ----------------------------------------------------------------------------------------------------- A



# devl
# ----------------------------------------------------------------------------------------------------- V
@app.route('/ms/devl/')
@DEC_Login
def rp_Devl():
    return render_template('devl/devl.html')

@app.route('/ms/devl/sheet/', methods=['POST'])
@DEC_Login
def reb_devl_sheet():
    sheet_name = request.form.get('sheet_name')
    redata, sheet_list = excRPC.devl_ret(sheet_name)
    return jsonify({'osheet':redata, 'sheet_list':sheet_list})

@app.route('/ms/devl/findall/', methods=['POST'])
@DEC_Login
def reb_devl_find():
    usrin = request.form.get('usrin')
    redata = excRPC.devl_usrfind(usrin.strip())
    return jsonify(redata)

@app.route('/ms/devl/direct/', methods=['POST'])
@DEC_Login
def reb_devl_direct():
    l = json.loads(request.form.get('data'))
    tolist = (l['devi'], l['loca1'], l['loca2'], l['model'], l['name'], l['ip'], l['assets'], l['sn'], l['mark'])
    reft = excRPC.GEN_edit(r'./ExcelBase/device_list.xlsx', tolist)
    return jsonify(reft)

@app.route('/ms/devl/operate/<opty>/', methods=['POST'])
@DEC_Login
def reb_operates(opty):
    data = json.loads(request.form.get('data'))
    if opty == 'online':
        excRPC.devl_append(data)
    elif opty == 'offline':
        excRPC.GEN_delete(r'./ExcelBase/device_list.xlsx', data)
    return '/'
# ----------------------------------------------------------------------------------------------------- A



# devm
# ----------------------------------------------------------------------------------------------------- V
@app.route('/ms/devm/', methods=['GET', 'POST'])
@DEC_Login
def rp_Devm():
    if request.method == 'POST':
        data = request.form.get('data')
        if data:
            return render_template('devl/devm.html', ssc = data)
    return render_template('devl/devm.html', ssc = None)

@app.route('/ms/devm/sheet/', methods=['POST'])
@DEC_Login
def reb_devm_sheet():
    date = request.form.get('date')
    redata = excRPC.devm_ret(date)
    return jsonify(redata)

@app.route('/ms/devm/finddeva/', methods=['POST'])
def reb_devm_finddeva():
    devis =  json.loads(request.form.get('devis'))
    redata = {}
    for i in devis:
        index, line = excRPC.deva_uidfind(i)
        redata[i] = line
    return jsonify(redata)

@app.route('/ms/devm/finddeva2/', methods=['POST'])
def reb_devm_finddeva2():
    asset =  request.form.get('asset')
    index, line = excRPC.deva_assetfind(asset)
    return jsonify(line)

@app.route('/ms/devm/sedmv/', methods=['POST'])
@DEC_Login
def reb_devm_sedmv():
    data = json.loads(request.form.get('data'))
    sf_esc = excRPC.devm_append(data)
    if sf_esc:
        emaRPC.sedmv_mail(data)
        return jsonify(True)
    return jsonify(False)

@app.route('/ms/devm/direct/', methods=['POST'])
@DEC_Login
def reb_devm_direct():
    l = json.loads(request.form.get('data'))
    tolist = (l['devi'], l['assets'], l['sn'], l['type'], l['model'], l['owner'], l['name'], l['ip'], l['locas'], l['locan'], l['timebar'], l['opter'], l['mark'])
    reft = excRPC.GEN_edit(r'./ExcelBase/device_move.xlsx', tolist)
    return jsonify(reft)

@app.route('/ms/devm/delete/', methods=['POST'])
@DEC_Login
def reb_devm_delete():
    indexs = ['']
    indexs[0] = request.form.get('index')
    excRPC.GEN_delete(r'./ExcelBase/device_move.xlsx', indexs)
    return '/'
# ----------------------------------------------------------------------------------------------------- A



# ----------------------------------------------------------------------------------------------------- V
@app.route('/ms/deva/')
@DEC_Login
def rp_Deva():
    return render_template('devl/deva.html')

@app.route('/ms/deva/sheet/', methods=['POST'])
@DEC_Login
def reb_deva_table():
    reb = excRPC.deva_ret()
    return jsonify(reb)

@app.route('/ms/deva/usrfind/', methods=['POST'])
@DEC_Login
def reb_deva_find():
    usrin =  request.form.get('usrin')
    redata = excRPC.deva_usrfind(usrin.strip())
    return jsonify(redata)
# ----------------------------------------------------------------------------------------------------- A



# ----------------------------------------------------------------------------------------------------- V
@app.route('/ms/mg-server/')
@DEC_Login
def rp_MGServer():
    return render_template('management/server.html')

@app.route('/ms/mg-server/details/<devi>/')
@DEC_Login
def rp_mgserver_details(devi):
    return render_template('management/server.html')
# ----------------------------------------------------------------------------------------------------- A


app.secret_key = 'JINguangfa1080p'
app.run(port=6651, debug=True)
