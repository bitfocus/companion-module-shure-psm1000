export const Choices = {
	LineLevel: [
		{ id: '0', label: 'Aux (-10 dB)' },
		{ id: '1', label: 'Line (+4 dB)' },
	],
	Mute: [
		{ id: '0', label: 'Unmute', value: 'Unmuted' },
		{ id: '1', label: 'Mute', value: 'Muted' },
	],
	TxLevel: [
		{ id: '10', label: '10 mW' },
		{ id: '50', label: '50 mW' },
		{ id: '100', label: '100 mW' },
	],
	TxMode: [
		{ id: '1', label: 'Mono' },
		{ id: '2', label: 'Point to point' },
		{ id: '3', label: 'Stereo' },
	],
}

export const Fields = {
	AudioInLineLevel: {
		type: 'dropdown',
		label: 'Mode',
		id: 'value',
		default: '1',
		choices: Choices.LineLevel,
	},
	AudioTxMode: {
		type: 'dropdown',
		label: 'Mode',
		id: 'value',
		default: '1',
		choices: Choices.TxMode,
	},
	Frequency: {
		type: 'textinput',
		label: 'Frequency (MHz)',
		id: 'value',
		default: '470.000',
		regex: '/^(4[7-9][0-9]|[5-8][0-9]{2}|9[0-2][0-9]|93[0-7])\\.\\d(00|25|50|75)$/',
	},
	GainSet: {
		type: 'number',
		label: 'Value (dB)',
		id: 'value',
		min: -67,
		max: 0,
		default: -16,
		required: true,
		range: false,
	},
	Name: {
		type: 'textinput',
		label: 'Name (8 characters max)',
		id: 'name',
		default: '',
		regex: '/^.{1,8}$/',
	},
	RfMute: {
		type: 'dropdown',
		label: 'State',
		id: 'value',
		default: '0',
		choices: Choices.Mute,
	},
	RfTxLevel: {
		type: 'dropdown',
		label: 'Level (mW)',
		id: 'value',
		default: '10',
		choices: Choices.TxLevel,
	},
}
