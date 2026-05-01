var orderColumnName = '';
var orderDirName = '';

$(document).ready(function () {
    initialization();
});

function initialization() {
    if (typeof (IsAdd) != 'undefined' && IsAdd != 'True') {
        $('#btnAdd').hide();
    }
    $('.arrow-icon .toggle-arrow').on('click', function () {
        //let icon = $(this).find('.arrow-icon');
        //icon.toggleClass('rotated');

    });
}
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
function isAlphabets(value) {
    return /^[A-Za-z\s]+$/.test(value.key);
}
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
function isValidateEmail(email) {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
}
function isValidateSelect(value, selectedIndex) {
    return value !== "" && value !== null && value !== undefined && value != 0 && selectedIndex !== 0;
}
function isMobile(number) {
    return /^[0-9]{10}$/.test(number);
}
function IsValidAuthKey(key) {
    const regex = /^[A-Za-z0-9-_]{20,}$/;
    return regex.test(key);
}
function IsValidVehicleNumber(vehicleNumber) {
    var pattern = /^([A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4})$/;
    return pattern.test(vehicleNumber);
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
function FetchDataForTable(gridTableName, url, orderColumn, orderDir, EditFunctionName = null, DeleteFunctionName = null, IdPropertyName = null) {
    const companyid = getCookieValue('companyid');
    const profileid = getCookieValue('profileid');
    $('#tableDiv').show();
    $('#' + gridTableName + ' tbody').empty();
    $('#totalList').text('Total List: 0');
    $('#customPagination').empty();
    const pageLength = Number($('#pageLength').val()) || 10;
    //const pageLength = 1;
    let pageNumber = Number($('#currentPage').val()) || 1;
    if (pageNumber < 1) pageNumber = 1;
    orderColumnName = orderColumn;
    orderDirName = orderDir;
    const searchValue = $('#' + gridTableName + 'Search').val() || '';
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            ProfileId: profileid,
            CompanyId: companyid,
            Draw: pageNumber,
            start: (pageNumber - 1) * pageLength,
            length: pageLength,
            searchValue: searchValue,
            OrderColumn: orderColumn,
            OrderDir: orderDir
        }),
        success: function (response) {
            if (!response || !response.data || response.data.length === 0) {
                $('#' + gridTableName + ' tbody').html('<tr><td colspan="20" class="text-center">No records found</td></tr>');
                $('#totalList').text('Total List: 0');
                $('#customPagination').empty();
                return;
            }
            // Condition hide login user from user list
            if (gridTableName == 'tableuser') {
                var userid = decodeURIComponent(getCookieValue('userid'));
                const filteredUsers = Array.isArray(response?.data)
                    ? response.data.filter(user => user.userId !== Number(userid))
                    : [];
                response.data = filteredUsers;
            }
            viewModelDto = response.data;
            //let rowsHtml = '';
            //rowsHtml = GetGridHtml(response, gridTableName, IsEdit, IsView, IsCancel);
            CreateOrFillDataInDataTable(response, EditFunctionName, DeleteFunctionName, IdPropertyName);
            //$('#' + gridTableName + ' tbody').html(rowsHtml);
            $('#totalList').text(`Total List: ${response.recordsTotal}`);
            generatePagination(response.recordsTotal, pageLength, pageNumber, gridTableName, url, EditFunctionName, DeleteFunctionName, IdPropertyName);
        },
        error: function () {
            $('#' + gridTableName + ' tbody').html('<tr><td colspan="20" class="text-center text-danger">Error loading data</td></tr>');
            $('#customPagination').empty();
        }
    });
}
function CreateOrFillDataInDataTable(response, EditFunctionName = null, DeleteFunctionName = null, IdPropertyName = null) {
    var displayColumns = '';
    if (!IsNullOrEmpty(response.displayColumn)) {
        displayColumns = response.displayColumn.split(",");
        CreateDataTableIfNotExists(displayColumns);
        $('#tableBody').html('');
        response.data.forEach(row => {
            var data = keysToLowerCase(row);
            var tableDataHtml = `<tr>`;
            displayColumns.forEach(col => {
                var cols = col.split(" as ");
                if (cols.length > 1) {
                    const check = IsDateField(cols[0]);
                    if (check) {
                        const value = data[cols[0].trim(' ').toLowerCase()];
                        if (!IsNullOrEmpty(value))
                            tableDataHtml += `<td>${FormatDateToLocal(value)}</td>`;
                        else
                            tableDataHtml += `<td>${''}</td>`;
                    }
                    else {
                        tableDataHtml += `<td>${data[cols[0].trim(' ').toLowerCase()] ?? ''}</td>`;
                    }
                }
            });
            tableDataHtml += '<td>';
            if (IsEdit == 'True') {
                tableDataHtml += '<a class="icon-btn" onclick="' + EditFunctionName + '(' + data[IdPropertyName.toLowerCase()] + ')"><i class="ri-edit-2-line"></i></a>';
            }
            if (IsCancel == 'True') {
                tableDataHtml += '<a class="icon-btn" onclick="' + DeleteFunctionName + '(' + data[IdPropertyName.toLowerCase()] + ')"><i class="ri-delete-bin-3-line"></i></a>';
            }

            tableDataHtml += `</td></tr>`;
            $('#tableBody').append(tableDataHtml);
        });
    }
}
function keysToLowerCase(obj) {
    if ($.isArray(obj)) {
        return $.map(obj, function (item) {
            return keysToLowerCase(item);
        });
    } else if ($.isPlainObject(obj)) {
        var newObj = {};
        $.each(obj, function (key, value) {
            newObj[key.toLowerCase()] = keysToLowerCase(value);
        });
        return newObj;
    }
    return obj;
}
function CreateDataTableIfNotExists(displayColumns) {
    if (!$.fn.DataTable.isDataTable('#GridListTable')) {
        if (displayColumns.length > 0) {
            var tableHeaderHtml = "";
            tableHeaderHtml += `<tr>`;
            displayColumns.forEach(col => {
                var cols = col.split("as");
                if (cols.length > 1) {
                    tableHeaderHtml += `<th class="sortable text-center" data-column="${cols[0].trim(' ')}" data-order="asc">${cols[cols.length - 1].trim(' ')}</th>`;
                }
            });
            tableHeaderHtml += `<th class="text-center no-sort" data-column="Action">Action</th>`;
            tableHeaderHtml += `</tr>`;
            $('#GridListTable thead').html(tableHeaderHtml);
        }
        const table = $('#GridListTable').DataTable({
            responsive: false,
            dom: 'Bfrtip',
            buttons: [
                {
                    text: '<i class="ri-file-excel-line"></i> Export All',
                    action: function (e, dt, node, config) {
                        let headers = [];
                        let csvData = [];

                        $('#GridListTable thead th').each(function () {
                            headers.push($(this).text().trim());
                        });
                        csvData.push(headers); // push header row as array

                        $('#GridListTable tbody tr').each(function () {
                            let row = [];
                            $(this).find('td').each(function () {
                                row.push($(this).text().trim() || "");
                            });
                            csvData.push(row); // push row as array
                        });

                        exportToCSV("GridListTable", csvData);
                    }
                },
            ],
            paging: false,
            info: true,
            lengthChange: false,
            pageLength: 10,
            order: [],
            language: {
                paginate: {
                    previous: '<i class="ri-arrow-left-s-line"></i>',
                    next: '<i class="ri-arrow-right-s-line"></i>'
                }
            }
        });
        // Move export buttons
        table.buttons().container().appendTo('#exportButtons');
    }
}
function generatePagination(totalRecords, pageSize, currentPage, gridTableName, url, EditFunctionName = null, DeleteFunctionName = null, IdPropertyName = null) {
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
            FetchDataForTable(gridTableName, url, orderColumnName, orderDirName, EditFunctionName, DeleteFunctionName, IdPropertyName);
        }
        //$('html,body').animate({
        //    scrollTop: $("#customvehicleTypesPagination").offset().top
        //}, 1000);
        //$("#customvehicleTypesPagination").focus();
    });
}
function getCookieValue(name) {
    const value = `; ${document.cookie} `;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function GetAllCityList(dropdownId) {
    var getcityUrl = '/Customer/GetAllCity'
    $.ajax({
        url: getcityUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const select = document.getElementById(dropdownId);
            if (!select) {
                toastr.error("Failed to Fetch City!", "Error");
                return;
            }
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a City";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);
            response.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.cityId;
                opt.textContent = option.cityName;
                select.appendChild(opt);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch City!", "Error");
        }
    });
}
function GetAllStateList(dropdownId) {
    var getVehicleTypeUrl = '/CompanyState/GetAllStateList';
    $.ajax({
        url: getVehicleTypeUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) {
                toastr.error("Failed to Fetch State Name!", "Error");
                return;
            }
            dropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a State Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            dropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.stateId;
                option.textContent = item.stateName;
                dropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch State Name!", "Error");
        }
    });
}
function GetAllPakingType(dropdownId) {
    var getUrl = '/CompanyMasterPackingType/GetAllMasterPackingType';
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const packingTypedropdown = document.getElementById(dropdownId);
            if (!packingTypedropdown) {
                toastr.error("Failed to Fetch Paking Type!", "Error");
                return;
            }
            packingTypedropdown.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a PakingType";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            packingTypedropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.packingId;
                option.textContent = item.packingName;
                packingTypedropdown.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Paking Type!", "Error");
        }
    });
}
function GetAllLocation(dropdownId, companyIdParam, callback) {
    $.ajax({
        url: '/Location/GetAllLocationList',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            var data = response
            const selectLocation = document.getElementById(dropdownId);
            selectLocation.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select Location";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectLocation.appendChild(placeholderOption);
            data.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.locationId;
                opt.textContent = option.locationName;
                selectLocation.appendChild(opt);
            });
            if (callback && typeof callback === 'function') {
                callback();
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function GetAllCustomer(dropdownId, companyIdParam) {
    $.ajax({
        url: '/Customer/GetDrpCustomerList',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            var data = response
            const selectCustomer = document.getElementById(dropdownId);
            selectCustomer.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select a Customer Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectCustomer.appendChild(placeholderOption);
            data.forEach(name => {
                const option = document.createElement("option");
                option.value = name.partyId;
                option.textContent = name.partyName;
                selectCustomer.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Customer Name!", "Error");
        }
    });
}
function GetAllVehicleType(dropdownId, companyIdParam) {
    $.ajax({
        url: '/Vehicle/GetAllMasterVehicleType',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            if (response != null) {
                var data = response
                //const selectVehicleType = document.getElementById(dropdownId);
                const dropdowns = document.querySelectorAll(`#${dropdownId}`);
                const selectVehicleType = dropdowns[dropdowns.length - 1];
                selectVehicleType.innerHTML = "";
                //this twoline for select last dropdown and bind Data of the page
                let placeholderOption = document.createElement("option");
                placeholderOption.value = 0;
                placeholderOption.textContent = "Select a Vehicle Type";
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                selectVehicleType.appendChild(placeholderOption);

                data.forEach(item => {
                    const option = document.createElement("option");
                    option.value = item.vehicleTypeId;
                    option.textContent = item.vehicleTypeName;
                    selectVehicleType.appendChild(option);
                });
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Vehicle Type!", "Error");
        }
    });
}
function GetAllItemName(dropdownId, companyIdParam) {
    $.ajax({
        url: '/Product/GetDrpProductList',
        type: "GET",
        data: { companyId: companyIdParam },
        dataType: "json",
        success: function (response) {
            var data = response
            const selectItemName = document.getElementById(dropdownId);
            selectItemName.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = 0;
            placeholderOption.textContent = "Select an Item Name";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            selectItemName.appendChild(placeholderOption);

            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.itemId;
                option.textContent = item.itemName;
                selectItemName.appendChild(option);
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Product List!", "Error");
        }
    });
}
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day} /${month}/${year} ${hours}:${minutes}:${seconds} `;
}
function showLoader() {
    $("#loader").removeClass('d-none');
}
function hideLoader() {
    $("#loader").addClass('d-none');
}
function exportToCSV(filename, rows) {
    let csvContent = rows.map(row =>
        row.map(item => `"${item}"`).join(",")
    ).join("\n");

    let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    let link = document.createElement("a");
    if (link.download !== undefined) {
        let url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
function addMasterUserActivityLog(LogUid, LogTypeId, Description, UserId) {
    var urlParams = new URLSearchParams(window.location.search);
    var linkId = urlParams.get('LinkId');
    const body = {
        LogUid: LogUid ?? 0,
        LogLinkId: linkId ?? 0,
        LogTypeId: LogTypeId ?? 0,
        UserId: UserId ?? 0,
        LogDateTime: null,
        Description: Description ?? null,
    };

    $.ajax({
        url: '/MasterUserActivityLog/AddMasterUserActivityLog',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(body),
        success: function (response) {
            console.log("API response:", response);
        },
        error: function (xhr, status, error) {
            console.error("Error calling API:", error, xhr, status);
            toastr.error("An error occurred while logging activity.");
        }
    });
}
function FormatDateToLocal(dateString) {
    if (IsNullOrEmpty(dateString)) {
        return null
    } else {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
}
function ValidateLicenseNo(number) {
    return /^[A-Z]{2}[0-9]{2}(19|20)[0-9]{2}[0-9]{7}$/.test(number);
}
function getVal(selector) {
    const value = $(selector).val();
    return value === "null" || value === null || value === undefined || (typeof value === "string" && value.trim() === "" ? null : value.trim());
}
function base64ToFile(base64String, filename) {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}
function GetLocationById(id) {
    return $.ajax({
        url: '/Location/GetLocationById',
        type: 'GET',
        data: { id: id },
        dataType: 'json',
        success: function (response) {
            if (!IsNullOrEmpty(response)) {
                return response;
                console.log("Location Data:", response);
            } else {
                return null;
                console.warning("Failed to fetch GetLocationById");
            }
        },
        error: function (xhr, status, error) {
            console.log("Failed to fetch GetLocationById");
        }
    });
}
function GetAutoGenerateCode(code, prefix) {
    var requestDto = {
        UserId: decodeURIComponent(getCookieValue('userid')),
        Code: code,
        prefix: prefix
    };
    return $.ajax({
        url: '/Common/GetAutoGenerateCode',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(requestDto),
        success: function (response) {
            return response;
        },
        error: function (xhr, status, error) {
            console.error("Auto Generate Code Error:", error);
        }
    });
}
function IsDateField(columnName) {
    if (!IsNullOrEmpty(columnName)) {
        columnName = columnName.trim().toLowerCase();
        if (columnName.includes('date') || columnName.includes('expiredon') || columnName.includes('reqon')) {
            return true;
        }
        else {
            return false;
        }
    }
}
function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
function isFirstDateGreaterOrEqualSecondDate(firstDate, secondDate) {

    if (IsNullOrEmpty(firstDate) || IsNullOrEmpty(secondDate)) {
        return console.log("Date null or Empty isFirstDateGreater");
    }
    // Convert into Date objects
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);

    // Check valid dates
    if (isNaN(date1) || isNaN(date2)) {
        console.log("Invalid Date Passed isFirstDateGreater");
    }

    // Compare full date (Day, Month, Year)
    return date1 > date2;
}

function BindDropdownValues(controlId, listData, valueProp, textProp, placeholderText) {
    $("#" + controlId).empty();
    const select = document.getElementById(controlId);
    select.innerHTML = "";
    let placeholderOption = document.createElement("option");
    placeholderOption.value = 0;
    placeholderOption.textContent = "Select " + placeholderText;
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    listData.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option[valueProp];
        opt.textContent = option[textProp];
        select.appendChild(opt);
    });
}

function BindSelectedValueAndDisable(controlId,value,textValue) {
    const select = document.getElementById(controlId);
    const option = document.createElement("option");
    option.value = value;
    option.textContent = textValue;
    option.selected = true;
    select.appendChild(option);
    $("#" + controlId).prop('disabled', true);
}