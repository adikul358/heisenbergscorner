$("#nas").prop("checked", false)
$('#nas').click(function () {
    $('#section').prop('disabled', function (i, v) {
        return !v;
    });
    $('#grade').prop('disabled', function (i, v) {
        return !v;
    });
});