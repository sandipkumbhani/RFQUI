$(document).ready(function () {
    GetAllUser();
});

function GetAllUser() {
    debugger;
    $("#tableDiv").removeClass('d-none');
    var getUrl = '/Dashboard/Dashboard';
    $.ajax({
        url: getUrl,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log(response)
            var trlist = response;
            if ($.fn.DataTable.isDataTable('#tableDashboard')) {
                $('#tableDashboard').DataTable().clear().destroy();
            }
            $('#tableDashboard').DataTable({
                "processing": true,
                "serverSide": false,
                "paging": true,
                "pageLength": 10,
                "lengthChange": true,
                "searching": true,
                "ordering": false,
                "info": true,
                "autoWidth": true,
                "responsive": true,
                "scrollX": true,
                "data": trlist,
                "columns": [
                    { "data": "personName" },
                    { "data": "company" },
                    { "data": "location" },
                    { "data": "mobileNo" },
                    { "data": "emailId" },
                    {
                        "data": "userId",
                        "render": function (data, type, row) {
                            return `
                               <div class="btn-group" role="group">
                               <button type="button" class="btn btn-sm btn-primary"
                               onclick="Edituserlist(${data})">
                               <i class="ti ti-edit"></i> Edit
                               </button>
                               <button type="button" class="btn btn-sm btn-danger"
                               onclick="Deleteuserlist(${data})">
                               <i class="ti ti-trash"></i> Delete
                               </button>
                              </div>`;
                        }
                    },
                ],
                "columnDefs": [{
                    "targets": "_all",
                    "className": "text-center"
                }]
            });
        },
        error: function (xhr, status, error) {
            toastr.error("Failed to fetch data!", "Error");
        }
    });
};