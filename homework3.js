/* 
 Name: Cinque Preston
 File: homework3.js
 Date Created: 2026-03-15
 Date Updated: 2026-04-20
 Purpose: Combined validation + review table for Preston Medical registration form
*/

// Maps each field name to a friendly label for the review table
var FIELD_LABELS = {
  firstname:      "First Name",
  middleinit:     "Middle Initial",
  lastname:       "Last Name",
  DateOfBirth:    "Date of Birth",
  SocialSecurity: "Social Security #",
  email1:         "Email Address",
  phone:          "Phone Number",
  addr1:          "Street Address",
  addr2:          "Address Line 2",
  city:           "City",
  state:          "State",
  zip:            "ZIP Code",
  user:           "Username",
  Password:       "Password",
  confirmPass:    "Confirm Password",
  illness1:       "Heart Disease",
  illness2:       "Diabetes",
  illness3:       "Hypertension",
  illness4:       "Cancer",
  illnessOther:   "Other Condition",
  description:    "Symptoms / Condition",
  gender:         "Gender",
  medication:     "On Medications?",
  vaccination:    "COVID Vaccinated?",
  feeling:        "Urgency Level (1-10)"
};

var error_flag = "0";

// REVIEW TABLE 

function getdata1() {
  var form = document.getElementById("register");
  var rows = "";
  var seen = {};

  for (var i = 0; i < form.elements.length; i++) {
    var el = form.elements[i];
    var type = el.type;
    var label = FIELD_LABELS[el.name] || FIELD_LABELS[el.id] || el.name;
    var val = "";

    if (type === "button" || type === "submit" || type === "reset") continue;

    if (type === "checkbox") {
      if (!el.checked) continue;
      val = "Yes";
    } else if (type === "radio") {
      if (seen[el.name]) continue;
      seen[el.name] = true;
      var checked = form.querySelector('input[name="' + el.name + '"]:checked');
      if (!checked) continue;
      val = checked.value.charAt(0).toUpperCase() + checked.value.slice(1);
      label = FIELD_LABELS[el.name] || el.name;
    } else if (type === "password") {
      if (el.value === "") continue;
      val = "••••••••";
    } else if (type === "range") {
      val = el.value + " / 10";
    } else {
      if (el.value === "" || el.value === null) continue;
      val = el.value;
    }

    rows += "<tr><td class='review-label'>" + label + "</td><td class='review-value'>" + val + "</td></tr>";
  }

  if (rows === "") {
    document.getElementById("outputformdata").innerHTML = "<p style='text-align:center; color:#555;'>No information entered yet.</p>";
    return;
  }

  var table = "<table class='output'>"
            + "<tr><th>Field</th><th>Your Entry</th></tr>"
            + rows
            + "</table>";

  document.getElementById("outputformdata").innerHTML = table;
}

function removedata1() {
  document.getElementById("outputformdata").innerHTML = "";
  document.getElementById("submit").disabled = true;
}

// HELPER 

function showMsg(id, msg) {
  var el = document.getElementById(id);
  if (el) el.innerHTML = msg;
}

// SSN AUTO-FORMAT 

function formatSSN() {
  var val = document.getElementById("SSN").value.replace(/[^0-9]/g, "");
  if (val.length > 5) {
    val = val.substring(0, 3) + "-" + val.substring(3, 5) + "-" + val.substring(5, 9);
  } else if (val.length > 3) {
    val = val.substring(0, 3) + "-" + val.substring(3);
  }
  document.getElementById("SSN").value = val;
}

function checkSSN() {
  var val = document.getElementById("SSN").value;
  if (val.match(/^\d{3}-\d{2}-\d{4}$/)) {
    showMsg("ssn_text", "");
  } else {
    showMsg("ssn_text", "SSN must be in format 000-00-0000.");
    error_flag = "1";
  }
}

// NAME FIELDS 

function checkfirstname() {
  var val = document.getElementById("firstname").value;
  if (val.length < 1 || val.length > 30) {
    showMsg("name_message", "First name must be 1-30 characters.");
    error_flag = "1";
  } else if (!val.match(/^[a-zA-Z'-]+$/)) {
    showMsg("name_message", "First name: letters, apostrophes, and dashes only.");
    error_flag = "1";
  } else {
    showMsg("name_message", "");
  }
}

function checkmiddle() {
  var val = document.getElementById("middleinit").value;
  if (val.length === 0) {
    showMsg("name_message", "");
  } else if (!val.match(/^[a-zA-Z]$/)) {
    showMsg("name_message", "Middle initial must be a single letter.");
    error_flag = "1";
  } else {
    showMsg("name_message", "");
  }
}

function checklastname() {
  var val = document.getElementById("lastname").value;
  if (val.length < 1 || val.length > 30) {
    showMsg("lastname_message", "Last name must be 1-30 characters.");
    error_flag = "1";
  } else if (!val.match(/^[a-zA-Z2-5'-]+$/)) {
    showMsg("lastname_message", "Last name: letters, apostrophes, dashes, and numbers 2-5 only.");
    error_flag = "1";
  } else {
    showMsg("lastname_message", "");
  }
}

// DATE OF BIRTH 

function checkDOB() {
  var val = document.getElementById("DOB").value;
  if (!val) {
    showMsg("dob_message", "Date of Birth is required.");
    error_flag = "1";
    return;
  }
  var dob = new Date(val);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var oldest = new Date();
  oldest.setFullYear(oldest.getFullYear() - 120);

  if (dob > today) {
    showMsg("dob_message", "Date of birth cannot be in the future.");
    error_flag = "1";
  } else if (dob < oldest) {
    showMsg("dob_message", "Date of birth cannot be more than 120 years ago.");
    error_flag = "1";
  } else {
    showMsg("dob_message", "");
  }
}

// CONTACT FIELDS

function checkemail() {
  var val = document.getElementById("email1").value;
  if (val.length === 0) {
    showMsg("Email_Text", "");
  } else if (!val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    showMsg("Email_Text", "Please enter a valid email (e.g. name@domain.com).");
    error_flag = "1";
  } else {
    showMsg("Email_Text", "");
  }
}

function checkphone() {
  var val = document.getElementById("phone").value;
  if (val.length === 0) {
    showMsg("phone_text", "");
  } else if (!val.match(/^\d{3}-\d{3}-\d{4}$/)) {
    showMsg("phone_text", "Phone must be in format 000-000-0000.");
    error_flag = "1";
  } else {
    showMsg("phone_text", "");
  }
}

// ADDRESS FIELDS

function checkaddr1() {
  var val = document.getElementById("addr1").value;
  if (val.length < 2 || val.length > 30) {
    showMsg("addr1_text", "Address Line 1 must be 2-30 characters.");
    error_flag = "1";
  } else {
    showMsg("addr1_text", "");
  }
}

function checkaddr2() {
  var val = document.getElementById("addr2").value;
  if (val.length === 0) {
    showMsg("addr2_text", "");
  } else if (val.length < 2 || val.length > 30) {
    showMsg("addr2_text", "Address Line 2 must be 2-30 characters if entered.");
    error_flag = "1";
  } else {
    showMsg("addr2_text", "");
  }
}

function checkcity() {
  var val = document.getElementById("city").value;
  if (val.length < 2 || val.length > 30) {
    showMsg("City_text", "City must be 2-30 characters.");
    error_flag = "1";
  } else {
    showMsg("City_text", "");
  }
}

function checkstate() {
  var val = document.getElementById("state").value;
  if (val === "") {
    showMsg("State_text", "Please select a state.");
    error_flag = "1";
  } else {
    showMsg("State_text", "");
  }
}

function checkzip() {
  var val = document.getElementById("zip").value;
  if (val.match(/^\d{5}(-\d{4})?$/)) {
    document.getElementById("zip").value = val.substring(0, 5);
    showMsg("zip_text", "");
  } else {
    showMsg("zip_text", "ZIP must be 5 digits (or ZIP+4: 00000-0000).");
    error_flag = "1";
  }
}

// USERNAME 

function checkuser() {
  var val = document.getElementById("user").value;
  if (val.length < 5 || val.length > 30) {
    showMsg("user_text", "Username must be 5-30 characters.");
    error_flag = "1";
  } else if (/\s/.test(val)) {
    showMsg("user_text", "Username cannot contain spaces.");
    error_flag = "1";
  } else if (/^\d/.test(val)) {
    showMsg("user_text", "Username cannot begin with a number.");
    error_flag = "1";
  } else if (!val.match(/^[a-zA-Z][a-zA-Z0-9_-]*$/)) {
    showMsg("user_text", "Username: letters, numbers, underscores, and dashes only.");
    error_flag = "1";
  } else {
    document.getElementById("user").value = val.toLowerCase();
    showMsg("user_text", "");
  }
}

// PASSWORD 

function passwordentry() {
  var pass     = document.getElementById("pass").value;
  var username = document.getElementById("user").value.toLowerCase();
  var first    = document.getElementById("firstname").value.toLowerCase();
  var last     = document.getElementById("lastname").value.toLowerCase();

  if (pass.length < 8 || pass.length > 30) {
    showMsg("pass_text", "Password must be 8-30 characters.");
    error_flag = "1";
  } else {
    showMsg("pass_text", "");
  }

  showMsg("pass_text2", pass.search(/[a-z]/) < 0 ? (error_flag="1", "Must include at least one lowercase letter.") : "");
  showMsg("pass_text3", pass.search(/[A-Z]/) < 0 ? (error_flag="1", "Must include at least one uppercase letter.") : "");
  showMsg("pass_text4", pass.search(/[0-9]/) < 0 ? (error_flag="1", "Must include at least one number.") : "");
  showMsg("pass_text5", pass.search(/[!@#%^&*()\-_+=\\\/><.,`~]/) < 0 ? (error_flag="1", "Must include at least one special character: !@#%^&*()-_+=\\/><.,`~") : "");
  showMsg("pass_text6", pass.indexOf('"') >= 0 ? (error_flag="1", 'Password cannot contain double-quote (") characters.') : "");

  if (username.length >= 3 && pass.toLowerCase().includes(username)) {
    showMsg("pass_text7", "Password cannot contain your username."); error_flag = "1";
  } else { showMsg("pass_text7", ""); }

  if (first.length >= 3 && pass.toLowerCase().includes(first)) {
    showMsg("pass_text8", "Password cannot contain your first name."); error_flag = "1";
  } else { showMsg("pass_text8", ""); }

  if (last.length >= 3 && pass.toLowerCase().includes(last)) {
    showMsg("pass_text9", "Password cannot contain your last name."); error_flag = "1";
  } else { showMsg("pass_text9", ""); }
}

function checkpassword2() {
  var p1 = document.getElementById("pass").value;
  var p2 = document.getElementById("confirmPass").value;
  if (p1 === p2) {
    showMsg("confirmPass_text", "<span style='color:green;'>&#10003; Passwords match!</span>");
  } else {
    showMsg("confirmPass_text", "Passwords do not match.");
    error_flag = "1";
  }
}

// RADIO BUTTONs

function checkgender() {
  if (!document.querySelector('input[name="gender"]:checked')) {
    showMsg("gender_text", "Please select a gender.");
    error_flag = "1";
  } else {
    showMsg("gender_text", "");
  }
}

function checkmedication() {
  if (!document.querySelector('input[name="medication"]:checked')) {
    showMsg("medication_text", "Please indicate if you are on medications.");
    error_flag = "1";
  } else {
    showMsg("medication_text", "");
  }
}

function checkvaccination() {
  if (!document.querySelector('input[name="vaccination"]:checked')) {
    showMsg("vaccination_text", "Please indicate your COVID vaccination status.");
    error_flag = "1";
  } else {
    showMsg("vaccination_text", "");
  }
}

// CHECK ALL 

function checkform() {
  error_flag = "0";

  checkfirstname();
  checkmiddle();
  checklastname();
  checkDOB();
  checkSSN();
  checkemail();
  checkphone();
  checkaddr1();
  checkaddr2();
  checkcity();
  checkstate();
  checkzip();
  checkuser();
  passwordentry();
  checkpassword2();
  checkgender();
  checkmedication();
  checkvaccination();

  if (error_flag === "1") {
    alert("Please fix the indicated errors before submitting.");
  } else {
    document.getElementById("submit").disabled = false;
    alert("All fields are valid! You may now click Send to submit.");
  }
}
