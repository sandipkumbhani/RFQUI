
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
    });