$.session.set('changes', {});
$("td.ans").click(function () {
	if ($(this).hasClass('bg-success')) {
		$(this).removeClass('bg-success')
		$(this).addClass('bg-danger')
		btid = $(this).parent().attr('id');
		// chobj = {};
		// chobj[btid] = true;
		// $.session.get('changes').push(chobj);
		$.session.get('changes')[btid] =false;
	} else {
		$(this).removeClass('bg-danger')
		$(this).addClass('bg-success')
		btid = $(this).parent().attr('id');
		// chobj = {};
		// chobj[btid] = false;
		$.session.get('changes')[btid] =true;
	}
});
$("button").click(() => {
	console.log($.session.get('changes'))
})