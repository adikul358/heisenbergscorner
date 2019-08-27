$.session.set('changes', {});
$('tr').map(() => {
	$.session.get('changes')[$(this).attr('id')] = [null, null];
})
$("td.ans").click(function () {
	if ($(this).hasClass('a1')) {
		index = 0
	} else {
		index = 1
	}
	if ($(this).hasClass('bg-success')) {
		$(this).removeClass('bg-success')
		$(this).addClass('bg-danger')
		btid = $(this).parent().attr('id');
		$.session.get('changes')[btid][index] = false;
	} else {
		$(this).removeClass('bg-danger')
		$(this).addClass('bg-success')
		btid = $(this).parent().attr('id');
		$.session.get('changes')[btid][index] = true;
	}
});
$("button").click(() => {
	console.log($.session.get('changes'))
})