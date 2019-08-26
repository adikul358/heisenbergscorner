function checkans(element) {
	if (element.hasClass('a1')) {
		return 0
	} else if (element.hasClass('a2')) {
		return 1
	}
	return null
}

$.session.set('changes', {});
$("td.ans").click(function () {
	if ($(this).hasClass('bg-success')) {
		$(this).removeClass('bg-success')
		$(this).addClass('bg-danger')
		btid = $(this).parent().attr('id');
		$.session.get('changes')[btid] = [];
		ansindex = checkans($(this));
		if (ansindex) $.session.get('changes')[btid][ansindex] = false;
	} else {  
		$(this).removeClass('bg-danger')
		$(this).addClass('bg-success')
		btid = $(this).parent().attr('id');
		$.session.get('changes')[btid] = [];
		ansindex = checkans($(this))
		console.log(ansindex)
		if (ansindex) $.session.get('changes')[btid][ansindex] = true;
	}
});
$("button").click(() => {
	console.log($.session.get('changes'))
	// window.location.href = window.location + "/changes"
})