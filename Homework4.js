/* 
 Name: Cinque Preston
 File: homework3.js
 Date Created: 2026-05-01
 Date Updated: 2026-05-04
 Purpose: Homework 4 java and cookie stuff
*/
 
// Error flags
var firstnameflag  = 1;
var middleflag     = 0;
var lastnameflag   = 1;
var addr1flag      = 1;
var password1flag  = 1;
var password2flag  = 1;
var error_flag     = 0;
 
// localStorage prefix and field lists 
var LS_PREFIX = "pmc_";
 
var PERSIST_FIELDS     = ["firstname","middleinit","lastname","DOB",
                          "addr1","addr2","city","state","zip",
                          "phone","email1","user","description","feeling"];
var PERSIST_CHECKBOXES = ["illness1","illness2","illness3","illness4","illnessOther"];
var PERSIST_RADIOS     = ["gender","medication","vaccination"];
 
 
// Date display
(function() {
    var days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    var d      = new Date();
    var date   = d.getDate();
    var suffix = (date===1||date===21||date===31) ? "st"
               : (date===2||date===22)            ? "nd"
               : (date===3||date===23)            ? "rd" : "th";
    document.getElementById("today").innerHTML =
        days[d.getDay()] + ", " + months[d.getMonth()] + " " + date + suffix + ", " + d.getFullYear();
})();
 
 
//  Cookie helpers 
function setCookie(name, value, hours) {
    var exp = new Date();
    exp.setTime(exp.getTime() + hours * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) +
                      "; expires=" + exp.toUTCString() + "; path=/";
}
 
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}
 
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}
 
 
// localStorage helpers 
function lsSave(key, val)   { localStorage.setItem(LS_PREFIX + key, val); }
function lsGet(key)         { return localStorage.getItem(LS_PREFIX + key); }
function lsRemove(key)      { localStorage.removeItem(LS_PREFIX + key); }
 
function saveField(id) {
    var el = document.getElementById(id);
    if (el) lsSave(id, el.value);
}
 
function saveCheckbox(id) {
    var el = document.getElementById(id);
    if (el) lsSave(id, el.checked ? "1" : "0");
}
 
function saveRadio(name) {
    var checked = document.querySelector('input[name="' + name + '"]:checked');
    lsSave("radio_" + name, checked ? checked.value : "");
}
 
function restoreFromLocalStorage() {
    PERSIST_FIELDS.forEach(function(id) {
        var val = lsGet(id);
        if (val !== null) {
            var el = document.getElementById(id);
            if (el) el.value = val;
        }
    });
 
    var feeling = document.getElementById("feeling");
    if (feeling) document.getElementById("urgencyValue").innerHTML = feeling.value;
 
    PERSIST_CHECKBOXES.forEach(function(id) {
        var val = lsGet(id);
        var el  = document.getElementById(id);
        if (val !== null && el) el.checked = (val === "1");
    });
 
    PERSIST_RADIOS.forEach(function(name) {
        var val = lsGet("radio_" + name);
        if (val) {
            var rb = document.querySelector('input[name="' + name + '"][value="' + val + '"]');
            if (rb) rb.checked = true;
        }
    });
}
 
function clearLocalStorage() {
    PERSIST_FIELDS.forEach(function(id)     { lsRemove(id); });
    PERSIST_CHECKBOXES.forEach(function(id) { lsRemove(id); });
    PERSIST_RADIOS.forEach(function(name)   { lsRemove("radio_" + name); });
}
 
 
// Field validators
function checkfirstname() {
    var val = document.getElementById("firstname").value;
    firstnameflag = 1;
    if (val.length < 2) {
        document.getElementById("name_message").innerHTML = "First name is too short.";
    } else if (!val.match(/^[a-zA-Z'-]+$/)) {
        document.getElementById("name_message").innerHTML = "First name contains invalid characters.";
    } else {
        document.getElementById("name_message").innerHTML = "";
        firstnameflag = 0;
        var remember = document.getElementById("rememberMe").checked;
        if (remember) setCookie("pmc_firstname", val, 48);
        saveField("firstname");
    }
    checkflags();
}
 
function checkmiddle() {
    var val = document.getElementById("middleinit").value;
    middleflag = 0;
    if (val.length > 0 && !val.match(/^[a-zA-Z]$/)) {
        document.getElementById("name_message").innerHTML = "Middle initial should be a single letter.";
        middleflag = 1;
    } else {
        document.getElementById("name_message").innerHTML = "";
        saveField("middleinit");
    }
    checkflags();
}
 
function checklastname() {
    var val = document.getElementById("lastname").value;
    lastnameflag = 1;
    if (val.length < 2) {
        document.getElementById("name_message").innerHTML = "Last name is too short.";
    } else if (!val.match(/^[a-zA-Z'-]+$/)) {
        document.getElementById("name_message").innerHTML = "Last name contains invalid characters.";
    } else {
        document.getElementById("name_message").innerHTML = "";
        lastnameflag = 0;
        saveField("lastname");
    }
    checkflags();
}
 
function checkaddr1() {
    var val = document.getElementById("addr1").value.trim();
    addr1flag = 1;
    if (val.length < 2) {
        document.getElementById("addr1_message").innerHTML = "Please enter a valid street address.";
    } else {
        document.getElementById("addr1_message").innerHTML = "";
        addr1flag = 0;
        saveField("addr1");
    }
    checkflags();
}
 
function checkaddr2() { saveField("addr2"); }
 
function checkcity() {
    var val = document.getElementById("city").value;
    if (val.match(/^[ a-zA-Z'-]+$/)) {
        document.getElementById("city_message").innerHTML = "";
        saveField("city");
    } else {
        document.getElementById("city_message").innerHTML = "City name contains invalid characters.";
    }
}
 
function checkstate() {
    var val = document.getElementById("state").value;
    if (val === "") {
        document.getElementById("state_message").innerHTML = "Please select a state.";
    } else {
        document.getElementById("state_message").innerHTML = "";
        saveField("state");
    }
}
 
 
// Password validators
function passwordentry() {
    var pw = document.getElementById("password1").value;
    password1flag = 0;
 
    var checks = [
        { test: /[a-z]/,                   pass: "Has a lowercase letter.",         fail: "Needs at least 1 lowercase letter.",  id: "password_message1" },
        { test: /[A-Z]/,                   pass: "Has an uppercase letter.",         fail: "Needs at least 1 uppercase letter.",  id: "password_message2" },
        { test: /[0-9]/,                   pass: "Has a number.",                    fail: "Needs at least 1 number.",            id: "password_message3" },
        { test: /[!\@#\$%&*\-_\\.+\(\)]/, pass: "Has a special character.",         fail: "Needs at least 1 special character.", id: "password_message4" }
    ];
 
    checks.forEach(function(rule) {
        if (rule.test.test(pw)) {
            document.getElementById(rule.id).innerHTML = rule.pass;
        } else {
            document.getElementById(rule.id).innerHTML = rule.fail;
            password1flag = 1;
        }
    });
 
    if (pw.length < 8) {
        document.getElementById("password_message5").innerHTML = "Password must be at least 8 characters.";
        password1flag = 1;
    } else {
        document.getElementById("password_message5").innerHTML = "Password length is good.";
    }
 
    checkflags();
}
 
function checkpassword2() {
    var pw1 = document.getElementById("password1").value;
    var pw2 = document.getElementById("password2").value;
    password2flag = 1;
    if (pw1 !== "" && pw1 === pw2) {
        document.getElementById("password2_text").innerHTML = "Passwords match!";
        password2flag = 0;
    } else {
        document.getElementById("password2_text").innerHTML = "Passwords do not match.";
    }
    checkflags();
}
 
 
// Phone formatter 
function fixphone() {
    var field  = document.getElementById("phone");
    var digits = field.value.replace(/\D/g, "").slice(0, 10);
    if (digits.length < 4)      field.value = digits;
    else if (digits.length < 7) field.value = "(" + digits.slice(0,3) + ") " + digits.slice(3);
    else                        field.value = "(" + digits.slice(0,3) + ") " + digits.slice(3,6) + "-" + digits.slice(6);
    saveField("phone");
}
 
 
// Submit gate 
function checkflags() {
    var allClear = (firstnameflag + middleflag + lastnameflag +
                    addr1flag + password1flag + password2flag) === 0;
    document.getElementById("submit").disabled = !allClear;
}
 
 
// Full form check on submit attempt 
function checkform() {
    error_flag = 0;
    checkfirstname();
    checkmiddle();
    checklastname();
    checkaddr1();
    checkaddr2();
    checkcity();
    checkstate();
    passwordentry();
    checkpassword2();
    if (error_flag) {
        alert("Please fix the errors shown on the form before submitting.");
    }
}
 
 
// Form data output table
function getdata1() {
    var form = document.getElementById("register");
    var rows = "";
    for (var i = 0; i < form.elements.length; i++) {
        var el   = form.elements[i];
        var type = el.type;
        var show = true;
        var displayVal = el.value;
 
        if (type === "checkbox" || type === "radio") {
            if (!el.checked) show = false;
            else displayVal = (type === "checkbox") ? "Checked" : el.value;
        }
        if (type === "password") displayVal = "••••••••";
 
        if (show) {
            rows += "<tr><td>" + el.name + "</td><td>" + type + "</td><td class='outputdata'>" + displayVal + "</td></tr>";
        }
    }
    document.getElementById("outputformdata").innerHTML =
        "<table class='output'><tr><th>Field</th><th>Type</th><th>Value</th></tr>" + rows + "</table>";
}
 
function removedata1() {
    document.getElementById("outputformdata").innerHTML = "(you cleared the output)";
}
 
 
// Welcome / cookie check 
function initWelcome() {
    var savedName = getCookie("pmc_firstname");
    if (savedName) {
        document.getElementById("welcome-msg").innerHTML =
            "Welcome back, <strong>" + savedName + "</strong>!";
        document.getElementById("not-you-link").innerHTML =
            '&nbsp;&nbsp;<a href="#" onclick="startNewUser(); return false;" style="color:rgb(162,255,144);">' +
            'Not ' + savedName + '? Click here to start as a new user.</a>';
        document.getElementById("firstname").value = savedName;
        restoreFromLocalStorage();
    } else {
        document.getElementById("welcome-msg").innerHTML =
            "Welcome, New User! Please fill out the form below.";
        document.getElementById("not-you-link").innerHTML = "";
    }
}
 
function startNewUser() {
    if (confirm("Clear all saved data and start fresh?")) {
        deleteCookie("pmc_firstname");
        clearLocalStorage();
        document.getElementById("register").reset();
        document.getElementById("outputformdata").innerHTML = "";
        document.getElementById("submit").disabled = true;
        document.getElementById("welcome-msg").innerHTML =
            "Welcome, New User! Please fill out the form below.";
        document.getElementById("not-you-link").innerHTML = "";
    }
}
 
function handleRememberMe() {
    var checked = document.getElementById("rememberMe").checked;
    if (!checked) {
        deleteCookie("pmc_firstname");
        clearLocalStorage();
        alert("Your saved data has been cleared.");
    } else {
        var fn = document.getElementById("firstname").value.trim();
        if (fn) setCookie("pmc_firstname", fn, 48);
        alert("Your data will be remembered for 48 hours.");
    }
}
 
function clearAllData() {
    document.getElementById("submit").disabled = true;
    document.getElementById("outputformdata").innerHTML = "";
    if (!document.getElementById("rememberMe").checked) {
        deleteCookie("pmc_firstname");
        clearLocalStorage();
    }
}
 
 
//  Blur listener — save first name cookie when field loses focus
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("firstname").addEventListener("blur", function() {
        var remember = document.getElementById("rememberMe").checked;
        if (remember) {
            var fn = this.value.trim();
            if (fn) setCookie("pmc_firstname", fn, 48);
        }
        saveField("firstname");
    });
});
 
 
// Fetch API — load states from XML 
async function loadStates() {
    var statusEl = document.getElementById("fetch-status");
    try {
        var response = await fetch("states.xml");
        if (!response.ok) throw new Error("HTTP " + response.status);
 
        var xmlText = await response.text();
        var parser  = new DOMParser();
        var xmlDoc  = parser.parseFromString(xmlText, "application/xml");
 
        if (xmlDoc.querySelector("parsererror")) throw new Error("XML parse error");
 
        var nodes  = xmlDoc.getElementsByTagName("state");
        var select = document.getElementById("state");
        select.innerHTML = '<option value=""></option>';
 
        for (var i = 0; i < nodes.length; i++) {
            var opt = document.createElement("option");
            opt.value       = nodes[i].getAttribute("abbr");
            opt.textContent = nodes[i].textContent;
            select.appendChild(opt);
        }
 
        statusEl.textContent = "Form options loaded from XML.";
        setTimeout(function() { statusEl.textContent = ""; }, 2000);
 
        var savedState = lsGet("state");
        if (savedState) select.value = savedState;
 
    } catch (err) {
        statusEl.textContent = "Could not load states.xml — using built-in list.";
        loadStatesInline();
    }
}
 
 
// Page init 
window.addEventListener("load", function() {
    loadStates();
    initWelcome();
});
 
/* End of document: homework3.js */
