import openpyxl
import time, random


def spawnSID(numb:int):
    # t = time.strftime('%Y%m', time.localtime())[2:]
    t = '2308'
    n = str(numb).rjust(5, '0')[:-1]
    endnumb = numb % 100
    ten = endnumb // 26
    bit = endnumb % 26
    e = chr(ten + 65) + chr(bit + 65)
    r = chr(random.randint(65, 90))
    return t + n + r + e


wsName = 'SMT SE'
wsTH = ('SUID', '位置一', '位置二', '设备类型', '设备名称', '设备IP', '固资', 'SN', '备注说明')

newWB = openpyxl.load_workbook('E:/MyCode/networkWeb/device_list.xlsx')
sourceWB = openpyxl.load_workbook('C:/Users/ruihan_yang/Desktop/device_source.xlsx')

SIDnumb = 926
sourceWS = sourceWB[wsName]
newWS = newWB[wsName]

newWS.append(wsTH)
for line in sourceWS.values:
    if line.count(None) > 7:
        print(line)
    else:
        if None in line or '無' in line:
            line = ['/' if x == None or x == '無' else x for x in line]
            tonew_line = (spawnSID(SIDnumb), line[1], line[2], line[3], line[4], line[5], line[6], line[7], line[11])
        else:
            tonew_line = (spawnSID(SIDnumb), line[1], line[2], line[3], line[4], line[5], line[6], line[7], line[11])
        newWS.append(tonew_line)
        SIDnumb += 1

newWS.delete_rows(2)
newWB.save('device_list.xlsx')
print(SIDnumb)
