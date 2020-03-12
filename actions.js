module.exports = {

	/**
	 * INTERNAL: Get the available actions.  Utilized by bmd-multiview.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	getActions() {
		var actions = {};

		actions['set_channel_name'] = {
			label: 'Set channel name',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: '1',
					choices: this.CHOICES_CHANNELS
				},
				{
					type: 'textinput',
					label: 'Name (8 characters max)',
					id: 'name',
					default: '',
					regex: this.REGEX_CHAR_8
				}
			]
		};

		actions['set_audio_in_level'] = {
			label: 'Set audio input level of channel',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: '1',
					choices: this.CHOICES_CHANNELS
				},
				{
					type: 'number',
					label: 'Value (dB)',
					id: 'value',
					min: -67,
					max: 0,
					default: -16,
					required: true,
					range: false
				}
			]
		};

		actions['set_frequency'] = {
			label: 'Set frequency of channel',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: '1',
					choices: this.CHOICES_CHANNELS
				},
				{
					type: 'number',
					label: 'Frequency (MHz)',
					id: 'value',
					min: 470000,
					max: 937500,
					default: 470000,
					required: true
				}
			]
		};

		actions['set_rf_tx_level'] = {
			label: 'Set RF TX level',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: '1',
					choices: this.CHOICES_CHANNELS
				},
				{
					type: 'dropdown',
					label: 'Level (mW)',
					id: 'value',
					default: '10',
					choices: this.CHOICES_RFTXLEVEL
				}
			]
		};

		actions['set_rf_mute'] = {
			label: 'Set RF mute',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: '1',
					choices: this.CHOICES_CHANNELS
				},
				{
					type: 'dropdown',
					label: 'State',
					id: 'value',
					default: '0',
					choices: this.CHOICES_RFMUTE
				}
			]
		};

		actions['set_audio_tx_mode'] = {
			label: 'Set audio TX mode',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: '1',
					choices: this.CHOICES_CHANNELS
				},
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'value',
					default: '1',
					choices: this.CHOICES_AUDIOTXMODE
				}
			]
		};

		actions['set_audio_in_line_level'] = {
			label: 'Set audio input line level',
			options: [
				{
					type: 'dropdown',
					label: 'Channel Number',
					id: 'channel',
					default: '1',
					choices: this.CHOICES_CHANNELS
				},
				{
					type: 'dropdown',
					label: 'Mode',
					id: 'value',
					default: '1',
					choices: this.CHOICE_AUDIOINLINELEVEL
				}
			]
		};

		return actions;
	}
}