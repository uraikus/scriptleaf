ScriptLeaf
=================
![alt text](https://cdn.glitch.com/e82b5b1a-c4da-4d19-8e46-44270e4276f0%2Fcode-coverage-badge.svg?1549736166571 "code coverage 100%")

[GitHub](https://github.com/uraikus/scriptleaf)

ScriptLeaf aims to provide a robust lightweight Javascript web application framework that provides components, templates, and state without bloating up applications and straying away from vanilla Javascript syntax and semantics.

***Global State***

Each state within the global scope is given it's own name on creation. A state can be created and updated by utilizing the following:
```
// setState(stateName:string, stateValue:arbitrary)

import { setState } from 'scriptleaf'

setState('myState', 'Whatever value I want!') // Returns state object or throws error
```
To view the state's current value:
```
// getState(stateName:string)

import { getState } from 'scriptleaf'

getState('myState')  // Returns stateValue or throws error
```
To clear state in the Global State:
```
import { clearState, clearAllState } from 'scriptleaf'

clearState('test') // Clears all listeners and value from particular state
clearAllState() // Clears all global state keys, methods, and values
```
To bind an element to a particular state (so it updates on state change), utilize the following:
```
// bindState(stateName:string, [attribute:string='innerText', boundObject:element/object=this])

import { bindState, setState, createElement } from 'scriptleaf'

let myElement = createElement()
setState('testState', 'This can be dynamically updated!')
bindState('testState', 'innerHTML', myElement) // Binds the innerHTML of myElement
setState('testState', () => alert('now I\'m a function!'))
```

***Local State/Custom State***

If your application is more componentized or your state is so large you would like to work from several smaller State banks, you can utilize the following:

```
import { State, createElement } from 'scriptleaf'

let myState = new State()
let nameInput = createElement('input')

myState.set('firstName', 'Patrick')
myState.get('firstName') // returns 'Patrick'
myState.bind('firstName', 'value', nameInput)
myState.clear('firstName')
myState.clearAll() // Clears all states in object
```

***Import/Export State to JSON***

You can import/export json objects with the following:

```
/* Component State */
import { State } from 'scriptleaf'

let myState = new State()

let json = { test: true }
myState.importJSON(json) // Accepts stringified json as well
myState.get('test') === true
json = myState.exportJSON()
json.test === true
json = myState.exportStringified()
typeof json === 'string'
JSON.parse(json).test === true

/* Global State */
import { importJsonToState, exportJsonState, exportStringifiedState, getState } from 'scriptleaf'

let json = { test: true }
importJsonToState(json) // Accepts stringified json as well
getState('test') === true
json = exportJsonState()
json.test === true
json = exportStringifiedState()
typeof json === 'string'
JSON.parse(json).test === true
```

***State Listeners***

State objects and DOM elements can individually listen to changes of state and fire off events:
```
import { State, addStateListener, createElement, setState } from 'scriptleaf'

const myCallback = newValue => console.log(`Hello ${newValue}!`)

/* To add a listener to a custom state store */
let myState = new State()
myState.set('name', 'Add name')
myState.addListener('name', myCallback)
myState.set('name', 'Patrick')

/* To create a global state listener */
setState('name', 'Add name')
addStateListener('name', myCallback)
setState('name', 'Patrick')

/* To add state change to an object/DOM element */
let myPoints = createElement('input')
setState('points', 0)
myPoints.bind('points')
myPoints.onstatechange = function (newValue) {
  this.innerText = newValue * 1000
}
setState('points', 5)

/* Clear all global state subscribers to state changes */
clearStateSubscribers('points')
/* or for component states */
myState.clearSubscribers('points')
```

***DOM Manipulation***

Modified elements can be made as below:
```
/*
  createElement(tagName:string='div', attributes:object={}, parentElement:DOM Element=document.body)
  NOTE: Arguments can be in any order.
*/
import { createElement } from 'scriptleaf'

let myContainer = createElement({ id: 'container' })
myContainer.createChild('b', { innerText: 'Name: ' })
myContainer.createChildren(
  { tagName: 'input', value: 'Patrick', onstatechange: console.log },
  { tagName: 'br' },
  { tagName: 'b', innerText: 'Gender' },
  { tagName: 'input', value: 'male' },
  { id: 'form-tools', children: [
    { tagName: 'input', type: 'button', value: 'Submit' },
    { tagName: 'input', type: 'button', value: 'Cancel', onclick: () => location.reload() },
    'Text nodes can be added with strings!'
  ]}
)
```
Some other extensions to the DOM:
```
myElement.deleteElement() // Deletes element
myElement.oncreation = function () {} // Fires after creation

// Example
createElement('form', {
  children: [
    { tagName: 'input', oncreation: function () {bindState('input', 'value', this)} }
  ]
})
```

***Template Objects***

Templates can easily be created by importing/exporting objects:
```
let emptyNoteTemplate = {
  tagName: 'tr',
  cells: [
    { contentEditable: true, className: 'time' },
    { contentEditable: true, className: 'details' },
    { contentEditable: true, className: 'initials' }
  ]
}

let newNote = createElement(emptyNoteTemplate)
```
Dynamic templates can easily be created with functions or classes:
```
let eventsLog = createElement('table')
let newNoteTemplate = (time, details, initials) => ({
  tagName: 'tr',
  cells: [
    { className: 'time', innerText: time },
    { className: 'details', innerText: details },
    { className: 'initials', innerText: initials }
  ]
})

let newNote = newNoteTemplate(1200, 'INFO: Everything accomplished at this time.', 'PT')
createElement(newNote, eventsLog)
```
Elements without a tagName will default to a 'div.'
Strings in the "children" array will become textNodes.

Checkout: [Hello Scriptleaf Glitch Project](https://glitch.com/edit/#!/hello-scriptleaf)