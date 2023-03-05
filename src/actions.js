import { Fields } from './setup.js'

/**
 * INTERNAL: Set the available actions.
 *
 * @access protected
 * @since 1.0.0
 */
export function updateActions() {
	this.setupChannelChoices()

	this.setActionDefinitions({
		set_channel_name: {
			name: 'Set channel name',
			options: [this.CHANNELS_FIELD, Fields.Name],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} CHAN_NAME ${options.name}`)
			},
		},
		set_audio_in_level: {
			name: 'Set audio input level of channel',
			options: [this.CHANNELS_FIELD, Fields.GainSet],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} AUDIO_IN_LVL ${options.value}`)
			},
		},
		set_frequency: {
			name: 'Set frequency of channel',
			options: [this.CHANNELS_FIELD, Fields.Frequency],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} FREQUENCY ${options.value.replace('.', '')}`)
			},
		},
		set_rf_tx_level: {
			name: 'Set RF TX level',
			options: [this.CHANNELS_FIELD, Fields.RfTxLevel],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} RF_TX_LVL ${options.value}`)
			},
		},
		set_rf_mute: {
			name: 'Set RF mute',
			options: [this.CHANNELS_FIELD, Fields.RfMute],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} RF_MUTE ${options.value}`)
			},
		},
		set_audio_tx_mode: {
			name: 'Set audio TX mode',
			options: [this.CHANNELS_FIELD, Fields.AudioTxMode],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} AUDIO_TX_MODE ${options.value}`)
			},
		},
		set_audio_in_line_level: {
			name: 'Set audio input line level',
			options: [this.CHANNELS_FIELD, Fields.AudioInLineLevel],
			callback: ({ options }) => {
				this.sendCommand(`SET ${options.channel} AUDIO_IN_LINE_LVL ${options.value}`)
			},
		},
	})
}
