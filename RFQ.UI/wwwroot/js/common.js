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
