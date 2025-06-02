
var productListDto;
$(document).ready(function () {
    $("#btnCancel").on("click", function () {
        window.location.reload(true);
    });

    $('#listSectionLink').on('click', function (e) {
        e.preventDefault(); // prevent default anchor behavior
        $('#formSection').hide(); // hide the add/edit form
        $('#listSection').show(); // show the list
    });
    $("#btnSaveProduct, #btnSavenewProduct").on('click', function () {
        var action = $(this).data('action');
        SaveProduct(action);
    });

    //$("#btnSaveProduct, #btnSavenewProduct").on('click', function () {
        
    //    var action = $(this).data('action'); // "save" or "saveNew"
    //    if (CheckValidation()) {
    //        SaveProduct(action);
    //    }
    //});
    //$('#btnViewButton').on('click',function () {
    //    FetchProduct();
    //    $("#addProductDiv").css('display', 'none');
    //    $("#backButton").css('display', 'block');
    //});
    //$('#btnUpdateProduct').on('click',function () {
    //    UpdateProduct();
    //});
    //$('#backButton').on('click', function () {
    //    window.location.reload(true);
    //});
    //$("#btnCancel").on("click", function () {
    //    FetchProduct();
    //    $("#addProductDiv").css('display', 'none');
    //    $("#backButton").css('display', 'block');
    //});
    CheckValidation();
    FetchProduct();
    UpdateProduct();
});

$("#btnAddProduct").on("click", function (e) {
    e.preventDefault();
    $("#listSection").hide();
    $("#formSection").show();
});
function CheckValidation() {
    $("#txtItemName").on('blur', function () {
        if (IsNullOrEmpty($(this).val())) {
            toastr.warning("Please enter Item Name","Validation Error");
            return;
        }
    })
}
function CheckNullValidation() {
    var itemName = $('#txtItemName').val();
    if (IsNullOrEmpty(itemName)) {
        toastr.warning("Please enter Item Name","Validation Error");
        return false;
    }
    return true;
}
//function SaveProduct(action) {
//    //if (!CheckValidation()) {
//    //    return;
//    //}
//    var saveProductUrl = "/Product/ProductSave";
//    var itemName = $("#txtItemName").val();
//    var formData = {
//        ItemName: itemName
//    };
//    if (action == "save") {
//        $.ajax({
//            url: saveProductUrl,
//            method: 'POST',
//            contentType: 'application/json',
//            dataType: "json",
//            data: JSON.stringify(formData),
//            success: function (response) {

//                if (response.result == "Success") {
//                    toastr.success("Item Save Successfully!");
//                    window.location.href = "../Dashboard/Dashboard";
//                }
//                else {
//                    toastr.error("Failed to Save Item!");
//                }
//            },
//            error: function (xhr, status, error) {
//                toastr.error("Failed to Save Item!");

//            }
//        });
//    }
//    else if (action == "saveNew") {
//        $.ajax({
//            url: saveProductUrl,
//            method: 'POST',
//            contentType: 'application/json',
//            dataType: "json",
//            data: JSON.stringify(formData),
//            success: function (response) {

//                if (response.result == "Success") {
//                    toastr.success("Item Save successfully!");
//                    $('#productForm')[0].reset();
//                }
//                else {
//                    toastr.error("Failed to Save Item!");
//                }
//            },
//            error: function (xhr, status, error) {
//                toastr.error("Failed to Save Item!");

//            }
//        });
//    }
//}
function SaveProduct(action) {
    if (!CheckNullValidation()) {
        return;
    }
    var saveProductUrl = "/Product/ProductSave";
    var itemName = $("#txtItemName").val();
    var formData = {
        ItemName: itemName
    };
    if (action == "save") {
        $.ajax({
            url: saveProductUrl,
            method: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(formData),
            success: function (response) {

                if (response.result == "Success") {
                    toastr.success("Item Save Successfully!");
                    window.location.href = "../Dashboard/Dashboard";
                }
                else {
                    toastr.error("Failed to Save Item!");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Save Item!");

            }
        });
    }
    else if (action == "saveNew") {
        $.ajax({
            url: saveProductUrl,
            method: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(formData),
            success: function (response) {

                if (response.result == "Success") {
                    toastr.success("Item Save successfully!");
                    $('#productForm')[0].reset();
                }
                else {
                    toastr.error("Failed to Save Item!");
                }
            },
            error: function (xhr, status, error) {
                toastr.error("Failed to Save Item!");

            }
        });
    }
}
function FetchProduct()  {
    $("#listSection").show();
    var fetchProductUrl = "/Product/GetAllProducts";
    $.ajax({
        url: fetchProductUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            let trlist = response;
            productListDto = response;
            if ($.fn.DataTable.isDataTable('#tableProduct')) {
                $('#tableProduct').DataTable().clear();
            }
            const table = $('#tableProduct').DataTable();
            trlist.forEach(item => {
                table.row.add([
                item.companyName,
                item.itemName,
                    `
                    <div class="text-center action-items" style="cursor:pointer;">
                        <a class="icon-btn" onclick="EditProduct(${item.itemId})"><i class="ri-edit-2-line"></i></a>
                        <a class="icon-btn" onclick="DeleteProduct(${item.itemId})"><i class="ri-delete-bin-3-line"></i></a>
                    </div>
                    `
                ]);
            });
            // Redraw table with new data
            table.draw();
            // Update total list count
            $('#totalList').text(`Total List: ${trlist.length}`);
        }
    });
}
function EditProduct(itemId) {
    var data = productListDto.filter(x => x.itemId == itemId);
    var formData = data[0];
    $('#listSection').css('display', 'none');
    $("#formSection").css('display', 'Block');
    $("#backButton").css('display', 'none');
    $("#addProductDiv").css('display', 'Block');
    $("#btnSaveProduct").hide();
    $("#btnUpdateProduct").show();
    $("#btnSavenewProduct").hide();
    $("#btnViewButton").hide();
    $("#btnCancel").removeClass('d-none');
    $("#txtItemName").val(formData.itemName);
    $("#hdnItemId").val(formData.itemId);
}
function UpdateProduct() {
    $("#btnUpdateProduct").on('click', function (e) {
        e.preventDefault();

    if (!CheckNullValidation()) {
        return;
    }
    var updateProductUrl = '/Product/EditProduct';
    var formData = {
        ItemId: $("#hdnItemId").val(),
        ItemName : $("#txtItemName").val()
    }
    $.ajax({
        url: updateProductUrl,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            if (response.result == 'Success') {
                toastr.success("Product Updated Successfully!");
                //$("#addProductDiv").hide();
                //$("#backButton").show();
                //$("#tableDiv").show();
                FetchProduct();
                $("#formSection").hide();
                $("#listSection").show();
                $('#productForm')[0].reset();
                $("#btnUpdateProduct").hide();
                $("#btnSavenewProduct").show();
                $("#btnSaveProduct").show();
            }
            else {
                toastr.error("Failed to update Product", "Error");
            }   
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to submit Vehicle Type", "Error");
        }
    });
    });
}
function DeleteProduct(itemId) {
    var deleteProductUrl = '/Product/DeleteProduct/' + itemId;
    $.ajax({
        url: deleteProductUrl,
        type: "DELETE",
        dataType: "json",
        data: JSON.stringify(itemId),
        success: function (response) {
            toastr.success("Product Deleted Successfully!");
            FetchProduct();
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to Delete Product!", "Error");
        }
    });
}