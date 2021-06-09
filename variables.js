module.exports = {
	/**
	 * INTERNAL: initialize variables.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initVariables() {
		// variable_set
		var variables = []

		for (let i = 1; i <= 2; i++) {
			let prefix = `ch_${i}`

			variables.push({ name: `${prefix}_name`, label: `Channel ${i} Name` })
			variables.push({ name: `${prefix}_audio_in_level`, label: `Channel ${i} Audio In Level` })
			variables.push({ name: `${prefix}_group_chan`, label: `Channel ${i} Group & Channel` })
			variables.push({ name: `${prefix}_frequency`, label: `Channel ${i} Frequency` })
			variables.push({ name: `${prefix}_rf_tx_level`, label: `Channel ${i} RF TX Level` })
			variables.push({ name: `${prefix}_rf_mute`, label: `Channel ${i} RF Mute` })
			variables.push({ name: `${prefix}_audio_tx_mode`, label: `Channel ${i} Audio TX Mode` })
			variables.push({ name: `${prefix}_audio_in_line_level`, label: `Channel ${i} Audio In Line Level` })
			variables.push({ name: `${prefix}_audio_in_level_l`, label: `Channel ${i} Audio In Level L` })
			variables.push({ name: `${prefix}_audio_in_level_r`, label: `Channel ${i} Audio In Level R` })
		}

		variables.push({ name: 'device_id', label: 'Device ID' })

		this.setVariableDefinitions(variables)
	},
}
