$(document).ready(function () {
    var viewModelDto;
});

function ValidateTextbox(inputId) {
    var value = $(inputId).val();
    //var pattern = /^[A-Za-z0-9]+$/; 
    var pattern = /^[a-zA-Z0-9 ]*$/;

    if (!pattern.test(value)) {
        //toastr.warning("Invalid input! Only letters and numbers are allowed.");
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
    return /^[A-Za-z\s]+$/.test(value.key);
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

    if (!(isAlphabetKey || isNumberKey || isNumpadKey)) {
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

    const attachmentOptionsString = localStorage.getItem("attachmentType");
    const attachmentOptions = attachmentOptionsString ? JSON.parse(attachmentOptionsString) : [];

    const placeholderOption = $('<option>', {
        value: '',
        text: 'Select an Attachment Type',
        disabled: true,
        selected: true
    });

    $(selectElement).append(placeholderOption);

    $.each(attachmentOptions, function (index, option) {
        $(selectElement).append(
            $('<option>', {
                value: option.value,
                text: option.text
            })
        );
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

function FetchDataForTable(gridTableName, url) {
    $('#tableDiv').show();
    $('#' + gridTableName + ' tbody').empty();
    $('#totalList').text('Total List: 0');
    $('#customPagination').empty();

    const pageLength = Number($('#pageLength').val()) || 10;
    let pageNumber = Number($('#currentPage').val()) || 1;
    if (pageNumber < 1) pageNumber = 1;

    const searchValue = $('#' + gridTableName + 'Search').val() || '';

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            Draw: pageNumber,
            start: (pageNumber - 1) * pageLength,
            length: pageLength,
            searchValue: searchValue,
            orderColumn: 'companyName',
            orderDir: 'asc'
        }),
        success: function (response) {

            if (!response || !response.data || response.data.length === 0) {

                $('#' + '#' + gridTableName + ' tbody').html('<tr><td colspan="4" class="text-center">No records found</td></tr>');
                $('#totalList').text('Total List: 0');
                $('#customPagination').empty();
                return;
            }
            viewModelDto = response.data;
            let rowsHtml = '';
            rowsHtml = GetGridHtml(response, gridTableName);
            $('#' + gridTableName + ' tbody').html(rowsHtml);
            $('#totalList').text(`Total List: ${response.recordsTotal}`);
            generatePagination(response.recordsTotal, pageLength, pageNumber, gridTableName, url);
        },
        error: function () {
            $('#' + gridTableName + ' tbody').html('<tr><td colspan="4" class="text-center text-danger">Error loading data</td></tr>');
            $('#customvehicleTypesPagination').empty();
        }
    });
}

function GetGridHtml(response, gridTableName) {
    var rowsHtml = "";
    if (gridTableName == "vehicleTypesTable") {
        response.data.forEach(item => {
            rowsHtml += `
                    <tr>
                        <td>${item.companyName}</td>
                        <td>${item.vehicleTypeName}</td>
                        <td>${item.minimumKms}</td>
                        <td class="text-center action-items" style="cursor:pointer;">
                            <a class="icon-btn" onclick="EditVehicleType(${item.vehicleTypeId})"><i class="ri-edit-2-line"></i></a>
                            <a class="icon-btn" onclick="DeleteVehicleType(${item.vehicleTypeId})"><i class="ri-delete-bin-3-line"></i></a>
                        </td>
                    </tr>`;
        });
    }
    if (gridTableName == "tableCmpConfig") {
        response.data.forEach(item => {
            rowsHtml += `
                      <tr>
                        <td>${item.companyId}</td>
                        <td>${item.smsProvider}</td>
                        <td>${item.smsAuthKey}</td>
                        <td>${item.whatsAppProvider}</td>
                        <td>${item.whatsAppAuthKey}</td>
                        <td>${item.smtpHost}</td>
                        <td>${item.smtpPort}</td>
                        <td>${item.smtpUsername}</td>
                        <td class="text-center action-items" style="cursor:pointer;">
                            <a class="icon-btn" onclick="EditCompanyConfiguration(${item.companyConfigId})"><i class="ri-edit-2-line"></i></a>
                            <a class="icon-btn" onclick="DeleteCompanyConfiguration(${item.companyConfigId})"><i class="ri-delete-bin-3-line"></i></a>
                        </td>
                    </tr>`;
        });
    }
    if (gridTableName == "tableVehicle") {
        response.data.forEach(item => {
            rowsHtml += `
                        <tr>
                            <td>${item.vehicleNo}</td>
                            <td>${item.vehicleStatus}</td>
                            <td>${item.engineNo}</td>
                            <td>${item.chassisNo}</td>
                            <td>${item.vehicleCapacity}</td>
                            <td>${item.rtoRegistration}</td>
                            <td class="text-center action-items" style="cursor:pointer;">
                                <a class="icon-btn" onclick="EditVehicle(${item.vehicleId})"><i class="ri-edit-2-line"></i></a>
                                <a class="icon-btn" onclick="DeleteVehicle(${item.vehicleId})"><i class="ri-delete-bin-3-line"></i></a>
                            </td>
                        </tr>`;
        });
    }
    if (gridTableName == "customerTable") {
        response.data.forEach(item => {
            rowsHtml += `
                        <tr>
                            <td>${item.partyName}</td>
                            <td>${item.addressLine}</td>
                            <td>${item.pinCode}</td>
                            <td>${item.mobNo}</td>
                            <td>${item.email}</td>
                            <td>${item.panNo}</td>
                            <td>${item.gstNo}</td>
                            <td class="text-center action-items" style="cursor:pointer;">
                                <a class="icon-btn" onclick="EditCustomer(${item.partyId})"><i class="ri-edit-2-line"></i></a>
                                <a class="icon-btn" onclick="DeleteCustomer(${item.partyId})"><i class="ri-delete-bin-3-line"></i></a>
                            </td>
                        </tr>
                    `;
        });
    }
    return rowsHtml;
}

function generatePagination(totalRecords, pageSize, currentPage, gridTableName, url) {
    const paginationContainer = $('#customPagination');
    paginationContainer.empty();

    const totalPages = Math.ceil(totalRecords / pageSize);
    if (totalPages <= 1) return;

    let paginationHtml = '<div class="dataTables_paginate paging_simple_numbers">';
    paginationHtml += '<ul class="pagination">';

    paginationHtml += `<li class="paginate_button page-item ${currentPage === 1 ? 'disabled' : ''} arrow">
        <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="ri-arrow-left-s-line"></i></a></li>`;

    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `<li class="paginate_button page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }

    paginationHtml += `<li class="paginate_button page-item ${currentPage === totalPages ? 'disabled' : ''} arrow">
        <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="ri-arrow-right-s-line"></i></a></li>`;
    paginationHtml += '</ul>';
    paginationHtml += '</div>';
    paginationContainer.html(paginationHtml);

    paginationContainer.off('click').on('click', 'a.page-link', function (e) {
        e.preventDefault();

        const selectedPage = Number($(this).data('page'));
        if (selectedPage > 0 && selectedPage <= totalPages && selectedPage !== currentPage) {
            $('#currentPage').val(selectedPage);
            FetchDataForTable(gridTableName, url);
        }
        $('html,body').animate({
            scrollTop: $("#customvehicleTypesPagination").offset().top
        }, 1000);
        //$("#customvehicleTypesPagination").focus();
    });
}