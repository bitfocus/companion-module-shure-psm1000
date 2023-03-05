import {
	CreateConvertToBooleanFeedbackUpgradeScript,
	InstanceBase,
	Regex,
	runEntrypoint,
	TCPHelper,
} from '@companion-module/base'
import { updateActions } from './actions.js'
import { updateFeedbacks } from './feedback.js'
import { updateVariables } from './variables.js'
import Psm1000Api from './internalAPI.js'
import { BooleanFeedbackUpgradeMap } from './upgrades.js'

/**
 * Companion instance class for the Shure PSM1000 Wireless IEM.
 *
 * @extends InstanceBase
 * @since 1.0.0
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class ShurePsm1000Instance extends InstanceBase {
	/**
	 * Create an instance of a shure psm1000 module.
	 *
	 * @param {Object} internal - Companion internals
	 * @since 1.0.0
	 */
	constructor(internal) {
		super(internal)

		this.updateActions = updateActions.bind(this)
		this.updateFeedbacks = updateFeedbacks.bind(this)
		this.updateVariables = updateVariables.bind(this)
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	async configUpdated(config) {
		let resetConnection = false
		let cmd

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

		this.updateActions()
		this.updateFeedbacks()
		this.updateVariables()

		if (resetConnection === true || this.socket === undefined) {
			this.initTCP()
		} else if (cmd !== undefined) {
			this.socket.send(cmd)
		}
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	async destroy() {
		if (this.socket !== undefined) {
			this.socket.destroy()
		}

		if (this.heartbeatInterval !== undefined) {
			clearInterval(this.heartbeatInterval)
		}

		if (this.heartbeatTimeout !== undefined) {
			clearTimeout(this.heartbeatTimeout)
		}

		this.log('debug', 'destroy', this.id)
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	getConfigFields() {
		return [
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				default: 2202,
				width: 2,
				regex: Regex.PORT,
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
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @param {Object} config - the configuration
	 * @access public
	 * @since 1.0.0
	 */
	async init(config) {
		this.config = config
		this.deviceName = ''
		this.initDone = false

		this.heartbeatInterval = null
		this.heartbeatTimeout = null

		this.CHOICES_CHANNELS = []

		this.updateStatus('disconnected', 'Connecting')

		this.api = new Psm1000Api(this)

		this.setupFields()

		this.updateActions()
		this.updateVariables()
		this.updateFeedbacks()

		this.initTCP()
	}

	/**
	 * INTERNAL: use setup data to initalize the tcp socket object.
	 *
	 * @access protected
	 * @since 1.0.0
	 */
	initTCP() {
		this.receiveBuffer = ''

		if (this.socket !== undefined) {
			this.socket.destroy()
			delete this.socket
		}

		if (this.heartbeatInterval !== undefined) {
			clearInterval(this.heartbeatInterval)
		}

		if (this.heartbeatTimeout !== undefined) {
			clearTimeout(this.heartbeatTimeout)
		}

		if (this.config.port === undefined) {
			this.config.port = 2202
		}

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.log('error', `Network error: ${err.message}`)
			})

			this.socket.on('connect', () => {
				this.log('debug', 'Connected')
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

				this.heartbeatInterval = setInterval(() => {
					this.socket.send('< GET 1 METER_RATE >\r\n')
				}, 30000)

				this.updateActions()
				this.updateFeedbacks()
			})

			// separate buffered stream into lines with responses
			this.socket.on('data', (chunk) => {
				let i = 0,
					line = '',
					offset = 0
				this.receiveBuffer += chunk

				while ((i = this.receiveBuffer.indexOf('>', offset)) !== -1) {
					line = this.receiveBuffer.substr(offset, i - offset)
					offset = i + 1
					this.socket.emit('receiveline', line.toString())
				}

				this.receiveBuffer = this.receiveBuffer.substr(offset)
			})

			this.socket.on('receiveline', (line) => {
				this.processShureCommand(line.replace('< ', '').trim())

				if (line.match(/METER_RATE/)) {
					if (this.heartbeatTimeout !== undefined) {
						clearTimeout(this.heartbeatTimeout)
					}

					this.heartbeatTimeout = setTimeout(this.initTCP.bind(this), 60000)
				}
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
				this.log('debug', 'Socket not connected :(')
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

		for (let i = 1; i <= 2; i++) {
			let data = `Channel ${i}`

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
		this.CHANNELS_FIELD = {
			type: 'dropdown',
			label: 'Channel Number',
			id: 'channel',
			default: '1',
			choices: this.CHOICES_CHANNELS,
		}
	}
}

runEntrypoint(ShurePsm1000Instance, [CreateConvertToBooleanFeedbackUpgradeScript(BooleanFeedbackUpgradeMap)])
