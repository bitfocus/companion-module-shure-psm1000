import { Fields } from './setup.js'
import { combineRgb } from '@companion-module/base'

/**
 * INTERNAL: initialize feedbacks.
 *
 * @access protected
 * @since 1.0.0
 */
export function updateFeedbacks() {
	this.setFeedbackDefinitions({
		rf_tx_level: {
			type: 'boolean',
			name: 'RF TX Level',
			description: "If the selected channel's RF is set to a level, change the color of the button.",
			style: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [this.CHANNELS_FIELD, Fields.RfTxLevel],
			callback: ({ options }) => {
				return this.api.getChannel(parseInt(options.channel)).rfTxLevel == options.value
			},
		},
		rf_muted: {
			type: 'boolean',
			name: 'RF Mute State',
			description: "If the selected channel's RF is muted/unmuted, change the color of the button.",
			style: {
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0),
			},
			options: [this.CHANNELS_FIELD, Fields.RfMute],
			callback: ({ options }) => {
				return this.api.getChannel(parseInt(options.channel)).rfMute == options.value
			},
		},
		audio_tx_mode: {
			type: 'boolean',
			name: 'Audio TX Mode',
			description: "If the selected channel's audio TX mode is set, change the color of the button.",
			style: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(200, 200, 0),
			},
			options: [this.CHANNELS_FIELD, Fields.AudioTxMode],
			callback: ({ options }) => {
				return this.api.getChannel(parseInt(options.channel)).audioTxMode == options.value
			},
		},
		audio_in_line_level: {
			type: 'boolean',
			name: 'Audio Input Line Level',
			description: "If the selected channel's audio input line level is set, change the color of the button.",
			style: {
				color: combineRgb(0, 0, 0),
				bgcolor: combineRgb(200, 200, 0),
			},
			options: [this.CHANNELS_FIELD, Fields.AudioInLineLevel],
			callback: ({ options }) => {
				return this.api.getChannel(parseInt(options.channel)).audioInLineLevel == options.value
			},
		},
	})
}
