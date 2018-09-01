// ====================================================== USER OPTIONS =========================================================

// Set this to false if you do not want the volume of samples to be proportional to how hard you press the big buttons. When this is false, the sampler buttons will play the samplers at whatever volume the sample deck is set to.
MiniboxTwister.samplerVelocityAsVolume = true
// The higher this is, the less hard you have to strike the sample pads to play samples loudly (when MiniboxTwister.samplerVelocityAsVolume is true).
MiniboxTwister.samplerSensitivity = 4

// Adjust sensitivity of EQs (range 1-7, only use integers)
MiniboxTwister.eqSensitivity = 6

// Set these to true to enable vinyl mode for that deck on startup. This will also enable vinyl control on startup.
MiniboxTwister.vinylMode = {'[Channel1]': false, '[Channel2]': false, '[Channel3]': false, '[Channel4]': false}

/**
 * Minibox Twister controller script 1.1.1 for Mixxx 1.12
 * Copyright (C) 2018 B_A_T <monsieurgrosconnard@gmail.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


**/

// ==================================================== GLOBAL VARIABLES =======================================================

function MiniboxTwister() {}

MiniboxTwister.colorCodes = {
    'off': 0,
    'green': 1,
    'red': 4,
    'yellow': 8,
    'blue': 16,
    'cyan': 32,
    'magenta': 64,
    'white': 127
}
MiniboxTwister.deckColor = {
    '[Channel1]': MiniboxTwister.colorCodes['blue'],
    '[Channel2]': MiniboxTwister.colorCodes['blue'],
    '[Channel3]': MiniboxTwister.colorCodes['magenta'],
    '[Channel4]': MiniboxTwister.colorCodes['magenta']
}
MiniboxTwister.hotcueColors = [
    MiniboxTwister.colorCodes['cyan'],
    MiniboxTwister.colorCodes['green'],
    MiniboxTwister.colorCodes['red'],
    MiniboxTwister.colorCodes['white']
]

MiniboxTwister.encoders = {
    '[Channel1]': {
        'High': {
            'cc': 57,
            'ring': 79,
            'button': 45
        },
        'Mid': {
            'cc': 58,
            'ring': 80,
            'button': 46
        },
        'Low': {
            'cc': 59,
            'ring': 81,
            'button': 47
        }
    },
    '[Channel2]': {
        'High': {
            'cc': 60,
            'ring': 82,
            'button': 48
        },
        'Mid': {
            'cc': 61,
            'ring': 83,
            'button': 49
        },
        'Low': {
            'cc': 62,
            'ring': 84,
            'button': 50
        }
    }
}
MiniboxTwister.encoders['[Channel3]'] = MiniboxTwister.encoders['[Channel1]']
MiniboxTwister.encoders['[Channel4]'] = MiniboxTwister.encoders['[Channel2]']
// each consecutive value in this array sets the encoder ring LEDs to the show the next LED
MiniboxTwister.encoderRingSteps = [0, 10, 25, 35, 50, 60, 64, 75, 85, 95, 105, 115, 127]
MiniboxTwister.encoderRingStepsFill = [0, 1, 20, 30, 40, 50, 60, 64, 75, 85, 95, 105, 120, 127]
MiniboxTwister.buttons = {
    '[Channel1]': {
        'arrowSide': 42,

        'mode': 33,
        'pfl': 34,
        'play': 35,


        'hotcues': [
                [1, 2, 3, 4],
                [9, 10, 11, 12]
            ],

        'forward': 17,
        'slip': 18,
        'shift': 19,
        'deckToggle': 20,

        'back': 25,
        'quantize': 26,
        'key': 27,
        'sync': 28
    },
    '[Channel2]': {
        'mode': 36,
        'pfl': 37,
        'play': 38,

        'arrowSide': 43,


        'hotcues': [
                [5, 6, 7, 8],
                [13, 14, 15, 16]
            ],

        'forward': 21,
        'slip': 22,
        'shift': 23,
        'deckToggle': 24,

        'back': 29,
        'quantize': 30,
        'key': 31,
        'sync': 32

    }
}
MiniboxTwister.buttons['[Channel3]'] = MiniboxTwister.buttons['[Channel1]']
MiniboxTwister.buttons['[Channel4]'] = MiniboxTwister.buttons['[Channel2]']

MiniboxTwister.shift = false
MiniboxTwister.topShift = false
MiniboxTwister.deckShift = {'[Channel1]': false, '[Channel2]': false, '[Channel3]': false, '[Channel4]': false}
MiniboxTwister.deck = {'[Channel1]': '[Channel1]', '[Channel2]': '[Channel2]'}
MiniboxTwister.mode = {'[Channel1]': 'eq', '[Channel2]': 'eq', '[Channel3]': 'eq', '[Channel4]': 'eq'}
MiniboxTwister.loopMoveSize = {'[Channel1]': 1, '[Channel2]': 1, '[Channel3]': 1, '[Channel4]': 1}
MiniboxTwister.loopSize = {'[Channel1]': 4, '[Channel2]': 4, '[Channel3]': 4, '[Channel4]': 4}
MiniboxTwister.slipMode = {'[Channel1]': false, '[Channel2]': false, '[Channel3]': false, '[Channel4]': false}
MiniboxTwister.deckShift = {'[Channel1]': false, '[Channel2]': false, '[Channel3]': false, '[Channel4]': false}
MiniboxTwister.hotcuePage = {'[Channel1]': 0, '[Channel2]': 0, '[Channel3]': 0, '[Channel4]': 0}
MiniboxTwister.hotcuesPressed = {'[Channel1]': 0, '[Channel2]': 0, '[Channel3]': 0, '[Channel4]': 0}
MiniboxTwister.playPressedWhileCueJuggling = {'[Channel1]': false, '[Channel2]': false, '[Channel3]': false, '[Channel4]': false}
MiniboxTwister.slipModeUnsetWhileLooping = {'[Channel1]': false, '[Channel2]': false, '[Channel3]': false, '[Channel4]': false}
MiniboxTwister.midEncoderLEDTimer = {'[Channel1]': 0, '[Channel2]': 0, '[Channel3]': 0, '[Channel4]': 0}
MiniboxTwister.midEncoderLEDTimer = {'[Channel1]': 0, '[Channel2]': 0, '[Channel3]': 0, '[Channel4]': 0}

MiniboxTwister.sysexPrefix = [ 240, 00, 01, 106, 01 ]
MiniboxTwister.defaultSettings = [
[ 240, 00, 01, 106, 01, 01, 00, 01, 00, 02, 00, 03, 00, 04, 00, 05, 00, 06, 00, 07, 00, 08, 00, 09, 00, 10, 00, 11, 00, 12, 00, 13, 00, 14, 00, 15, 00, 16, 00, 17, 00, 18, 00, 19, 00, 20, 00, 21, 00, 22, 00, 23, 00, 24, 00, 25, 00, 26, 00, 27, 00, 28, 00, 29, 00, 30, 00, 31, 00, 32, 00, 33, 00, 34, 00, 35, 00, 36, 00, 37, 00, 38, 00, 39, 00, 40, 00, 41, 00, 42, 00, 43, 00, 44, 00, 45, 00, 46, 00, 47, 00, 48, 00, 49, 00, 50, 247 ],
[ 240, 00, 01, 106, 01, 02, 00, 51, 00, 52, 00, 53, 00, 54, 00, 55, 247 ],
[ 240, 00, 01, 106, 01, 03, 00, 56, 00, 57, 00, 58, 00, 59, 00, 60, 00, 61, 00, 62, 247 ],
[ 240, 00, 01, 106, 01, 04, 00, 63, 00, 64, 00, 65, 00, 66, 00, 67, 00, 68, 00, 69, 00, 70, 00, 71, 00, 72, 00, 73, 00, 74, 00, 75, 00, 76, 00, 77, 00, 78, 247 ],
[ 240, 0, 1, 106, 01, 05, 126, 05, 01, 247 ],
[ 240, 00, 01, 106, 01, 06, 127, 127, 15, 00, 07, 00, 09, 5, 247 ],
[ 240, 0, 1, 106, 01, 07, 42, 42, 247 ],
[ 240, 00, 01, 106, 01, 08, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 0, 19, 0, 20, 0, 21, 0, 22, 0, 23, 0, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, 29, 0, 30, 0, 31, 0, 32, 0, 33, 0, 34, 0, 35, 0, 36, 0, 37, 0, 38, 247 ],
[ 240, 00, 01, 106, 01, 09, 0, 79, 0, 80, 0, 81, 0, 82, 0, 83, 0, 84, 247 ],
[ 240, 0, 1, 106, 01, 13, 15, 247 ],
[ 240, 0, 1, 106, 01, 14, 0, 247 ],
[ 240, 0, 1, 106, 01, 15, 0, 247 ]
]
MiniboxTwister.requestConfiguration = MiniboxTwister.sysexPrefix.concat([ 126 , 247 ])

MiniboxTwister.samplerRegEx = /\[Sampler(\d+)\]/
MiniboxTwister.channelRegEx = /\[Channel(\d+)\]/

// ================================================= INITIALIZATION & SHUTDOWN ============================================

MiniboxTwister.init = function () {
    if (engine.getValue('[Master]', 'num_samplers') < 8) {
        engine.setValue('[Master]', 'num_samplers', 8)
    }
    for (var group in MiniboxTwister.encoders) { // loop over each [Channel]
//         engine.softTakeover('[QuickEffectRack1_'+group+']', 'super1', true)
//         engine.softTakeover(group, 'volume', true)
        // uncomment the line below when Bug #1472868 is fixed
//         MiniboxTwister.vinylMode[group] = engine.getValue(group, 'vinylcontrol_enabled')
        engine.setValue(group, 'vinylcontrol_enabled', MiniboxTwister.vinylMode[group])
    }
    MiniboxTwister.initDeck('[Channel1]')
    MiniboxTwister.initDeck('[Channel2]')
    for (i=1; i<=8; i++) {
        engine.connectControl('[Sampler'+i+']', 'track_samples', 'MiniboxTwister.oneShotLED')
        engine.trigger('[Sampler'+i+']', 'track_samples')
    }

    midi.sendShortMsg(0x90, 39, 127) // light up arrow
    midi.sendShortMsg(0x90, 40, 127) // light top shift button
    midi.sendShortMsg(0x90, 41, 127) // light down arrow
//     midi.sendSysexMsg(MiniboxTwister.requestConfiguration, MiniboxTwister.requestConfiguration.length)
//     for (var msg in MiniboxTwister.defaultSettings) {
//         midi.sendSysexMsg(MiniboxTwister.defaultSettings[msg], MiniboxTwister.defaultSettings[msg].length)
//     }
}
// MiniboxTwister.inboundSysex = function (data, length) {
//     print('========================== incoming sysex message ======================================')
//     print(length)
//     print(data)
//     if (length == 108) {
//         MiniboxTwister.controllerConfiguration = data
//     }
// }

MiniboxTwister.shutdown = function() {
    for (var group in MiniboxTwister.encoders) {
        for (var encoder in MiniboxTwister.encoders[group]) {
            // set encoder to absolute EQ mode with speed 5
            midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['cc'], 118)
            // enable local control of LED ring
            midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['ring'], 70)
            // set rings to center
            midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group][encoder]['cc'], 64)
            // turn off blue button lights
            midi.sendShortMsg(0x90, MiniboxTwister.encoders[group][encoder]['button'], 0)
        }
    }
    // turn off all button LEDs
    for (i = 0; i <= 70; i++) {
        midi.sendShortMsg(0x90, i, MiniboxTwister.colorCodes['off'])
    }
}

// ==================================================== MODE SWITCHING FUNCTIONS ================================================

MiniboxTwister.initDeck = function (group) {
    var disconnectDeck = parseInt(MiniboxTwister.channelRegEx.exec(group)[1])
    if (disconnectDeck <= 2) {
        disconnectDeck += 2
    } else {
        disconnectDeck -= 2
    }
    disconnectDeck = '[Channel' + disconnectDeck + ']'
    MiniboxTwister.connectDeckControls(disconnectDeck, true)
    // workaround for https://bugs.launchpad.net/mixxx/+bug/1466606
    for (i=1; i <= 32; i++) {
        engine.setValue(disconnectDeck, 'hotcue_'+i+'_activate', 0)
    }

    midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['shift'], MiniboxTwister.colorCodes['yellow'])
    midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['deckToggle'], MiniboxTwister.deckColor[group])
    midi.sendShortMsg(
        0x90,
        MiniboxTwister.buttons[group]['slip'],
        MiniboxTwister.slipMode[group] ? MiniboxTwister.deckColor[group] : MiniboxTwister.colorCodes['off']
    )

    MiniboxTwister.mode[group] = MiniboxTwister.mode[disconnectDeck]

    MiniboxTwister.connectDeckControls(group)
}

MiniboxTwister.connectDeckControls = function (group, remove) {
    remove = (typeof remove !== 'undefined') ? remove : false // default value for remove is false

    var controlsToFunctions = {
        'pfl': 'MiniboxTwister.pflButtonLED',
//         'track_samples': 'MiniboxTwister.arrowSideLED', // the line below would overwrite this attribute
        'track_samples': 'MiniboxTwister.playButtonLED',
        'play': 'MiniboxTwister.playButtonLED',
        'playposition': 'MiniboxTwister.playButtonLED',
        'cue_indicator': 'MiniboxTwister.playButtonLED',
        'sync_enabled': 'MiniboxTwister.syncLED',
        'keylock': 'MiniboxTwister.keylockLED',
        'quantize': 'MiniboxTwister.quantizeLED'
    }
    engine.connectControl(group, 'track_samples', 'MiniboxTwister.arrowSideLED', remove)
    for (var control in controlsToFunctions) {
        engine.connectControl(group, control, controlsToFunctions[control], remove)
        if (! remove) {
            engine.trigger(group, control)
        }
    }
    MiniboxTwister.connectHotcuePage(group, remove)
    MiniboxTwister.connectEncoderMode(group, MiniboxTwister.mode[group], remove)

    if (MiniboxTwister.vinylMode[group]) {
        MiniboxTwister.connectVinylLEDs(group, remove)
    }
}

MiniboxTwister.connectEncoderMode = function (group, mode, remove) {
    remove = (typeof remove !== 'undefined') ? remove : false // default value for remove is false
    switch (mode) {
        case 'eq':
            midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['mode'], MiniboxTwister.colorCodes['white'])
            for (var encoder in MiniboxTwister.encoders[group]) {
                engine.connectControl(group, 'filter' + encoder, 'MiniboxTwister.eqEncoderLEDs', remove)
                engine.connectControl(group, 'filter' + encoder + 'Kill', 'MiniboxTwister.eqEncoderKillButtonLED', remove)
                if (! remove) {
                    // set encoder to absolute EQ mode with speed 5
                    midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['cc'], 70 + 8*MiniboxTwister.eqSensitivity)
                    // enable local control of LED ring
                    midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['ring'], 70)

                    engine.trigger(group, 'filter' + encoder)
                    engine.trigger(group, 'filter' + encoder + 'Kill')
                }
            }
            break
        case 'loop':
            engine.connectControl(group, 'loop_enabled', 'MiniboxTwister.loopButtonToggleLED', remove)
            if (! remove) {
                engine.trigger(group, 'loop_enabled')
                midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['mode'], MiniboxTwister.colorCodes['magenta'])
                for (var encoder in MiniboxTwister.encoders[group]) {
                    // set encoder to relative mode
                    midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['cc'], 64)
                    // set LED ring to EQ mode with local control disabled
                    midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['ring'], 98)
                }

                midi.sendShortMsg(
                    0xB0,
                    MiniboxTwister.encoders[group]['High']['ring'],
                    MiniboxTwister.encoderRingSteps[
                        6 + Math.log(MiniboxTwister.loopMoveSize[group]) / Math.log(2)
                    ]
                )

                midi.sendShortMsg(
                    0xB0,
                    MiniboxTwister.encoders[group]['Mid']['ring'],
                    64
                )

                midi.sendShortMsg(
                    0xB0,
                    MiniboxTwister.encoders[group]['Low']['ring'],
                    MiniboxTwister.encoderRingSteps[
                        6 + Math.log(MiniboxTwister.loopSize[group]) / Math.log(2)
                    ]
                )
            }
            break
    }
}

MiniboxTwister.connectHotcuePage = function (group, remove) {
    remove = (typeof remove !== 'undefined') ? remove : false // default value for remove is false

    var min = 1 + (MiniboxTwister.hotcuePage[group] * 8)
    var max = min + 7
    for (i=min; i<=max; i++) {
        engine.connectControl(group, 'hotcue_'+i+'_enabled', 'MiniboxTwister.hotcueLED', remove)
        if (! remove) {
            engine.trigger(group, 'hotcue_'+i+'_enabled')
        }
    }
}

MiniboxTwister.connectVinylLEDs = function (group, remove) {
    var controlsToFunctions = {
        'passthrough': 'MiniboxTwister.vinylStatusLED',
        'vinylcontrol_status': 'MiniboxTwister.vinylStatusLED',
        'vinylcontrol_mode': 'MiniboxTwister.vinylModeLED',
        'vinylcontrol_cueing': 'MiniboxTwister.vinylModeLED'
    }
    for (var control in controlsToFunctions) {
        engine.connectControl(group, control, controlsToFunctions[control], remove)
    }
    if (remove) {
        midi.sendShortMsg(
            0x90,
            MiniboxTwister.buttons[group]['back'],
            (engine.getValue(group, 'quantize')) ? MiniboxTwister.colorCodes['white'] : MiniboxTwister.colorCodes['green']
        )
        midi.sendShortMsg(
            0x90,
            MiniboxTwister.buttons[group]['forward'],
            (engine.getValue(group, 'quantize')) ? MiniboxTwister.colorCodes['white'] : MiniboxTwister.colorCodes['green']
        )
        midi.sendShortMsg(
            0x90,
            MiniboxTwister.buttons[group]['slip'],
            (MiniboxTwister.slipMode[group]) ? MiniboxTwister.deckColor[group] : MiniboxTwister.colorCodes['off']
        )
    } else {
        for (var control in controlsToFunctions) {
            engine.trigger(group, control)
        }
    }
}

MiniboxTwister.topShiftButton = function (channel, control, value, status, group) {
//     MiniboxTwister.shift = ! MiniboxTwister.shift
    MiniboxTwister.topShift = ! MiniboxTwister.topShift

    MiniboxTwister.connectEncoderMode(MiniboxTwister.deck['[Channel1]'], MiniboxTwister.mode[group], value/127)
    MiniboxTwister.connectEncoderMode(MiniboxTwister.deck['[Channel2]'], MiniboxTwister.mode[group], value/127)
    if (value) {
        for (group in MiniboxTwister.deck) {
            for (var encoder in MiniboxTwister.encoders[group]) {
                // set encoder to absolute EQ mode with speed 5
                midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['cc'], 70 + 8*MiniboxTwister.eqSensitivity)
                // enable local control of LED ring
                midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group][encoder]['ring'], 70)
            }
            engine.connectControl(MiniboxTwister.deck[group], 'pregain', 'MiniboxTwister.gainLEDs')
            engine.trigger(MiniboxTwister.deck[group], 'pregain')
        }
    } else {
        for (group in MiniboxTwister.deck) {
            engine.connectControl(MiniboxTwister.deck[group], 'pregain', 'MiniboxTwister.gainLEDs', true)
        }
    }

    var controlsToFunctions = {
        'volume': 'MiniboxTwister.masterGainLEDs',
        'balance': 'MiniboxTwister.masterBalanceLEDs',
        'headVolume': 'MiniboxTwister.headGainLEDs',
        'headMix': 'MiniboxTwister.headMixLEDs',
        'headSplit': 'MiniboxTwister.headSplitLED'
    }
    for (var control in controlsToFunctions) {
        engine.connectControl('[Master]', control, controlsToFunctions[control], ! value/127)
        if (value) {
            engine.trigger('[Master]', control)
        }
    }
}

MiniboxTwister.deckShiftButton = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    MiniboxTwister.deckShift[group] = ! MiniboxTwister.deckShift[group]
    if (value) {
        // set low encoder to relative mode
        midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group]['Low']['cc'], 64)
        // set low LED ring to walk mode with local control disabled
        midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group]['Low']['ring'], 96)
        midi.sendShortMsg(
            0xB0,
            MiniboxTwister.encoders[group]['Low']['ring'],
            MiniboxTwister.encoderRingStepsFill[MiniboxTwister.hotcuePage[group]+1]
        )
        // set mid encoder to relative mode
        midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group]['Mid']['cc'], 64)
        // set mid encoder LED ring to EQ mode with local control disabled
        // There seems to be a bug in the Twister firmware when local control is enabled one LED ring but not another. If local control is enabled here, the other rings behave confusingly.
        midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group]['Mid']['ring'], 98)
        midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group]['Mid']['ring'], 64)
        // set high encoder to absolute EQ mode with sensitivity level 1
        // 1 step = 1 MIDI value for fine pitch control
        midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group]['High']['cc'], 78)
        // set high LED ring to EQ mode with local control disabled
        midi.sendShortMsg(0xBF, MiniboxTwister.encoders[group]['High']['ring'], 78)
        engine.connectControl(group, 'rate', 'MiniboxTwister.rateEncoderLEDs')
        engine.trigger(group, 'rate')
        if (MiniboxTwister.topShift && MiniboxTwister.deckShift[group]) {
            MiniboxTwister.connectVinylLEDs(group, MiniboxTwister.vinylMode[group])
            MiniboxTwister.vinylMode[group] = ! MiniboxTwister.vinylMode[group]
        }
    } else {
        engine.stopTimer(MiniboxTwister.midEncoderLEDTimer[group])
        engine.connectControl(group, 'rate', 'MiniboxTwister.rateEncoderLEDs', true)
    }
    MiniboxTwister.connectEncoderMode(group, MiniboxTwister.mode[group], value/127)
}

MiniboxTwister.rateEncoderLEDs = function (value, group, control) {
    midi.sendShortMsg(
                        0xB0,
                        MiniboxTwister.encoders[group]['High']['cc'],
                        script.absoluteLinInverse(value, -1, 1)
                     )
}

// ================================================== ARROWS + BIG ENCODER ====================================================

MiniboxTwister.bigEncoder = function (channel, control, value, status, group) {
    if (MiniboxTwister.topShift) {
        for (i=0 ; i<35; i++) {
            engine.setValue('[Playlist]', (value == 1) ? 'SelectNextTrack' : 'SelectPrevTrack', 1)
        }
    } else {
        engine.setValue('[Playlist]', (value == 1) ? 'SelectNextTrack' : 'SelectPrevTrack', 1)
    }
}
MiniboxTwister.bigEncoderButton = function (channel, control, value, status, group) {
    if (value) {
        if (MiniboxTwister.topShift) {
            engine.setValue('[Playlist]', 'LoadSelectedIntoFirstStopped', 1)
        } else {
            engine.setValue('[Master]', 'maximize_library', ! engine.getValue('[Master]', 'maximize_library'))
        }
    }
}
MiniboxTwister.arrowSide = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.topShift) {
                engine.setValue(group, 'eject', 1)
                engine.beginTimer(250, 'engine.setValue("'+group+'", "eject", 0)', true)
        } else {
            engine.setValue(group, 'LoadSelectedTrack', 1)
        }
    }
}
MiniboxTwister.arrowSideLED = function (value, group, control) {
    midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['arrowSide'], (value) ? 127 : 0)
}
MiniboxTwister.arrowUp = function (channel, control, value, status, group) {
    if (value) {
        if (MiniboxTwister.topShift) {
            engine.setValue('[Playlist]', 'ToggleSelectedSidebarItem', 1)
        } else {
            engine.setValue('[Playlist]', 'SelectPrevPlaylist', 1)
        }
    }
}
MiniboxTwister.arrowDown = function (channel, control, value, status, group) {
    if (value) {
        if (MiniboxTwister.topShift) {
            engine.setValue('[Playlist]', 'ToggleSelectedSidebarItem', 1)
        } else {
            engine.setValue('[Playlist]', 'SelectNextPlaylist', 1)
        }
    }
}

// ===================================================== SAMPLERS ===========================================================

MiniboxTwister.oneShot = function (channel, control, value, status, group) {
    if (value) {
        if (engine.getValue(group, 'track_samples')) {
            if (MiniboxTwister.topShift) {
                engine.setValue(group, 'key', 0)
                engine.setValue(group, 'sync_enabled', 0)
                engine.setValue(group, 'repeat', 0)
                engine.setValue(group, 'play', 0)
                engine.setValue(group, 'eject', 1)
                engine.beginTimer(250, 'engine.setValue("'+group+'", "eject", 0)', true)
            } else {
                if (MiniboxTwister.samplerVelocityAsVolume) {
                    engine.setValue(group, 'volume', script.absoluteNonLin(value * MiniboxTwister.samplerSensitivity, 0, .25, 1))
                }
                engine.setValue(group, 'playposition', 0)
                engine.setValue(group, 'play', 1)
            }
        } else {
            if (MiniboxTwister.samplerVelocityAsVolume) {
                engine.setValue(group, 'volume', script.absoluteNonLin(value, 0, .25, 1))
            }
            engine.setValue(group, 'LoadSelectedTrackAndPlay', 1)
        }
    } else {
        engine.setValue(group, 'play', 0)
    }
}
MiniboxTwister.oneShotLED = function (value, group, control) {
    midi.sendShortMsg(0x90, 62 + parseInt(MiniboxTwister.samplerRegEx.exec(group)[1]), (value) ? 127 : 0)
}

// ================================================= CHANNEL STRIPS ===========================================================

MiniboxTwister.leftKnob = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    // soft takeover
    if (Math.abs(script.absoluteLin(value, 0, 1) - engine.getValue('[QuickEffectRack1_'+group+']', 'super1')) < .1) {
        engine.setValue('[QuickEffectRack1_'+group+']', 'super1', script.absoluteLin(value, 0, 1))
    }
}
MiniboxTwister.rightKnob = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    // soft takeover
    if (Math.abs(script.absoluteLin(value, 0, 1) - engine.getValue('[QuickEffectRack1_'+group+']', 'super1')) < .1) {
        engine.setValue('[QuickEffectRack1_'+group+']', 'super1', script.absoluteLin(value, 0, 1))
    }
}

MiniboxTwister.eqEncoderLEDs = function (value, group, control) {
    var encoder = control.replace('filter', '')
    midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group][encoder]['cc'], script.absoluteNonLinInverse(value, 0, 1, 4))
}

MiniboxTwister.eqEncoderKillButtonLED = function (value, group, control) {
    var encoder = control.replace('filter', '')
    encoder = encoder.replace('Kill', '')
    midi.sendShortMsg(0x90, MiniboxTwister.encoders[group][encoder]['button'], value * 127)
}

MiniboxTwister.masterGainLEDs = function (value, group, control) {
    midi.sendShortMsg(0xB0, MiniboxTwister.encoders['[Channel2]']['High']['cc'], script.absoluteNonLinInverse(value, 0, 1, 4))
}

MiniboxTwister.masterBalanceLEDs = function (value, group, control) {
    midi.sendShortMsg(0xB0, MiniboxTwister.encoders['[Channel2]']['Mid']['cc'], script.absoluteLinInverse(value, -1, 1))
}

MiniboxTwister.headGainLEDs = function (value, group, control) {
    midi.sendShortMsg(0xB0, MiniboxTwister.encoders['[Channel1]']['High']['cc'], script.absoluteNonLinInverse(value, 0, 1, 4))
}

MiniboxTwister.headMixLEDs = function (value, group, control) {
    midi.sendShortMsg(0xB0, MiniboxTwister.encoders['[Channel1]']['Mid']['cc'], script.absoluteLinInverse(value, -1, 1))
}

MiniboxTwister.headSplitLED = function (value, group, control) {
    midi.sendShortMsg(0x90, MiniboxTwister.encoders['[Channel1]']['Mid']['button'], value * 127)
}

MiniboxTwister.gainLEDs = function (value, group, control) {
    midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group]['Low']['cc'], script.absoluteNonLinInverse(value, 0, 1, 4))
}

MiniboxTwister.highEncoder = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (MiniboxTwister.topShift) {
        if (control == MiniboxTwister.encoders['[Channel1]']['High']['cc']) {
            engine.setValue('[Master]', 'headVolume', script.absoluteNonLin(value, 0, 1, 5))
        } else {
            engine.setValue('[Master]', 'volume', script.absoluteNonLin(value, 0, 1, 5))
        }
    } else if (MiniboxTwister.deckShift[group]) {
        engine.setValue(group, 'rate', script.absoluteLin(value, -1, 1, 0, 126))
    } else {
        switch (MiniboxTwister.mode[group]) {
            case 'eq':
                engine.setValue(group, 'filterHigh', script.absoluteNonLin(value, 0, 1, 4) )
                break
            case 'loop':
                if ((value == 127) && (MiniboxTwister.loopMoveSize[group] >= Math.pow(2, -5))) {
                    MiniboxTwister.loopMoveSize[group] = MiniboxTwister.loopMoveSize[group] / 2
                } else if ((value == 1) && (MiniboxTwister.loopMoveSize[group] <= Math.pow(2, 5))) {
                    MiniboxTwister.loopMoveSize[group] = MiniboxTwister.loopMoveSize[group] * 2
                }
                midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group]['High']['ring'], MiniboxTwister.encoderRingSteps[ 6 + Math.log(MiniboxTwister.loopMoveSize[group]) / Math.log(2) ] )
                break
        }
    }
}
MiniboxTwister.highEncoderPress = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.topShift) {
            if (control == MiniboxTwister.encoders['[Channel1]']['High']['button']) {
                engine.setValue('[Master]', 'headVolume', 1)
            } else {
                engine.setValue('[Master]', 'volume', 1)
            }
        } else {
            switch (MiniboxTwister.mode[group]) {
                case 'eq':
                    if (MiniboxTwister.deckShift[group]) {
                        engine.setValue(group, 'filterHigh', 1)
                    } else {
                        engine.setValue(group, 'filterHighKill', ! engine.getValue(group, 'filterHighKill'))
                    }
                    break
                case 'loop':
                    // What to do with this?
                    break
            }
        }
    }
}
MiniboxTwister.midEncoder = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (MiniboxTwister.topShift) {
        if (control == MiniboxTwister.encoders['[Channel1]']['Mid']['cc']) {
            engine.setValue('[Master]', 'headMix', script.absoluteLin(value, -1, 1))
        } else {
            engine.setValue('[Master]', 'balance', script.absoluteLin(value, -1, 1))
        }
    } else if (MiniboxTwister.deckShift[group]) {
        engine.stopTimer(MiniboxTwister.midEncoderLEDTimer[group])
        if (value == 127) {
            engine.setValue(group, 'beatjump_32_backward', 1)
            midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group]['Mid']['ring'], 0)
        } else {
            engine.setValue(group, 'beatjump_32_forward', 1)
            midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group]['Mid']['ring'], 127)
        }
        MiniboxTwister.midEncoderLEDTimer[group] = engine.beginTimer(1000, 'midi.sendShortMsg(0xB0, MiniboxTwister.encoders["'+group+'"]["Mid"]["ring"], 64)', true)
    } else {
        switch (MiniboxTwister.mode[group]) {
            case 'eq':
                engine.setValue(group, 'filterMid', script.absoluteNonLin(value, 0, 1, 4))
                break
            case 'loop':
                engine.stopTimer(MiniboxTwister.midEncoderLEDTimer[group])
                if (value == 127) {
                    engine.setValue(group, 'loop_move_' + MiniboxTwister.loopMoveSize[group] + '_backward', 1)
                    midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group]['Mid']['ring'], 0)

                } else {
                    engine.setValue(group, 'loop_move_' + MiniboxTwister.loopMoveSize[group] + '_forward', 1)
                    midi.sendShortMsg(0xB0, MiniboxTwister.encoders[group]['Mid']['ring'], 127)
                }
                MiniboxTwister.midEncoderLEDTimer[group] = engine.beginTimer(1000, 'midi.sendShortMsg(0xB0, MiniboxTwister.encoders["'+group+'"]["Mid"]["ring"], 64)', true)
                break
        }
    }
}
MiniboxTwister.midEncoderPress = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.topShift) {
            if (control == MiniboxTwister.encoders['[Channel1]']['Mid']['button']) {
                engine.setValue('[Master]', 'headSplit', ! engine.getValue('[Master]', 'headSplit'))
            } else {
                engine.setValue('[Master]', 'balance', 0)
            }
        } else {
            switch (MiniboxTwister.mode[group]) {
                case 'eq':
                    if (MiniboxTwister.deckShift[group]) {
                        engine.setValue(group, 'filterMid', 1)
                    } else {
                        engine.setValue(group, 'filterMidKill', ! engine.getValue(group, 'filterMidKill'))
                    }
                    break
                case 'loop':
                    // What to do with this?
            }
        }
    }
}
MiniboxTwister.lowEncoder = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (MiniboxTwister.topShift) {
        engine.setValue(group, 'pregain', script.absoluteNonLin(value, 0, 1, 4))
    } else if (MiniboxTwister.deckShift[group]) {
        if (value == 1 && MiniboxTwister.hotcuePage[group] < 3) {
            MiniboxTwister.connectHotcuePage(group, true)
            MiniboxTwister.hotcuePage[group]++
            MiniboxTwister.connectHotcuePage(group)
        } else if (value == 127 && MiniboxTwister.hotcuePage[group] > 0) {
            MiniboxTwister.connectHotcuePage(group, true)
            MiniboxTwister.hotcuePage[group]--
            MiniboxTwister.connectHotcuePage(group)
        }
        midi.sendShortMsg(
            0xB0,
            MiniboxTwister.encoders[group]['Low']['ring'],
            MiniboxTwister.encoderRingStepsFill[MiniboxTwister.hotcuePage[group]+1]
        )
    } else {
        switch (MiniboxTwister.mode[group]) {
            case 'eq':
                engine.setValue(group, 'filterLow', script.absoluteNonLin(value, 0, 1, 4))
                break
            case 'loop':
                if ((value == 127) && (MiniboxTwister.loopSize[group] >= Math.pow(2, -5))) {
                    MiniboxTwister.loopSize[group] = MiniboxTwister.loopSize[group] / 2
                    engine.setValue(group, 'loop_halve', 1)
                    engine.setValue(group, 'loop_halve', 0)
                } else if ((value == 1) && (MiniboxTwister.loopSize[group] <= Math.pow(2, 5))) {
                    MiniboxTwister.loopSize[group] = MiniboxTwister.loopSize[group] * 2
                    engine.setValue(group, 'loop_double', 1)
                    engine.setValue(group, 'loop_double', 0)
                }
                midi.sendShortMsg(
                    0xB0,
                    MiniboxTwister.encoders[group]['Low']['ring'],
                    MiniboxTwister.encoderRingSteps[
                        6 + Math.log(MiniboxTwister.loopSize[group]) / Math.log(2)
                    ]
                )
                break
        }
    }
}
MiniboxTwister.lowEncoderPress = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.topShift) {
            engine.setValue(group, 'pregain', 1)
        } else {
            switch (MiniboxTwister.mode[group]) {
                case 'eq':
                    if (MiniboxTwister.deckShift[group]) {
                        engine.setValue(group, 'filterLow', 1)
                    } else {
                        engine.setValue(group, 'filterLowKill', ! engine.getValue(group, 'filterLowKill'))
                    }
                    break
                case 'loop':
                    if (MiniboxTwister.slipMode[group]) {
                        engine.setValue(group, 'slip_enabled', ! engine.getValue(group, 'slip_enabled'))
                    }
                    if (engine.getValue(group, 'loop_enabled')) {
                        engine.setValue(group, 'reloop_exit', 1)
                    } else {
                        engine.setValue(group, 'beatloop_' + MiniboxTwister.loopSize[group] + '_activate', 1)
                    }
                    break
            }
        }
    } else if (MiniboxTwister.mode[group] == 'loop' && (MiniboxTwister.slipMode[group] || MiniboxTwister.slipModeUnsetWhileLooping[group])) {
        engine.setValue(group, 'slip_enabled', ! engine.getValue(group, 'slip_enabled'))
        if (engine.getValue(group, 'loop_enabled')) {
            engine.setValue(group, 'reloop_exit', 1)
        }
        MiniboxTwister.slipModeUnsetWhileLooping[group] = false
    }
}
MiniboxTwister.loopButtonToggleLED = function (value, group, control) {
    midi.sendShortMsg(0x90, MiniboxTwister.encoders[group]['Low']['button'], value * 127)
}

MiniboxTwister.modeButton = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        MiniboxTwister.connectEncoderMode(group, MiniboxTwister.mode[group], true)
        switch (MiniboxTwister.mode[group]) {
            case 'eq':
                MiniboxTwister.mode[group] = 'loop'
                break
            case 'loop':
                MiniboxTwister.mode[group] = 'eq'
                break
        }
        MiniboxTwister.connectEncoderMode(group, MiniboxTwister.mode[group])
    }
}

MiniboxTwister.fader = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    // soft takeover. This is necessary for toggling between decks 1/3 or 2/4
    // because the fader can't be moved to the new deck's value by this script
    if (Math.abs(value - script.absoluteNonLinInverse(engine.getValue(group, 'volume'), 0, .25, 1)) < 30) {
        engine.setValue(group, 'volume', script.absoluteNonLin(value, 0, .25, 1))
    }
}

MiniboxTwister.pflButton = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.deckShift[group]) {
            engine.setValue(group, 'reloop_exit', 1)
        } else {
            engine.setValue(group, 'pfl', ! engine.getValue(group, 'pfl'))
        }
    }
}
MiniboxTwister.pflButtonLED = function (value, group, control) {
    midi.sendShortMsg(
        0x90,
        MiniboxTwister.buttons[group][control],
        (value) ? MiniboxTwister.colorCodes['green'] : MiniboxTwister.colorCodes['off']
    )
}

MiniboxTwister.playButton = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (MiniboxTwister.deckShift[group]) {
        engine.setValue(group, 'cue_default', value)
    } else if (MiniboxTwister.topShift) {
        engine.setValue(group, 'cue_gotoandstop', 1)
    } else if (value) {
        if (MiniboxTwister.hotcuesPressed[group]) {
            MiniboxTwister.playPressedWhileCueJuggling[group] = true
        }

        engine.setValue(group, 'play', ! engine.getValue(group, 'play'))
    }
}
MiniboxTwister.playButtonLED = function (value, group, control) {
    if (control == 'cue_indicator' && value == 1) {
        midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['play'], MiniboxTwister.colorCodes['yellow'])
    } else {
        if (engine.getValue(group, 'play')) {
            if (
                (control != 'playposition') // do not spam MIDI signals with each update in playposition while playing
                && (
                    (! MiniboxTwister.hotcuesPressed[group])
                    || MiniboxTwister.playPressedWhileCueJuggling[group]
                )
            ) {
                midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['play'], MiniboxTwister.colorCodes['green'])
            }
        } else if (engine.getValue(group, 'track_samples')) {
            midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['play'], MiniboxTwister.colorCodes['red'])
        } else {
            midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['play'], MiniboxTwister.colorCodes['off'])
        }
    }
}


//===================================================================== BUTTON GRID =========================================================

MiniboxTwister.hotcue = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    var row = (control < MiniboxTwister.buttons[group]['hotcues'][1][0]) ? 0 : 1
    var cueButton = 4 + row*4 - (MiniboxTwister.buttons[group]['hotcues'][row][3] - control)
    var cue = cueButton + (8 * MiniboxTwister.hotcuePage[group])
    if (value) {
        if (engine.getValue(group, 'hotcue_'+cue+'_enabled')) {
            if (MiniboxTwister.deckShift[group]) {
                engine.setValue(group, 'hotcue_'+cue+'_set', 1)
            } else if (MiniboxTwister.topShift) {
                engine.setValue(group, 'hotcue_'+cue+'_clear', 1)
            } else {
                if (MiniboxTwister.slipMode[group]) {
                    if (engine.getValue(group, 'play') && (! MiniboxTwister.hotcuesPressed[group])) {
                        engine.setValue(group, 'slip_enabled', 1)
                    }
                    engine.setValue(group, 'hotcue_'+cue+'_activate', 1)
                    MiniboxTwister.hotcuesPressed[group]++
                } else {
                    engine.setValue(group, 'hotcue_'+cue+'_goto', 1)
                }
            }
        } else {
            engine.setValue(group, 'hotcue_'+cue+'_set', 1)
        }
    } else {
        if (MiniboxTwister.hotcuesPressed[group]) { // do not go below 0
            MiniboxTwister.hotcuesPressed[group]--
        }
        engine.setValue(group, 'hotcue_'+cue+'_activate', 0)

        if (! MiniboxTwister.hotcuesPressed[group]) {
            MiniboxTwister.playPressedWhileCueJuggling[group] = false
            engine.setValue(group, 'slip_enabled', 0)
        }
    }
}
MiniboxTwister.hotcueLED = function (value, group, control) {
    var cue = parseInt(control.split('_')[1]) - (8 * MiniboxTwister.hotcuePage[group])
    var row = (cue <= 4) ? 0 : 1
    midi.sendShortMsg(
        0x90,
        MiniboxTwister.buttons[group]['hotcues'][row][cue - 1 - 4*row],
        value * MiniboxTwister.hotcueColors[MiniboxTwister.hotcuePage[group]]
    )
}

MiniboxTwister.slipButton = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.deckShift[group]) {
            engine.setValue(group, 'loop_in', 1)
        } else {
            if (MiniboxTwister.slipMode[group]) {
                if (MiniboxTwister.hotcuesPressed[group] && ! engine.getValue(group, 'slip_enabled')) {
                    engine.setValue(group, 'play', 0)
                }
                if (engine.getValue(group, 'loop_enabled')) {
                    MiniboxTwister.slipModeUnsetWhileLooping[group] = true
                }
                //engine.setValue(group, 'slip_cancel', 1)
                MiniboxTwister.hotcuesPressed[group] = 0
            }


            MiniboxTwister.slipMode[group] = ! MiniboxTwister.slipMode[group]
            midi.sendShortMsg(
                0x90,
                MiniboxTwister.buttons[group]['slip'],
                MiniboxTwister.slipMode[group] ? MiniboxTwister.deckColor[group] : MiniboxTwister.colorCodes['off']
            )
        }
    }
}

MiniboxTwister.deckToggle = function (channel, control, value, status, group) {
    if (value) {
        if (MiniboxTwister.deckShift[group]) {
            engine.setValue(MiniboxTwister.deck[group], 'loop_out', 1)
        } else {
            var deckNumber = parseInt(
                        MiniboxTwister.channelRegEx.exec(
                            MiniboxTwister.deck[group]
                        )[1]
                    )
            if (deckNumber <= 2) {
                deckNumber += 2
            } else {
                deckNumber -= 2
            }
            MiniboxTwister.deck[group] = '[Channel' + deckNumber + ']'
            MiniboxTwister.initDeck(MiniboxTwister.deck[group])
        }
    }
}

MiniboxTwister.sync = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.deckShift[group]) {
            engine.setValue(group, 'rate', 0)
        } else {
            engine.setValue(group, 'sync_enabled', ! engine.getValue(group, 'sync_enabled'))
        }
    }
}
MiniboxTwister.syncLED = function (value, group, control) {
    midi.sendShortMsg(
        0x90,
        MiniboxTwister.buttons[group]['sync'],
        (value) ? MiniboxTwister.deckColor[group] : MiniboxTwister.colorCodes['off']
    )
}

MiniboxTwister.key = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.deckShift[group]) {
            if (engine.getValue(group, 'file_key') != engine.getValue(group, 'key')) {
                engine.setValue(group, 'reset_key', 1)
            } else {
                engine.setValue(group, 'sync_key', 1)
            }
        } else {
            engine.setValue(group, 'keylock', ! engine.getValue(group, 'keylock'))
        }
    }
}
MiniboxTwister.keylockLED = function (value, group, control) {
    midi.sendShortMsg(
        0x90,
        MiniboxTwister.buttons[group]['key'],
        (value) ? MiniboxTwister.deckColor[group] : MiniboxTwister.colorCodes['off']
    )
}

MiniboxTwister.quantize = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (value) {
        if (MiniboxTwister.deckShift[group]) {
            engine.setValue(group, 'beats_translate_curpos', 1)
        } else {
            engine.setValue(group, 'quantize', ! engine.getValue(group, 'quantize'))
        }
    }
}
MiniboxTwister.quantizeLED = function (value, group, control) {
    midi.sendShortMsg(
        0x90,
        MiniboxTwister.buttons[group]['quantize'],
        (value) ? MiniboxTwister.deckColor[group] : MiniboxTwister.colorCodes['off']
    )
    if (! MiniboxTwister.vinylMode[group]) {
        midi.sendShortMsg(
            0x90,
            MiniboxTwister.buttons[group]['back'],
            (value) ? MiniboxTwister.colorCodes['white'] : MiniboxTwister.colorCodes['green']
        )
        midi.sendShortMsg(
            0x90,
            MiniboxTwister.buttons[group]['forward'],
            (value) ? MiniboxTwister.colorCodes['white'] : MiniboxTwister.colorCodes['green']
        )
    }
}

MiniboxTwister.vinylModeLED = function (value, group, control) {
    var color
    switch (engine.getValue(group, 'vinylcontrol_mode')) {
        // absolute mode
        case 0: color = 'off'; break
        // relative mode
        case 1:
            switch (engine.getValue(group, 'vinylcontrol_cueing')) {
                case 0: color = 'white'; break
                case 1: color = 'yellow'; break
                case 2: color = 'green'; break
            }
            break
        // constant mode
        case 2: color = 'red'; break
    }
    midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['forward'], MiniboxTwister.colorCodes[color])
}
MiniboxTwister.vinylStatusLED = function (value, group, control) {
    if (engine.getValue(group, 'passthrough')) {
        midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['back'], MiniboxTwister.colorCodes['white'])
    } else {
        var color
        switch (engine.getValue(group, 'vinylcontrol_status')) {
            case 0: color = 'off'; break
            case 1: color = 'green'; break
            case 2: color = 'yellow'; break
            case 3: color = 'red'; break
        }
        midi.sendShortMsg(0x90, MiniboxTwister.buttons[group]['back'], MiniboxTwister.colorCodes[color])
    }
}

MiniboxTwister.forward = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (MiniboxTwister.vinylMode[group]) {
        if (value) {
            switch (engine.getValue(group, 'vinylcontrol_mode')) {
                // absolute mode
                case 0: engine.setValue(group, 'vinylcontrol_mode', 1); break
                // relative mode
                case 1:
                    if (engine.getValue(group, 'play') && ! MiniboxTwister.shift) {
                        switch (engine.getValue(group, 'vinylcontrol_cueing')) {
                            case 0: engine.setValue(group, 'vinylcontrol_cueing', 1); break
                            case 1: engine.setValue(group, 'vinylcontrol_cueing', 2); break
                            case 2: engine.setValue(group, 'vinylcontrol_cueing', 0); break
                        }
                    } else {
                        engine.setValue(group, 'vinylcontrol_mode', 2)
                    }
                    break
                // constant mode
                case 2: engine.setValue(group, 'vinylcontrol_mode', 0); break
            }
        }
    } else {
        if (engine.getValue(group, 'quantize')) {
            if (value) {
                if (MiniboxTwister.deckShift[group]) {
                    engine.setValue(group, 'beatjump_1_forward', 1)
                } else {
                    engine.setValue(group, 'beatjump_4_forward', 1)
                }
            }
        } else {
            if (MiniboxTwister.deckShift[group]) {
                engine.setValue(group, 'rate_temp_up', value / 127)
            } else {
                engine.setValue(group, 'fwd', value)
            }
        }
    }
}
MiniboxTwister.back = function (channel, control, value, status, group) {
    group = MiniboxTwister.deck[group]
    if (MiniboxTwister.vinylMode[group]) {
        if (value) {
            if (MiniboxTwister.deckShift[group] || engine.getValue(group, 'passthrough')) {
                engine.setValue(group, 'passthrough', ! engine.getValue(group, 'passthrough'))
            } else {
                engine.setValue(group, 'vinylcontrol_enabled', ! engine.getValue(group, 'vinylcontrol_enabled'))
            }
        }
    } else {
        if (engine.getValue(group, 'quantize')) {
            if (value) {
                if (MiniboxTwister.deckShift[group]) {
                    engine.setValue(group, 'beatjump_1_backward', 1)
                } else {
                    engine.setValue(group, 'beatjump_4_backward', 1)
                }
            }
        } else {
            if (MiniboxTwister.deckShift[group]) {
                engine.setValue(group, 'rate_temp_down', value / 127)
            } else {
                engine.setValue(group, 'back', value)
            }
        }
    }
}
