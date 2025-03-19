function ValidateTextbox(inputId) {
    var value = $(inputId).val();
    var pattern = /^[A-Za-z0-9]+$/; 

    if (!pattern.test(value)) {
        alert("Invalid input! Only letters and numbers are allowed.");
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

// isAlphabets function
function isAlphabets(value) {
    return /^[A-Za-z]+$/.test(value);
}

// isAlphaNumeric function
function isAlphaNumeric(value) {
    return /^[A-Za-z0-9]+$/.test(value);
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

// set all Input Box and select option is blue Border
window.addEventListener('DOMContentLoaded', function () {
    // Select all input elements on the page
    const inputs = document.querySelectorAll('input,select');

    // Loop through each input and set the border color to blue
    inputs.forEach(function (input) {
        input.style.borderColor = 'hsl(210,77%,46%)';
    });
});
