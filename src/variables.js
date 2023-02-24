/**
 * INTERNAL: initialize variables.
 *
 * @access protected
 * @since 1.0.0
 */
export function updateVariables() {
	let variables = []

	for (let i = 1; i <= 2; i++) {
		let prefix = `ch_${i}`

		variables.push({ variableId: `${prefix}_name`, name: `Channel ${i} Name` })
		variables.push({ variableId: `${prefix}_audio_in_level`, name: `Channel ${i} Audio In Level` })
		variables.push({ variableId: `${prefix}_group_chan`, name: `Channel ${i} Group & Channel` })
		variables.push({ variableId: `${prefix}_frequency`, name: `Channel ${i} Frequency` })
		variables.push({ variableId: `${prefix}_rf_tx_level`, name: `Channel ${i} RF TX Level` })
		variables.push({ variableId: `${prefix}_rf_mute`, name: `Channel ${i} RF Mute` })
		variables.push({ variableId: `${prefix}_audio_tx_mode`, name: `Channel ${i} Audio TX Mode` })
		variables.push({ variableId: `${prefix}_audio_in_line_level`, name: `Channel ${i} Audio In Line Level` })
		variables.push({ variableId: `${prefix}_audio_in_level_l`, name: `Channel ${i} Audio In Level L` })
		variables.push({ variableId: `${prefix}_audio_in_level_r`, name: `Channel ${i} Audio In Level R` })
	}

	variables.push({ variableId: 'device_id', name: 'Device ID' })

	this.setVariableDefinitions(variables)
}
