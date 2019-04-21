class State {
  constructor () {
    this.state = {}
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.bind = this.bind.bind(this)
    this.addListener = this.addListener.bind(this)
    this.clearSubscribers = this.clearSubscribers.bind(this)
    this.importJSON = this.importJSON.bind(this)
    this.exportJSON = this.exportJSON.bind(this)
    this.exportStringified = this.exportStringified.bind(this)
    this.clear = this.clear.bind(this)
    this.clearAll = this.clearAll.bind(this)
  }
  
  importJSON (json) {
    json = typeof json === 'string' ? JSON.parse(json) : json
    for (let key in json) {
      this.set(key, json[key])
    }
  }
  
  exportJSON () {
    let object = {}
    for (let key in this.state) {
      object[key] = this.state[key].value
    }
    return object
  }
  
  exportStringified () {
    return JSON.stringify(this.exportJSON())
  }

  set (stateName, stateValue) {
    if (this.state[stateName] === undefined) {
      create.bind(this)(stateName, stateValue)
    } else if (this.state[stateName].validState === true) {
      update.bind(this)(stateName, stateValue)
    } else throw new Error('Invalid state name!')
    return this
  }

  get (stateName) {
    validateState.bind(this)(stateName)
    return this.state[stateName].value
  }

  bind (stateName, attribute, element) {
    validateState.bind(this)(stateName)
    if (attribute) element[attribute] = this.state[stateName].value
    this.state[stateName].subscribers.set(element, attribute)
    return this
  }

  addListener (stateName, callback) {
    validateState.bind(this)(stateName)
    if (typeof callback !== 'function') throw new Error('Argument is not a function!')
    else this.state[stateName].listeners.push(callback)
  }
  
  clearSubscribers (stateName) {
    validateState.bind(this)(stateName)
    this.state[stateName].subscribers.clear()
  }
  
  clear (stateName) {
    delete this.state[stateName]
  }
  
  clearAll () {
    Object.keys(this.state).forEach(this.clear)
  }
}

const GLOBAL_STATE = new State()

Object.assign(State, {
  setState: GLOBAL_STATE.set.bind(GLOBAL_STATE),
  getState: GLOBAL_STATE.get.bind(GLOBAL_STATE),
  bindState: GLOBAL_STATE.bind.bind(GLOBAL_STATE),
  clearStateSubscribers: GLOBAL_STATE.clearSubscribers.bind(GLOBAL_STATE),
  addStateListener: GLOBAL_STATE.addListener.bind(GLOBAL_STATE),
  importJsonToState: GLOBAL_STATE.importJSON.bind(GLOBAL_STATE),
  exportJsonState: GLOBAL_STATE.exportJSON.bind(GLOBAL_STATE),
  exportStringifiedState: GLOBAL_STATE.exportStringified.bind(GLOBAL_STATE),
  clearState: GLOBAL_STATE.clear.bind(GLOBAL_STATE),
  clearAllState: GLOBAL_STATE.clearAll.bind(GLOBAL_STATE)
})

function validateState(stateName) {
  if (this.state[stateName] === undefined || this.state[stateName].validState !== true) throw new Error('State does not exist!')
}

function update (stateName, stateValue) {
  let state = this.state[stateName]
  state.value = stateValue
  state.listeners.forEach(func => func(state.value))
  state.subscribers.forEach((attr, element) => {
    element[attr] = stateValue
    if (typeof element.onstatechange === 'function') {
      element.onstatechange(stateValue)
    }
  })
  return this
}

function create (stateName, stateValue) {
  this.state[stateName] = {
    value: stateValue,
    subscribers: new Map(),
    validState: true,
    listeners: []
  }
}

module.exports = State
