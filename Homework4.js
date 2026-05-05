/* 
 Name: Cinque Preston
 File: homework3.js
 Date Created: 2026-05-01
 Date Updated: 2026-05-4
 Purpose: Homework 4 java and cookie stuff
*/
//  Date display

(function() {
    var days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January","February","March","April","May","June",
                  "July","August","September","October","November","December"];
    var d      = new Date();
    var date   = d.getDate();
    var suffix = (date===1||date===21||date===31)?"st":(date===2||date===22)?"nd":(date===3||date===23)?"rd":"th";
    document.getElementById("today").innerHTML =
        days[d.getDay()] + ", " + months[d.getMonth()] + " " + date + suffix + ", " + d.getFullYear();
})();



//  Cookie stuff

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
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}



var LS_PREFIX = "pmc_";   // Preston Medical Center prefix

function lsSave(key, val) {
    localStorage.setItem(LS_PREFIX + key, val);
}

function lsGet(key) {
    return localStorage.getItem(LS_PREFIX + key);
}

function lsRemove(key) {
    localStorage.removeItem(LS_PREFIX + key);
}

// Fields we persist excluding the private fields
var PERSIST_FIELDS = [
    "firstname","middleinit","lastname","DOB",
    "addr1","addr2","city","state","zip",
    "phone","email1","user","description","feeling"
];

var PERSIST_CHECKBOXES = ["illness1","illness2","illness3","illness4","illnessOther"];
var PERSIST_RADIOS     = ["gender","medication","vaccination"];

// Save a single text/date/select/textarea/range field
function saveField(id) {
    var el = document.getElementById(id);
    if (el) lsSave(id, el.value);
}

// Save a checkbox state
function saveCheckbox(id) {
    var el = document.getElementById(id);
    if (el) lsSave(id, el.checked ? "1" : "0");
}

// Save a radio group
function saveRadio(name) {
    var checked = document.querySelector('input[name="' + name + '"]:checked');
    lsSave("radio_" + name, checked ? checked.value : "");
}

// Restore all saved fields into the form
function restoreFromLocalStorage() {
    PERSIST_FIELDS.forEach(function(id) {
        var val = lsGet(id);
        if (val !== null) {
            var el = document.getElementById(id);
            if (el) el.value = val;
        }
    });
    // Range display
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

// Wipe all local storage entries for this app
function clearLocalStorage() {
    PERSIST_FIELDS.forEach(function(id)       { lsRemove(id); });
    PERSIST_CHECKBOXES.forEach(function(id)   { lsRemove(id); });
    PERSIST_RADIOS.forEach(function(name)     { lsRemove("radio_" + name); });
}




function initWelcome() {
    var savedName = getCookie("pmc_firstname");

    if (savedName) {
        // Returning user
        document.getElementById("welcome-msg").innerHTML =
            "Welcome back, <strong>" + savedName + "</strong>!";

        document.getElementById("not-you-link").innerHTML =
            '&nbsp;&nbsp;<a href="#" onclick="startNewUser(); return false;" style="color:rgb(162,255,144);">' +
            'Not ' + savedName + '? Click here to start as a new user.</a>';

        // Pre-fill first name and restore all other fields
        document.getElementById("firstname").value = savedName;
        restoreFromLocalStorage();

    } else {
        // First-time visitor
        document.getElementById("welcome-msg").innerHTML =
            "Welcome, New User! Please fill out the form below.";
        document.getElementById("not-you-link").innerHTML = "";
    }
}

// Called when "Not [name]?" is clicked
function startNewUser() {
    if (confirm("Clear all saved data and start fresh?")) {
        deleteCookie("pmc_firstname");
        clearLocalStorage();
        document.getElementById("register").reset();
        document.getElementById("outputformdata").innerHTML = "";
        document.getElementById("submit").disabled = true;
        document.getElementById("welcome-msg").innerHTML =
            "&#127817; Welcome, New User! Please fill out the form below.";
        document.getElementById("not-you-link").innerHTML = "";
    }
}

// Remember Me checkbox handler
function handleRememberMe() {
    var checked = document.getElementById("rememberMe").checked;
    if (!checked) {
        // User unchecked: expire cookie and clear storage
        deleteCookie("pmc_firstname");
        clearLocalStorage();
        alert("Your saved data has been cleared.");
    } else {
        // Re-checked: save immediately if first name is filled
        var fn = document.getElementById("firstname").value.trim();
        if (fn) setCookie("pmc_firstname", fn, 48);
        alert("Your data will be remembered for 48 hours.");
    }
}

// Override the form reset to also wipe storage
function clearAllData() {
    document.getElementById("submit").disabled = true;
    document.getElementById("outputformdata").innerHTML = "";
    var remember = document.getElementById("rememberMe").checked;
    if (!remember) {
        deleteCookie("pmc_firstname");
        clearLocalStorage();
    }
}

// When first name field loses focus, save the cookie (if Remember Me is on)
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


// ─────────────────────────────────────────────────
//  FETCH API — Load states list from external XML file
// ─────────────────────────────────────────────────
async function loadStates() {
    var statusEl = document.getElementById("fetch-status");
    try {
        var response = await fetch("states.xml");
        if (!response.ok) throw new Error("HTTP " + response.status);

        var xmlText = await response.text();
        var parser  = new DOMParser();
        var xmlDoc  = parser.parseFromString(xmlText, "application/xml");

        // Check for XML parse errors
        var parseErr = xmlDoc.querySelector("parsererror");
        if (parseErr) throw new Error("XML parse error");

        var nodes  = xmlDoc.getElementsByTagName("state");
        var select = document.getElementById("state");
        select.innerHTML = '<option value=""></option>';  // blank default

        for (var i = 0; i < nodes.length; i++) {
            var opt = document.createElement("option");
            opt.value       = nodes[i].getAttribute("abbr");
            opt.textContent = nodes[i].textContent;
            select.appendChild(opt);
        }

        statusEl.textContent = "Form options loaded from XML.";
        setTimeout(function() { statusEl.textContent = ""; }, 2000);

        // After states load, restore any saved state selection
        var savedState = lsGet("state");
        if (savedState) select.value = savedState;

    } catch (err) {
        // Fallback: populate from inline data if fetch fails
        statusEl.textContent = "Could not load states.xml — using built-in list.";
        loadStatesInline();
    }
}




// ─────────────────────────────────────────────────
//  PAGE INIT
// ─────────────────────────────────────────────────
window.addEventListener("load", function() {
    loadStates();   // Fetch API call
    initWelcome();  // Cookie check
});
