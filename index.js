var tcp = require('../../tcp')
var instance_skel = require('../../instance_skel')
var upgrades = require('./upgrades')

/**
 * Companion instance class for the Shure PSM1000 Wireless IEM.
 *
 * @extends instance_skel
 * @since 1.0.0
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class instance extends instance_skel {
	/**
	 * Create an instance of a shure psm1000 module.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system, id, config) {
		super(system, id, config)

		this.deviceName = ''
		this.initDone = false

		let instance_api = require('./internalAPI')
		let actions = require('./actions')
		let feedback = require('./feedback')
		let variables = require('./variables')

		Object.assign(this, {
			...actions,
			...feedback,
			...variables,
		})

		this.api = new instance_api(this)

		this.setupFields()

		this.initActions() // export actions
	}

	/**
	 * Provide the upgrade scripts for the module
	 * @returns {function[]} the scripts
	 * @static
	 * @since 1.1.0
	 */
	static GetUpgradeScripts() {
		return [instance_skel.CreateConvertToBooleanFeedbackUpgradeScript(upgrades.BooleanFeedbackUpgradeMap)]
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	config_fields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				default: 2202,
				width: 2,
				regex: this.REGEX_PORT,
			},
			{
				type: 'checkbox',
				id: 'meteringOn',
				label: 'Enable Metering?',
				width: 2,
				default: true,
			},
			{
				type: 'number',
				id: 'meteringInterval',
				label: 'Metering Interval (in ms)',
				width: 4,
				min: 1000,
				max: 99999,
				default: 5000,
				required: true,
			},
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		this.debug('destroy', this.id)
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	init() {
		debug = this.debug
		log = this.log

		this.status(this.STATUS_WARNING, 'Connecting')

		this.initVariables()
		this.initFeedbacks()

		this.initTCP()
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initTCP() {
		var receivebuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.config.port === undefined) {
			this.config.port = 2202
		}

		if (this.config.host) {
			this.socket = new tcp(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.status(status, message)
			})

			this.socket.on('error', (err) => {
				this.debug('Network error', err)
				this.log('error', `Network error: ${err.message}`)
			})

			this.socket.on('connect', () => {
				this.debug('Connected')
				let cmd = '< GET DEVICE_NAME >\r\n'
				cmd += '< GET 1 CHAN_NAME >\r\n'
				cmd += '< GET 1 AUDIO_IN_LVL >\r\n'
				cmd += '< GET 1 GROUP_CHAN >\r\n'
				cmd += '< GET 1 FREQUENCY >\r\n'
				cmd += '< GET 1 RF_TX_LVL >\r\n'
				cmd += '< GET 1 RF_MUTE >\r\n'
				cmd += '< GET 1 AUDIO_TX_MODE >\r\n'
				cmd += '< GET 1 AUDIO_IN_LINE_LVL >\r\n'
				cmd += '< GET 2 CHAN_NAME >\r\n'
				cmd += '< GET 2 AUDIO_IN_LVL >\r\n'
				cmd += '< GET 2 GROUP_CHAN >\r\n'
				cmd += '< GET 2 FREQUENCY >\r\n'
				cmd += '< GET 2 RF_TX_LVL >\r\n'
				cmd += '< GET 2 RF_MUTE >\r\n'
				cmd += '< GET 2 AUDIO_TX_MODE >\r\n'
				cmd += '< GET 2 AUDIO_IN_LINE_LVL >\r\n'

				if (this.config.meteringOn === true) {
					cmd += `< SET 1 METER_RATE ${this.config.meteringInterval} >\r\n`
					cmd += `< SET 2 METER_RATE ${this.config.meteringInterval} >\r\n`
				}

				this.socket.send(cmd)

				this.initActions() // export actions
			})

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				var i = 0,
					line = '',
					offset = 0
				receivebuffer += chunk

				while ((i = receivebuffer.indexOf('>', offset)) !== -1) {
					line = receivebuffer.substr(offset, i - offset)
					offset = i + 1
					this.socket.emit('receiveline', line.toString())
				}

				receivebuffer = receivebuffer.substr(offset)
			})

			this.socket.on('receiveline', (line) => {
				this.processShureCommand(line.replace('< ', '').trim())
			})
		}
	}

	/**
	 * INTERNAL: Routes incoming data to the appropriate function for processing.
	 *
	 * @param {string} command - the command/data type being passed
	 * @access protected
	 * @since 1.0.0
	 */
	processShureCommand(command) {
		if ((typeof command === 'string' || command instanceof String) && command.length > 0) {
			let commandArr = command.split(' ')
			let commandType = commandArr.shift()
			let commandNum = parseInt(commandArr[0])

			if (commandType == 'REPORT') {
				//this is a report command

				if (isNaN(commandNum)) {
					//this command isn't about a specific channel
					this.api.updateReceiver(commandArr[0], commandArr[1])
				} else {
					//this command is about a specific channel
					this.api.updateChannel(commandNum, commandArr[1], commandArr[2])
				}
			}
		}
	}

	/**
	 * INTERNAL: send a command to the receiver.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	sendCommand(cmd) {
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.connected) {
				this.socket.send(`< ${cmd} >\r\n`)
			} else {
				this.debug('Socket not connected :(')
			}
		}
	}

	/**
	 * INTERNAL: use data to define the channel choice.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	setupChannelChoices() {
		this.CHOICES_CHANNELS = []

		for (var i = 1; i <= 2; i++) {
			var data = `Channel ${i}`

			if (this.api.getChannel(i).name != '') {
				data += ` (${this.api.getChannel(i).name})`
			}

			this.CHOICES_CHANNELS.push({ id: i, label: data })
		}

		this.CHANNELS_FIELD.choices = this.CHOICES_CHANNELS
	}

	/**
	 * Set up the fields used in actions and feedbacks
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	setupFields() {
		this.CHOICES_CHANNELS = []

		this.AUDIOINLINELEVEL_FIELD = {
			type: 'dropdown',
			label: 'Mode',
			id: 'value',
			default: '1',
			choices: [
				{ id: '0', label: 'Aux (-10 dB)' },
				{ id: '1', label: 'Line (+4 dB)' },
			],
		}
		this.AUDIOTXMODE_FIELD = {
			type: 'dropdown',
			label: 'Mode',
			id: 'value',
			default: '1',
			choices: [
				{ id: '1', label: 'Mono' },
				{ id: '2', label: 'Point to point' },
				{ id: '3', label: 'Stereo' },
			],
		}
		this.CHANNELS_FIELD = {
			type: 'dropdown',
			label: 'Channel Number',
			id: 'channel',
			default: '1',
			choices: this.CHOICES_CHANNELS,
		}
		this.FREQUENCY_FIELD = {
			type: 'textinput',
			label: 'Frequency (MHz)',
			id: 'value',
			default: '470.000',
			regex: '/^(4[7-9][0-9]|[5-8][0-9]{2}|9[0-2][0-9]|93[0-7])\\.\\d(00|25|50|75)$/',
		}
		this.GAIN_SET_FIELD = {
			type: 'number',
			label: 'Value (dB)',
			id: 'value',
			min: -67,
			max: 0,
			default: -16,
			required: true,
			range: false,
		}
		this.NAME_FIELD = {
			type: 'textinput',
			label: 'Name (8 characters max)',
			id: 'name',
			default: '',
			regex: '/^.{1,8}$/',
		}
		this.RFMUTE_FIELD = {
			type: 'dropdown',
			label: 'State',
			id: 'value',
			default: '0',
			choices: [
				{ id: '0', label: 'Unmute', value: 'Unmuted' },
				{ id: '1', label: 'Mute', value: 'Muted' },
			],
		}
		this.RFTXLEVEL_FIELD = {
			type: 'dropdown',
			label: 'Level (mW)',
			id: 'value',
			default: '10',
			choices: [
				{ id: '10', label: '10 mW' },
				{ id: '50', label: '50 mW' },
				{ id: '100', label: '100 mW' },
			],
		}
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	updateConfig(config) {
		var resetConnection = false
		var cmd

		if (this.config.host != config.host) {
			resetConnection = true
		}

		if (this.config.meteringOn !== config.meteringOn) {
			if (config.meteringOn === true) {
				cmd = `< SET 1 METER_RATE ${this.config.meteringInterval} >\r\n`
				cmd += `< SET 2 METER_RATE ${this.config.meteringInterval} >\r\n`
			} else {
				cmd = '< SET 1 METER_RATE 0 >\r\n< SET 2 METER_RATE 0 >\r\n'
			}
		} else if (this.config.meteringRate != config.meteringRate && this.config.meteringOn === true) {
			cmd = `< SET 1 METER_RATE ${config.meteringInterval} >\r\n`
			cmd += `< SET 2 METER_RATE ${config.meteringInterval} >\r\n`
		}

		this.config = config

		this.initActions()
		this.initFeedbacks()
		this.initVariables()

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		} else if (cmd !== undefined) {
			this.socket.send(cmd)
		}
	}
}

exports = module.exports = instance
