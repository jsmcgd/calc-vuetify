<template>
  <v-app>

  <v-container fixed class="my-2 app-container">
    <v-container
      rounded
      class="convex grey"
    >
      <v-container class="pb-0">
        <h1
          class="
          opacity-50
          text-body-1 text-sm-h6 text-md-h4"
        >
          VUETIFYCALC2021
        </h1>
      </v-container>

      <digital-display :text="displayValue" :on="displayOn" />

      <v-container id="buttons" class="grid grid-cols-4 grid-rows-5">
        <v-row>
          <v-col><operation-btn button-classes="orange black--text font-weight-bold" :button="buttons.operationButtonProperties['+']" /></v-col>
          <v-col><operation-btn button-classes="orange black--text font-weight-bold" :button="buttons.operationButtonProperties['-']" /></v-col>
          <v-col><operation-btn button-classes="orange black--text font-weight-bold" :button="buttons.operationButtonProperties['*']" /></v-col>
          <v-col><operation-btn button-classes="orange black--text font-weight-bold" :button="buttons.operationButtonProperties['/']" /></v-col>
        </v-row>

        <v-row>
          <v-col><number-btn :button="buttons.numberButtonProperties[7]" /></v-col>
          <v-col><number-btn :button="buttons.numberButtonProperties[8]" /></v-col>
          <v-col><number-btn :button="buttons.numberButtonProperties[9]" /></v-col>
          <v-col><operation-btn button-classes="red font-weight-bold" :button="buttons.operationButtonProperties['c']" /></v-col>
        </v-row>
        <v-row>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[4]" /></v-col>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[5]" /></v-col>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[6]" /></v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[1]" /></v-col>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[2]" /></v-col>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[3]" /></v-col>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[10]" /></v-col>
          <v-col></v-col>
          <v-col><number-btn class="" :button="buttons.numberButtonProperties[0]" /></v-col>
          <v-col><operation-btn button-classes="green font-weight-bold" :button="buttons.operationButtonProperties['=']" /></v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-container>
</v-app>
</template>
<script>
import Vue from 'vue'
import Vue2TouchEvents from 'vue2-touch-events'

import NumberBtn from './components/NumberBtn'
import OperationBtn from './components/OperationBtn'
import DigitalDisplay from './components/DigitalDisplay'

const ERROR = 'ERROR'
const COLLECT_OPERAND_ONE = 'COLLECT_OPERAND_ONE'
const COLLECT_OPERAND_ONE_DECIMALS = 'COLLECT_OPERAND_ONE_DECIMALS'
const COLLECT_OPERATION = 'COLLECT_OPERATION'
const COLLECT_OPERAND_TWO = 'COLLECT_OPERAND_TWO'
const COLLECT_OPERAND_TWO_DECIMALS = 'COLLECT_OPERAND_TWO_DECIMALS'
const EQUALS_PRESSED = 'EQUALS_PRESSED'

Vue.use(Vue2TouchEvents)

export default {
  components: {
    DigitalDisplay, NumberBtn, OperationBtn
  },
  data () {
    const vm = this
    // initialize number buttons
    const numberButtonProperties = [...Array(10).keys()].map((i) => {
      return {
        value: i.toString(),
        symbol: i.toString(),
        upAction: vm.commonButtonClickHandler.bind(vm, 'numberPress', [i]),
        downAction: vm.turnDisplayOff
      }
    })

    // initialize decimal button
    numberButtonProperties.push({
      value: '.',
      symbol: '.',
      upAction: vm.commonButtonClickHandler.bind(vm, 'numberPress', ['.']),
      downAction: vm.turnDisplayOff
    })

    const operationButtonProperties = {
      '+': this.createOperationButtonObject('+', 'add', '&plus;'),
      '-': this.createOperationButtonObject('-', 'subtract', '&minus;'),
      '*': this.createOperationButtonObject('*', 'multiply', '&times;'),
      '/': this.createOperationButtonObject('/', 'divide', '&divide;'),
      '=': {
        value: '=',
        symbol: '=',
        upAction: vm.commonButtonClickHandler.bind(vm, 'equalsPress', []),
        downAction: vm.turnDisplayOff
      },
      c: {
        value: 'c',
        symbol: 'C',
        upAction: vm.commonButtonClickHandler.bind(vm, 'cancelPress', []),
        downAction: vm.turnDisplayOff
      }
    }

    // initialize operation buttons
    const buttons = {
      numberButtonProperties,
      operationButtonProperties
    }

    // create state machine
    const state = { currentState: COLLECT_OPERAND_ONE }

    state[ERROR] = {
      numberPress: function (numberCharacter) {
        this.resetValues()
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.updateOperandOne(numberCharacter)
        this.setDisplayValue(this.operandOne)
      },
      decimalPress: function (decimalCharacter) {
        this.resetValues()
        this.setCurrentState(COLLECT_OPERAND_ONE_DECIMALS)
        this.updateOperandOne(decimalCharacter)
        this.setDisplayValue(this.operandOne)
      },
      cancelPress: function () {
        this.resetValues()
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.resetValues()
      }
    }

    // ---------------------------
    // --- COLLECT_OPERAND_ONE ---
    // ---------------------------

    state[COLLECT_OPERAND_ONE] = {
      numberPress: function (numberCharacter) {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.updateOperandOne(numberCharacter)
        this.setDisplayValue(this.operandOne)
      },
      decimalPress: function (decimalCharacter) {
        this.setCurrentState(COLLECT_OPERAND_ONE_DECIMALS)
        this.updateOperandOne(decimalCharacter)
        this.setDisplayValue(this.operandOne)
      },
      operationPress: function (operationCharacter) {
        this.setCurrentState(COLLECT_OPERATION)
        this.setCurrentOperation(operationCharacter)
        this.turnDisplayOff()
      },
      cancelPress: function () {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.resetValues()
      }
    }

    // ------------------------------------
    // --- COLLECT_OPERAND_ONE_DECIMALS ---
    // ------------------------------------

    state[COLLECT_OPERAND_ONE_DECIMALS] = {
      numberPress: function (numberCharacter) {
        this.setCurrentState(COLLECT_OPERAND_ONE_DECIMALS)
        this.updateOperandOne(numberCharacter)
        this.setDisplayValue(this.operandOne)
      },
      operationPress: function (operationCharacter) {
        this.setCurrentState(COLLECT_OPERATION)
        this.setCurrentOperation(operationCharacter)
        // this.setDisplayValue(symbol)
        this.turnDisplayOff()
      },
      cancelPress: function () {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.resetValues()
      }
    }

    // -------------------------
    // --- COLLECT_OPERATION ---
    // -------------------------

    state[COLLECT_OPERATION] = {
      operationPress: function (operationCharacter) {
        this.setCurrentState(COLLECT_OPERATION)
        this.setCurrentOperation(operationCharacter)
        // this.setDisplayValue(symbol)
        this.turnDisplayOff()
      },
      numberPress: function (numberCharacter) {
        this.setCurrentState(COLLECT_OPERAND_TWO)
        this.updateOperandTwo(numberCharacter)
        this.setDisplayValue(this.operandTwo)
      },
      decimalPress: function (decimalCharacter) {
        this.setCurrentState(COLLECT_OPERAND_TWO_DECIMALS)
        this.updateOperandTwo(decimalCharacter)
        this.setDisplayValue(this.operandTwo)
      },
      cancelPress: function () {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.resetValues()
      }
    }

    // ---------------------------
    // --- COLLECT_OPERAND_TWO ---
    // ---------------------------

    state[COLLECT_OPERAND_TWO] = {
      numberPress: function (numberCharacter) {
        this.setCurrentState(COLLECT_OPERAND_TWO)
        this.updateOperandTwo(numberCharacter)
        this.setDisplayValue(this.operandTwo)
      },
      decimalPress: function (decimalCharacter) {
        this.setCurrentState(COLLECT_OPERAND_TWO_DECIMALS)
        this.updateOperandTwo(decimalCharacter)
        this.setDisplayValue(this.operandTwo)
      },
      operationPress: function (operationCharacter) {
        this.calculateOperation()
        this.resetOperandTwo()
        this.setCurrentState(COLLECT_OPERATION)
        this.setCurrentOperation(operationCharacter)
        // this.setDisplayValue(symbol)
        this.turnDisplayOff()
      },
      equalsPress: function () {
        this.setCurrentState(EQUALS_PRESSED)
        this.calculateOperation()
        this.setDisplayValue(this.operandOne)
      },
      cancelPress: function () {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.resetValues()
      }
    }

    // ------------------------------------
    // --- COLLECT_OPERAND_TWO_DECIMALS ---
    // ------------------------------------

    state[COLLECT_OPERAND_TWO_DECIMALS] = {
      numberPress: function (numberCharacter) {
        this.setCurrentState(COLLECT_OPERAND_TWO_DECIMALS)
        this.updateOperandTwo(numberCharacter)
      },
      operationPress: function (operationCharacter) {
        this.calculateOperation()
        this.resetOperandTwo()
        this.setCurrentState(COLLECT_OPERATION)
        this.setCurrentOperation(operationCharacter)
        // this.setDisplayValue(symbol)
        this.turnDisplayOff()
      },
      equalsPress: function () {
        this.setCurrentState(EQUALS_PRESSED)
        this.calculateOperation()
        this.setDisplayValue(this.operandOne)
      },
      cancelPress: function () {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.resetValues()
      }
    }

    // ----------------------
    // --- EQUALS PRESSED ---
    // ----------------------

    state[EQUALS_PRESSED] = {
      numberPress: function (numberCharacter) {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.commonOperandHandler('operandOne', numberCharacter)
      },
      operationPress: function (operationCharacter) {
        this.setCurrentState(COLLECT_OPERATION)
        this.setCurrentOperation(operationCharacter)
        this.operandTwo = '' // FIX
        // this.setDisplayValue(symbol)
        this.turnDisplayOff()
      },
      equalsPress: function () {
        this.setCurrentState(EQUALS_PRESSED)
        this.calculateOperation()
        this.setDisplayValue(this.operandOne)
      },
      cancelPress: function () {
        this.setCurrentState(COLLECT_OPERAND_ONE)
        this.resetValues()
      }
    }

    return Object.assign({}, { state, buttons }, this.defaultValues())
  },
  created () {
  },
  methods: {
    defaultValues: function () {
      return {
        operandOne: '',
        operandTwo: '',
        currentOperation: null,
        displayValue: '',
        displayOn: true
      }
    },
    resetValues: function () {
      Object.assign(this, this.defaultValues())
    },
    setCurrentState: function (state) {
      this.state.currentState = state
    },
    getCurrentState: function () {
      return this.state.currentState
    },
    getCurrentStateEvents: function () {
      return this.state[this.getCurrentState()]
    },
    createOperationButtonObject: function (character, alternate, symbol) {
      return {
        alternate,
        value: character,
        symbol: symbol,
        downAction: this.turnDisplayOff,
        upAction: this.commonButtonClickHandler.bind(this, 'operationPress', [character, character])
      }
    },
    setDisplayValue: function (value) {
      this.displayValue = value.toString()
    },
    calculateOperation () {
      const operandOne = parseFloat(this.operandOne)
      const operandTwo = parseFloat(this.operandTwo)
      let result = null
      switch (this.currentOperation) {
        case '+':
          result = operandOne + operandTwo
          break
        case '-':
          result = operandOne - operandTwo
          break
        case '*':
          result = operandOne * operandTwo
          break
        case '/':
          if (operandTwo === 0) {
            this.setDisplayValue('Err')
            this.operandOne = 'Err'
            this.setCurrentState(ERROR)
            return
          } else {
            result = operandOne / operandTwo
          }
          break
        default:
          // console.error('calculator broken: illegal operation')
      }

      this.operandOne = parseFloat(result.toString().substr(0, 11))
    },
    resetOperandTwo () {
      this.operandTwo = ''
    },
    commonOperandHandler: function (operand, operandCharacter) {
      return this[operand] + operandCharacter
    },
    updateOperandOne: function (newOperandCharacter) {
      this.operandOne = this.commonOperandHandler('operandOne', newOperandCharacter)
    },
    updateOperandTwo: function (newOperandCharacter) {
      this.operandTwo = this.commonOperandHandler('operandTwo', newOperandCharacter)
    },
    setCurrentOperation: function (operationCharacter) {
      this.currentOperation = operationCharacter
    },
    commonButtonClickHandler: function (eventName, args) {
      const stateEvents = this.getCurrentStateEvents()
      if (typeof stateEvents[eventName] !== 'undefined') {
        stateEvents[eventName].call(this, ...args)
      }
      this.turnDisplayOn()
    },
    turnDisplayOff () {
      this.displayOn = false
    },
    turnDisplayOn () {
      this.displayOn = true
    }
  }
}
</script>

<style>
  * {
    font-family: 'JetBrains Mono', monospace;
  }

  .app-container {
    max-width: 768px;
  }

  .convex {
    box-shadow: 0 .25rem .25rem 0 rgba(0, 0, 0, 0.2), /* shadow underneath */ 0 -0.25rem .5rem rgba(0, 0, 0, 0.5) inset,
    0 0.75rem 0.5rem rgba(255, 255, 255, 0.2) inset,
    0 0.1rem 0.1rem 0 rgba(255, 255, 255, .5) inset; /* internal top shadow */
  }

  .concave {
    box-shadow: inset 0 5px 5px 0 rgb(0, 0, 0, .15);
  }

  .justify-content-flex-end {
    justify-content: flex-end;
  }

  button:active, button:focus {
    outline: 0;
    border: none;
    -moz-outline-style: none;
  }

  button:active {
    transform: translateY(1px);
  }

  .inflate::before {
    content: "\200b";
  }

  #buttons .v-btn {
    /*font-size: 3rem;*/
  }

</style>
