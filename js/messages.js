var messages = [];
var language = 'et';
messages['et'] = {
	'consumer.needs.no.not.match.warehouse.supplies': 'Tarbjate vajadused ja ladude varud ei ühti'
};

function trans(message) {
	var translation = messages[language][message];
	if (!!translation) {
		return translation;
	}
	return message;
}