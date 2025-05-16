
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
            let $ratingDiv = $('<div class="rating-stars text-center"></div>');

            for (let i = 5; i >= 1; i--) {
                const id = `${ratingName}_${i}`;
                const radio = `<input type="radio" name="${ratingName}" id="${id}" value="${i}" />`;
                const label = `<label for="${id}"><i class="fa fa-star text-center"></i></label>`;
                $ratingDiv.append(radio).append(label);
            }

            $tdStars.append($ratingDiv);
            $tr.append($tdStars);

            const remarksInput = `<td><input type="text" class="form-control" placeholder="Remarks" /></td>`;
            $tr.append(remarksInput);

            $('#tableDiv').append($tr);
        });
        GetAllVendor();
    });

function GetAllVendor() {
    var getAllOwnerOrVendorUrl = "/Vehicle/GetAllOwnerOrVendor";

    $.ajax({
        url: getAllOwnerOrVendorUrl,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            const ownerdropdown = document.getElementById("drpVendor");
            let placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "Select a Vendor";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            ownerdropdown.appendChild(placeholderOption);


            response.forEach(item => {
                const option = document.createElement("option");
                option.value = item.partyId;
                option.textContent = item.partyName;
                ownerdropdown.appendChild(option);
            });

            $('.selectpicker').selectpicker('refresh');
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch Owner/Vendor Data!", "Error");
        }
    });
}