module.exports = {
	/**
	 * INTERNAL: Set the available actions.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	 initActions() {
		this.setupChannelChoices()

		let actions = {}

		actions['set_channel_name'] = {
			label: 'Set channel name',
			options: [this.CHANNELS_FIELD, this.NAME_FIELD],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} CHAN_NAME ${options.name}`)
			},
		}

		actions['set_audio_in_level'] = {
			label: 'Set audio input level of channel',
			options: [this.CHANNELS_FIELD, this.GAIN_SET_FIELD],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} AUDIO_IN_LVL ${options.value}`)
			},
		}

		actions['set_frequency'] = {
			label: 'Set frequency of channel',
			options: [this.CHANNELS_FIELD, this.FREQUENCY_FIELD],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} FREQUENCY ${options.value.replace('.', '')}`)
			},
		}

		actions['set_rf_tx_level'] = {
			label: 'Set RF TX level',
			options: [this.CHANNELS_FIELD, this.RFTXLEVEL_FIELD],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} RF_TX_LVL ${options.value}`)
			},
		}

		actions['set_rf_mute'] = {
			label: 'Set RF mute',
			options: [this.CHANNELS_FIELD, this.RFMUTE_FIELD],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} RF_MUTE ${options.value}`)
			},
		}

		actions['set_audio_tx_mode'] = {
			label: 'Set audio TX mode',
			options: [this.CHANNELS_FIELD, this.AUDIOTXMODE_FIELD],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} AUDIO_TX_MODE ${options.value}`)
			},
		}

		actions['set_audio_in_line_level'] = {
			label: 'Set audio input line level',
			options: [this.CHANNELS_FIELD, this.AUDIOINLINELEVEL_FIELD],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} AUDIO_IN_LINE_LVL ${options.value}`)
			},
		}

		this.setActions(actions)
	},
}
