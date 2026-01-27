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
function GetGridHtml(response, gridTableName, IsEdit, IsView, IsCancel) {
    var rowsHtml = "";
    if (gridTableName == "vehicleTypesTable") {
        response.data.forEach(item => {
            rowsHtml += `
                    <tr>
                        <td>${item.companyName}</td>
                        <td>${item.vehicleTypeName}</td>
                        <td>${item.minimumKms}</td>
                        <td class="text-center" style="cursor:pointer;">`

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditVehicleType(${item.vehicleTypeId})"><i class="ri-edit-2-line"></i></a>`
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="DeleteVehicleType(${item.vehicleTypeId})"><i class="ri-eye-line" ></i></a>`
            //}
            if (IsCancel) {
                rowsHtml += `<a onclick="DeleteVehicleType(${item.vehicleTypeId})" class="icon-btn"><i class="ri-delete-bin-3-line"></i></a>`
            }
            rowsHtml += ` </td></tr> `;
        });
    }
    if (gridTableName == "tableCmpConfig") {
        response.data.forEach(item => {
            rowsHtml += `
                < tr >
                        <td>${item.companyName}</td>
                        <td>${item.smsAuthKey}</td>
                        <td>${item.whatsAppAuthKey}</td>
                        <td>${item.smtpHost}</td>
                        <td>${item.smtpPort}</td>
                        <td>${item.smtpUsername}</td>
                        <td class="text-center s" style="cursor:pointer;">`
            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditCompanyConfiguration(${item.companyConfigId})"><i class="ri-edit-2-line"></i></a>`
            }
            //if (IsView) {
            //    rowsHtml += `<a onclick="ViewCompanyConfiguration(${item.companyConfigId})" class="icon-btn"><i class="ri-eye-line"></i></a>`
            //}
            if (IsCancel) {
                rowsHtml += ` <a class="icon-btn" onclick="DeleteCompanyConfiguration(${item.companyConfigId})"><i class="ri-delete-bin-3-line"></i></a>`
            }
            rowsHtml += ` </td></tr> `;
        });
    }
    if (gridTableName == "vehicleTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.vehicleNo}</td>
            <td>${item.partyName ? item.partyName : ""}</td>
            <td>${item.vehicleTypeName}</td>
            <td>${item.internalMasterName}</td>
            <td class="text-center s" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditVehicle(${item.vehicleId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewVehicle(${item.vehicleId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteVehicle(${item.vehicleId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }

            rowsHtml += `</td></tr>`;
        });

    }
    if (gridTableName == "vendorTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.partyName}</td>
            <td>${item.pinCode}</td>
            <td>${item.contactPerson}</td>
            <td>${item.mobNo}</td>
            <td>${item.whatsAppNo}</td>
            <td>${item.email}</td>
            <td>${item.panNo}</td>
            <td>${item.gstNo}</td>
            <td class="text-center s" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditVendor(${item.partyId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewVendor(${item.partyId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteVendor(${item.partyId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }

            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "franchiseTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td><img src="../../franchiselogo/${item.logoImage}" alt="Logo" height="40"></td>  
            <td>${item.companyName}</td>
            <td>${item.addressLine}</td>
            <td>${item.email}</td>
            <td>${item.contactPerson}</td>
            <td>${item.contactNo}</td>
            <td>${item.mobNo}</td>
            <td>${item.gstNo}</td>
            <td class="text-center s" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditFranchise(${item.companyId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewFranchise(${item.companyId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteFranchise(${item.companyId}, '${item.logoImage}')"><i class="ri-delete-bin-3-line"></i></a>`;
            }

            rowsHtml += `</td></tr>`;
        });

    }
    if (gridTableName == 'driverTable') {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td><img src="../../driverphoto/${item.driverImagePath}" alt="Photo" height="40"></td>  
            <td>${item.licenseNo}</td>
            <td>${item.driverName}</td>
            <td>${driverTypeMap[item.driverTypeId] ?? 'Unknown Type'}</td>
            <td>${item.mobNo}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditDriver(${item.driverId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewDriver(${item.driverId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteDriver(${item.driverId}, '${item.driverImagePath}')"><i class="ri-delete-bin-3-line"></i></a>`;
            }

            rowsHtml += `</td></tr>`;
        });

    }
    if (gridTableName === "customerTable") {
        console.log(window.userRights);
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.partyName}</td>
            <td>${item.pinCode}</td>
            <td>${item.mobNo}</td>
            <td>${item.email}</td>
            <td>${item.panNo}</td>
            <td>${item.gstNo}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditCustomer(${item.partyId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewCustomer(${item.partyId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteCustomer(${item.partyId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }

            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "productTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.companyName}</td>
            <td>${item.itemName}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditProduct(${item.itemId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewProduct(${item.itemId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteProduct(${item.itemId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }

            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "corporateTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.companyName}</td>
            <td>${item.addressLine}</td>
            <td>${item.pinCode}</td>
            <td>${item.contactPerson}</td>
            <td>${item.mobNo}</td>
            <td>${item.contactNo}</td>
            <td>${item.whatsAppNo}</td>
            <td>${item.email}</td>
            <td>${item.panNo}</td>
            <td>${item.gstNo}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditCorporateCompany(${item.companyId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewCorporateCompany(${item.companyId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteCorporateCompany(${item.companyId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }

            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "tableuser") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.personName}</td>
            <td>${item.company}</td>
            <td>${item.location}</td>
            <td>${item.mobileNo}</td>
            <td>${item.emailId}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditUser(${item.userId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewUser(${item.userId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteUser(${item.userId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }
            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "tablelocation") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.locationName}</td>
            <td>${item.addressLine}</td>
            <td>${item.city}</td>
            <td>${item.pinCode}</td>
            <td>${item.contactPerson}</td>
            <td>${item.mobNo}</td>
            <td>${item.contactNo}</td>
            <td>${item.whatsAppNo}</td>
            <td>${item.email}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditLocation(${item.locationId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewLocation(${item.locationId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteLocation(${item.locationId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }
            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "rfqTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.rfqNo}</td>
            <td>${item.location}</td>
            <td>${item.rfqDate ? new Date(item.rfqDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
            <td>${item.expiryDate ? new Date(item.expiryDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).replace(/\//g, '-').replace(',', '').toUpperCase() : ''}</td>
            <td>${item.indentNo}</td>
            <td>${item.customerName}</td>
            <td>${item.vehicleReqOn ? new Date(item.vehicleReqOn).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
            <td>${item.fromLocation}</td>
            <td>${item.toLocation}</td>
            <td>${item.vehicleTypeName}</td>
            <td>${item.vehicleCount}</td>
            <td>${item.maxCosting}</td>
            <td>${item.detentionPerDay}</td>
            <td>${item.detentionFreeDays}</td>
            <td>${item.rfqSubject}</td>
            <td>${item.rfqPriority ? item.rfqPriority : ''}</td>
            <td>${item.rfqType ? item.rfqType : ''}</td>
            <td>${item.itemName ? item.itemName : ''}</td>
            <td>${item.packingTypeName ? item.packingTypeName : ''}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditRfq(${item.rfqId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewRfq(${item.rfqId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteRfq(${item.rfqId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }
            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "rfqFinalizationTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.rfqNo}</td>
            <td>${item.rfqStatus}</td>
            <td>${item.reason ? item.reason : ''}</td>
            <td>${item.billingRate}</td>
            <td>${item.detentionPerDay}</td>
            <td>${item.detentionFreeDays}</td>
            <td>${item.remarks}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="EditRfqFinalization(${item.rfqFinalId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewRfqFinalization(${item.rfqFinalId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteRfqFinalization(${item.rfqFinalId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }
            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "IndentTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.locationName}</td>
            <td>${item.indentNo}</td>
            <td>${item.indentDate ? new Date(item.indentDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
            <td>${item.vehicleReqOn ? new Date(item.vehicleReqOn).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
            <td>${item.partyName}</td>
            <td>${item.fromLocation}</td>
            <td>${item.toLocation}</td>
            <td>${item.vehicleTypeName}</td>
            <td>${item.requiredVehicles}</td>
            <td>${item.expiryDate ? new Date(item.expiryDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }).replace(/\//g, '-').replace(',', '').toUpperCase() : ''}</td>
            <td>${item.consignerName}</td>
            <td>${item.pickUpAddress}</td>
            <td>${item.consigneeName}</td>
            <td>${item.deliveryAddress}</td>
            <td>${item.itemName ? item.itemName : ''}</td>
            <td>${item.pakingName ? item.pakingName : ''}</td>
            <td>${item.remarks}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="UpdateVehicleIndent(${item.indentId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewVehicleIndent(${item.indentId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteVehicleIndent(${item.indentId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }
            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName == "PlacementTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.locationName}</td>
            <td>${item.placementNo}</td>
            <td>${item.placementDate ? new Date(item.placementDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
            <td>${item.indentNo}</td>
            <td>${item.vehicleNo}</td>
            <td>${item.internalMasterName}</td>
            <td>${item.driverName}</td>
            <td>${item.mobileNo}</td>
            <td>${item.ownerVendorName ? item.ownerVendorName : ''}</td>
            <td>${item.brokerVendorName ? item.brokerVendorName : ''}</td>
            <td>${item.totalHireAmount}</td>
            <td>${item.advancePayable}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="UpdateVehiclePlacement(${item.placementId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewVehiclePlacement(${item.placementId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteVehiclePlacement(${item.placementId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }
            rowsHtml += `</td></tr>`;
        });
    }
    if (gridTableName === "ActivityLogTable") {
        response.data.forEach(item => {
            rowsHtml += `
            <tr>
                <td>${item.linkName || ''}</td>
                <td>${item.internalMasterName || ''}</td>
                <td>${item.personName || ''}</td>
                <td>${item.logDateTime
                    ? new Date(item.logDateTime).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }).replace(',', '')
                    : ''
                }</td>
                <td>${item.description || ''}</td>
            </tr>`;
        });
    }
    if (gridTableName == "BookingTable") {
        response.data.forEach(item => {
            rowsHtml += `
        <tr>
            <td>${item.locationName}</td>
            <td>${item.bookingNo}</td>
            <td>${item.bookingDate ? new Date(item.bookingDate).toLocaleDateString('en-GB').replace(/\//g, '-') : ''}</td>
            <td>${item.fromLocation}</td>
            <td>${item.toLocation}</td>
            <td>${item.partyName}</td>
            <td>${item.vehicleNo}</td>
            <td>${item.vehicleTypeName}</td>
            <td>${item.driverName}</td>
            <td>${item.driverMobNo}</td>
            <td>${item.internalMasterName}</td>
            <td class="text-center" style="cursor:pointer;">`;

            if (IsEdit) {
                rowsHtml += `<a class="icon-btn" onclick="UpdateBooking(${item.bookingId})"><i class="ri-edit-2-line"></i></a>`;
            }
            //if (IsView) {
            //    rowsHtml += `<a class="icon-btn" onclick="ViewVehicleIndent(${item.indentId})"><i class="ri-eye-line"></i></a>`;
            //}
            if (IsCancel) {
                rowsHtml += `<a class="icon-btn" onclick="DeleteBooking(${item.bookingId})"><i class="ri-delete-bin-3-line"></i></a>`;
            }
            rowsHtml += `</td></tr>`;
        });
    }
    return rowsHtml;
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
        //const date = new Date(dateString);
        //const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        //return localDate.toISOString().split('T')[0];
    }
}
function ValidateLicenseNo(number) {
    return /^[A-Z]{2}[0-9]{2}(19|20)[0-9]{2}[0-9]{7}$/.test(number);
}
function getVal(selector) {
    const value = $(selector).val();
    return value === "null" || value === null || value === undefined || (typeof value === "string" && value.trim() === "" ? null : value);
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
        UserId: 0,
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
            console.log("Auto Generate Code Success:", response);
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
        console.log(columnName);
        if (columnName.includes('date') || columnName.includes('expiredon') || columnName.includes('reqon')) {
            return true;
        }
        else {
            return false;
        }
    }
}
