
$(document).ready(function () {

    

    const criteriaList = [
        "Cost & Pricing", "Vehicle Conditions", "Vendor Communication",
        "SLA / Delivery Efficiency", "Tracking Enabled Vehicles", "Statutory Compliance"
    ];

    criteriaList.forEach(function (criteria) {
        const ratingName = "rating_" + criteria.replace(/\s|\/|&/g, '');

        let $tr = $('<tr></tr>');
        $tr.append(`<td align="left">${criteria}</td>`);

        let $tdStars = $('<td colspan="5"></td>');
        let $ratingDiv = $(`<div class="rating-stars text-center" data-rating-name="${ratingName}"></div>`);

        for (let i = 1; i <= 5; i++) {
            const id = `${ratingName}_${i}`;
            const radio = `<input type="radio" name="${ratingName}" id="${id}" value="${i}" style="display:none;" />`;
            const label = `<label data-index="${i}" for="${id}" style="font-size: 24px; color: #ccc; cursor: pointer;">★</label>`;
            $ratingDiv.append(radio).append(label);
        }

        $tdStars.append($ratingDiv);
        $tr.append($tdStars);

        const remarksInput = `<td><input type="text" class="form-control" placeholder="Remarks" /></td>`;
        $tr.append(remarksInput);

        $('#tableDiv').append($tr);
    });
        GetAllPakingType();
        GetAllInternalMaster();
});

$(document).on('click', '.rating-stars label', function () {
    const $label = $(this);
    const $ratingDiv = $label.closest('.rating-stars');
    const ratingName = $ratingDiv.data('rating-name');
    const selectedIndex = parseInt($label.attr('data-index'));

    // Reset all stars
    $ratingDiv.find('label').each(function () {
        $(this).css('color', '#ccc');
    });

    // Highlight selected stars
    $ratingDiv.find('label').each(function () {
        if (parseInt($(this).attr('data-index')) <= selectedIndex) {
            $(this).css('color', 'gold');
        }
    });

    // Check the corresponding radio button
    $ratingDiv.find(`input#${ratingName}_${selectedIndex}`).prop('checked', true);
});


function GetAllPakingType() {
    var getUrl = '/CompanyMasterPackingType/GetAllMasterPackingType';
    $.ajax({
        url: getUrl,
        type: "GET",
        contentType: "application/json",
        success: function (response) {
            const vehicleTypedropdown = document.getElementById("ddlPakingType");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a PakingType";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            vehicleTypedropdown.appendChild(placeholderOption);
            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.packingId;
                option.textContent = item.packingName;
                vehicleTypedropdown.appendChild(option);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Paking Type!", "Error");
        }
    });
}

function GetAllInternalMaster() {
    var getInternalMasterUrl = '/Vendor/GetAllInternalMaster'
    $.ajax({
        url: getInternalMasterUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            BindDropDown(response)
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Fetch Data!", "Error");
        }
    });
}
function BindDropDown(data) {

    let internalData = data.filter(x => x.internalMasterTypeId == 3);
    const select = document.getElementById("ddlVendorCategory");
    select.innerHTML = "";

    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a Category";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.appendChild(placeholderOption);

    internalData.forEach(option => {
        let opt = document.createElement("option");
        opt.value = option.internalMasterId;
        opt.textContent = option.internalMasterName;
        select.appendChild(opt);
    });

    $('.selectpicker').selectpicker('refresh');
}