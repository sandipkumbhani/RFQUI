function ValidateTextbox(inputId) {
    var value = $(inputId).val();
    //var pattern = /^[A-Za-z0-9]+$/; 
    var pattern = /^[a-zA-Z0-9 ]*$/;

    if (!pattern.test(value)) {
        toastr.warning("Invalid input! Only letters and numbers are allowed.");
        return false; // Invalid input
    }
    return true;
}

function ClearControl() {
    $('.text-primary').val();
}
function IsNullOrEmpty(value) {
    return value === "null" || value === null || value === undefined || (typeof value === "string" && value.trim() === "" ? true : false);
}

// isNumeric function
function isNumeric(value) {
    return /^[0-9]+$/.test(value);
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

// isAlphabets function
function isAlphabets(value) {
    return /^[A-Za-z\s]+$/.test(value);
}

// isAlphaNumeric function
function isAlphaNumeric(value) {
    return /^[A-Za-z0-9]+$/.test(value);
}

function AllowAlphaNumericOnly(e) {
    // Allow control keys like Shift, Ctrl, Alt, etc.
    //if (e.shiftKey || e.ctrlKey || e.altKey) {
    //    return; // Do not block these combinations
    //}

    const key = e.keyCode || e.which;

    // Allow: Backspace (8), Delete (46), Arrow keys (35-40), A-Z (65-90), 0-9 (48-57), Numpad 0-9 (96-105)
    //const isControlKey = (key === 8 || key === 46 || (key >= 35 && key <= 40));
    const isAlphabetKey = (key >= 65 && key <= 90);
    const isNumberKey = (key >= 48 && key <= 57);
    const isNumpadKey = (key >= 97 && key <= 122);

    if (!(isAlphabetKey || isNumberKey || isNumpadKey )) {
        e.preventDefault(); // Block non-alphanumeric keys
    }
}

// isValidateEmail function
function isValidateEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

// isValidateSelect function (checks if a select value is chosen and not empty)
function isValidateSelect(value, selectedIndex) {
    return value !== "" && value !== null && value !== undefined && selectedIndex !== 0;
}

// isMobile function (validates a standard 10-digit mobile number)
function isMobile(number) {
    return /^[0-9]{10}$/.test(number);
}

function IsValidAuthKey(key) {
    const regex = /^[A-Za-z0-9-_]{20,}$/;
    return regex.test(key);
}

function GetQueryParam(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// set all Input Box and select option is blue Border
window.addEventListener('DOMContentLoaded', function () {
    // Select all input elements on the page
    const inputs = document.querySelectorAll('input,select');

    // Loop through each input and set the border color to blue
    //inputs.forEach(function (input) {
    //    input.style.borderColor = '#666cff66';
    //    input.style.setProperty('--placeholder-opacity', '0.0');
    //});
});
function populateDropdown(selectElement) {
    $(selectElement).empty();
    var attachmentOptionsString = localStorage.getItem("attachmentType");
    var attachmentOptions = JSON.parse(attachmentOptionsString);
    $.each(attachmentOptions, function (index, option) {
        $(selectElement).append('<option value="' + option.value + '">' + option.text + '</option>');
    });
}

function ValidatePanNumber(number) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(number);
}
function ValidateGstNumber(number) {
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(number);
}
function ValidatePinCode(number) {
    return /^\d{6}$/.test(number);
}