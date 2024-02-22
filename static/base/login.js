
function login_sumbit(event){
    event.preventDefault();
    let un_b64 = btoa(document.getElementById('login_un').value);
    let pw_b64 = btoa(document.getElementById('login_pw').value);
    document.getElementById('login_un').value = CryptoJS.SHA256(un_b64).toString();
    document.getElementById('login_pw').value = CryptoJS.SHA256(pw_b64).toString();
    this.submit();
}

document.getElementById("form1").addEventListener("submit", login_sumbit);
