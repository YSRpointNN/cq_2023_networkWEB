
def mail_sender(email_to, email_cc, html_egg, title):
    import smtplib
    from email.mime.text import MIMEText
    from email.header import Header

    sender = 'PCQ_MIS_AIOps@pegatroncorp.com'
    receivers = email_to + email_cc
    
    message = MIMEText(html_egg, 'html', 'utf-8')
    subject = title
    message['Subject'] = Header(subject, 'utf-8')
    msg_to = ''
    msg_cc = ''
    for i in email_to:
        msg_to += i + ';'
    for i in email_cc:
        msg_cc += i + ';'
    message['To'] = Header(msg_to)
    message['Cc'] = Header(msg_cc)

    try:
        smtpobj = smtplib.SMTP('relay.cq.pegatroncorp.com')
        smtpobj.sendmail(sender, receivers, message.as_string())
        return True
    except smtplib.SMTPException:
        return False



def sedmv_mail(data):
    import time
    html_time = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    html_trs = ''
    for index in data:
        l = data[index]
        html_trs += f'''<tr>
                <td>{l['assets']}</td>
                <td>{l['sn']}</td>
                <td>{l['type']}</td>
                <td>{l['model']}</td>
                <td>{l['sedmvowner']}</td>
                <td>{l['name']}</td>
                <td>{l['ip']}</td>
                <td>{l['loca2']}</td>
                <td>{l['sedmvloca']}</td>
                <td>{l['sedmvdate']}</td>
                <td>{l['sedmvopter']}</td>
                <td>{l['sedmvmark']}</td>
            </tr>'''

    html_all = '''<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Mail</title>
    <style>
        h1{
            height: 40px;
            width: 100%;
            font-size: 26px;
            text-align: center;
            color: #777777;
        }
        p{
            width: 100%;
            padding: 10px;
            font-size: 16px;
            border: #777777 1px dashed;
        }
        span{
            color: #006eff;
            font-weight: bold;
        }
        table{
            width: 100%;
            border: #777777 1px solid;
            border-collapse: collapse;
        }
        th{
            padding: 4px;
            background-color: #ffff7e;
            border: #777777 1px solid;
        }
        td{
            padding: 4px;
            border: #777777 1px solid;
        }
    </style>
    </head>
    <body>
        <h1>固資異動-系統郵件</h1>
        <p>
            '''+ html_time +''' :<br>
            今日新增<span>固資異動記錄</span>如下,請知悉,謝謝~
        </p>
        <table>
            <tr>
                <th>固資</th>
                <th>SN</th>
                <th>設備類型</th>
                <th>設備型號</th>
                <th>保管人</th>
                <th>設備名稱(Hostname)</th>
                <th>IP</th>
                <th>原位置</th>
                <th>變更位置</th>
                <th>變更時間</th>
                <th>處理人員</th>
                <th>備註</th>
            </tr>
            <!-- VVV -->

            '''+ html_trs + '''

            <!-- AAA -->
        </table>
    </body>
    </html>'''
    S_F = mail_sender(['Ruihan_Yang@intra.pegatroncorp.com'],['Ruihan_Yang@intra.pegatroncorp.com'],html_all,f'固資異動--{html_time}')
    if S_F:
        pass
    else:
        pass
