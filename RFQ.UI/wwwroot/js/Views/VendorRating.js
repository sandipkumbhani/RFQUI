var vendorlist;
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
    fetchVendorList();
    $('#ddlVendor').on('change', function () {
        const selectedValue = $(this).val();
        const selectedText = $(this).find("option:selected").text();
        const selectedVendor = vendorlist.filter(x => x.partyName == selectedText);
        if (selectedVendor.length > 0) {
            $("#txtPanNumber").val(selectedVendor[0].panNo);
            $("#txtVendorCategory").val(selectedVendor[0].vendorCategoryName);
        }
    });
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
function fetchVendorList() {
    $.ajax({
        url: '/Vendor/GetAllVendorList',
        type: 'GET',
        success: function (data) {
            vendorlist = data;
            const select = document.getElementById("ddlVendor");
            select.innerHTML = "";
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Category";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            select.appendChild(placeholderOption);

            vendorlist.forEach(option => {
                let opt = document.createElement("option");
                opt.value = option.partyId;
                opt.textContent = option.partyName;
                select.appendChild(opt);
            });
            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            console.error("Error fetching vendor list:", error);
        }
    });
}
