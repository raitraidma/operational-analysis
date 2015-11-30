var messages = [];
var language = 'et';
messages['et'] = {
	'consumer.needs.no.not.match.warehouse.supplies': 'Tarbjate vajadused ja ladude varud ei ühti',
	'transport.costs.are.missing': 'Veokulud on puudu'
};

function trans(message) {
	var translation = messages[language][message];
	if (!!translation) {
		return translation;
	}
	return message;
}