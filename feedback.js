module.exports = {
	/**
	 * INTERNAL: initialize feedbacks.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initFeedbacks() {
		// feedbacks
		var feedbacks = {}

		feedbacks['rf_tx_level'] = {
			type: 'boolean',
			label: 'RF TX Level',
			description: "If the selected channel's RF is set to a level, change the color of the button.",
			style: {
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(255, 0, 0),
			},
			options: [this.CHANNELS_FIELD, this.RFTXLEVEL_FIELD],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).rfTxLevel == options.value) {
					return true
				} else {
					return false
				}
			},
		}

		feedbacks['rf_muted'] = {
			type: 'boolean',
			label: 'RF Mute State',
			description: "If the selected channel's RF is muted/unmuted, change the color of the button.",
			style: {
				color: this.rgb(255, 255, 255),
				bgcolor: this.rgb(255, 0, 0),
			},
			options: [this.CHANNELS_FIELD, this.RFMUTE_FIELD],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).rfMute == options.value) {
					return true
				} else {
					return false
				}
			},
		}

		feedbacks['audio_tx_mode'] = {
			type: 'boolean',
			label: 'Audio TX Mode',
			description: "If the selected channel's audio TX mode is set, change the color of the button.",
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(200, 200, 0),
			},
			options: [this.CHANNELS_FIELD, this.AUDIOTXMODE_FIELD],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).audioTxMode == options.value) {
					return true
				} else {
					return false
				}
			},
		}

		feedbacks['audio_in_line_level'] = {
			type: 'boolean',
			label: 'Audio Input Line Level',
			description: "If the selected channel's audio input line level is set, change the color of the button.",
			style: {
				color: this.rgb(0, 0, 0),
				bgcolor: this.rgb(200, 200, 0),
			},
			options: [this.CHANNELS_FIELD, this.AUDIOINLINELEVEL_FIELD],
			callback: ({ options }) => {
				if (this.api.getChannel(parseInt(options.channel)).audioInLineLevel == options.value) {
					return true
				} else {
					return false
				}
			},
		}

		this.setFeedbackDefinitions(feedbacks)
	},
}
