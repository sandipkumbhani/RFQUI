$(document).ready(function () {
    loadVendorCosting();
});
function loadVendorCosting() {
    $.ajax({
        type: "POST",
        url: "/ReceivedVendorCosting/GetAllReceivedVendorCosting",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.statusCode === 200) {
                console.log("✅ Data received:", response.data);
                BindTable(response.data)
            } else {
                console.warn("⚠️ " + response.message);
            }
        },
        error: function (xhr, status, error) {
            toastr.error("Somthing Went Wrong", "error");
        }
    });
}
function openModal(row) {
    $('#quoteVendorModal').modal('show');
    //$("#rfqrateId").val("123");
    $("#txtRFQNo").val(row.rfqNumber);
    $("#txtRFQDate").val(row.rfqDate.split('T')[0]);
    $("#txtExpireOn").val(row.rfqExpiredOn);
    $("#txtVehicleReqOn").val(row.vehicleRequiredOn.split('T')[0]);
    $("#txtVednorName").val(row.vendorName);
    $("#txtPANNo").val(row.panNo);
    $("#ddlOrigin").val(row.origin);
    $("#ddlDestination").val(row.destination);
    $("#ddlVehicleType").val(row.vehicleType);
    $("#txtNoOfVehicles").val(row.vehicleCount);
    $("#ddlItemName").val(row.itemName);
    $("#ddlPackingType").val(row.packingName);
    $("#txtInstruction").val(row.specialInstruction);
    $("#txtAvailableVehicle").val(row.availableVehicle);
    $("#txtHireCost").val(row.totalHireCost);
    $("#txtDetentionDay").val(row.detentionPerDay);
    $("#txtDetentionFreeDays").val(row.detentionFreeDays);
}
function BindTable(data) {
    const tbody = $("#rcostingReceivedTable tbody");
    tbody.empty();
    if (!data || data.length === 0) {
        tbody.append('<tr><td colspan="16" class="text-center">No records found</td></tr>');
        return;
    }
    data.forEach((row, index) => {
        console.log(row);
        const safeRow = $('<div>').text(JSON.stringify(row)).html(); // Prevent XSS
        const rowHtml = `
      <tr data-index="${index}" data-row='${safeRow}'>
        <td>${index + 1}</td>
        <td>${row.indentNumber}</td>
        <td>${FormatDateToLocal(row.indentDate)}</td>
        <td>${row.rfqNumber}</td>
        <td>${FormatDateToLocal(row.rfqDate)}</td>
        <td>${row.customerName}</td>
        <td>${FormatDateToLocal(row.rfqExpiredOn)}</td>
        <td>${FormatDateToLocal(row.vehicleRequiredOn)}</td>
        <td>${row.origin}</td>
        <td>${row.destination}</td>
        <td>${row.vehicleType}</td>
        <td>${row.availableVehicle}</td>
        <td>${row.vendorName}</td>
        <td>${row.totalHireCost}</td>
        <td>${row.vendorPosition}</td>
        <td>${row.specialInstruction}</td>
        <td>${row.detentionPerDay}</td>
        <td>${row.detentionFreeDays}</td>
        <td>${row.vehicleCount}</td>
        <td>${row.packingName}</td>
        <td>${row.itemName}</td>
        <td>${row.panNo}</td>
        <td>${row.email}</td>
        <td><a href="#" class="view-quote">View Quote</a></td>
        <td style="text-align:center;">
          <input type="checkbox" class="select-row" data-index="${index}" ${row.askForReBid ? 'checked' : ''}>
        </td>
      </tr>`;
        tbody.append(rowHtml);
    });

    // Event: view-quote
    $('#rcostingReceivedTable').off('click', '.view-quote').on('click', '.view-quote', function (e) {
        e.preventDefault();
        const rowData = JSON.parse($(this).closest('tr').attr('data-row'));
        openModal(rowData);
    });

    // Send Email
    $("#SendMail").on('click', async function (e) {
        console.log("Send Mail Clicked");
        e.preventDefault();
        const selectedData = $('#rcostingReceivedTable tbody tr').map((_, tr) => {
            const checkbox = $(tr).find('.select-row');
            if (checkbox.is(':checked')) {
                const rowData = $(tr).attr('data-row');
                return JSON.parse(rowData);
            }
        }).get().filter(Boolean);
        console.log(selectedData);
        if (!selectedData.length) {
            toastr.warning('Please select at least one row.');
            return;
        }

        for (const rowData of selectedData) {
            var check = await SendEmail(rowData);
            if (!IsNullOrEmpty(check) && check) {
                toastr.success(`${rowData.vendorName} email(s) sent successfully.`);
            } else {
                toastr.error(`${rowData.vendorName} email(s) failed to send.`);
            }
        }
    });
}

function SendEmail(rowData) {
    return $.ajax({
        url: '/ReceivedVendorCosting/SendEmail',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(rowData),
        success: (res) => {
            console.log("Email sent successfully:", res);
        },
        error: function (xhr) {
            console.log("Email Not failed to send:", res);
        }
    });
}

