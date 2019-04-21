/* globals test, expect */

import State, { setState, bindState, getState, addStateListener, clearStateSubscribers, importJsonToState, exportJsonState, exportStringifiedState, clearState, clearAllState } from '../src/index.js'

test('Should set and read global state:', () => {
  setState('myState', 0)
  expect(getState('myState')).toBe(0)
})

test('Should export global state to JSON:', () => {
  setState('myState', 'included')
  let json = exportJsonState()
  expect(json.myState).toBe('included')
})

test('Should import JSON into global state:', () => {
  let json = { test: 'included' }
  importJsonToState(json)
  expect(getState('test')).toBe('included')
})

test('Should import JSON string into global state:', () => {
  let json = '{"test": true}'
  importJsonToState(json)
  expect(getState('test')).toBe(true)
})

test('Should export state to stringified JSON:', () => {
  setState('test', 'stringified')
  let string = exportStringifiedState()
  expect(typeof string).toBe('string')
  let json = JSON.parse(string)
  expect(json.test).toBe('stringified')
})

test('Should clear a particular state:', () => {
  setState('test', true)
  expect(getState('test')).toBe(true)
  clearState('test')
  expect(() => getState('test')).toThrow()
})

test('Should clear all state:', () => {
  setState('test', true)
  expect(getState('test')).toBe(true)
  clearAllState()
  let json = exportJsonState()
  expect(Object.keys(json).length).toBe(0)
})

test('Should create a new State object:', () => {
  let myState = new State()
  myState.set('myState', 'test2')
  setState('myState', 'test1')
  expect(myState.get('myState')).toBe('test2')
  expect(myState.get('myState')).not.toBe(getState('myState'))
})

test('Should update elements innerText on State change:', () => {
  setState('phase', 'start')
  let element = document.createElement('div')
  bindState('phase', 'innerText', element)
  expect(element.innerText).toBe('start')
  setState('phase', 'end')
  expect(element.innerText).toBe('end')
})

test('Should unsubscribe all listeners:', () => {
  let fired = false
  let div = document.createElement('div')
  div.onstatechange = change => fired = change
  setState('removeSubscribers', false)
  bindState('removeSubscribers', null, div)
  expect(fired).toBe(false)
  clearStateSubscribers('removeSubscribers')
  setState('removeSubscribers', true)
  expect(fired).toBe(false)
  
})

test('Should fire "onstatechange" for element', () => {
  let fired = false
  let div = document.createElement('div')
  div.onstatechange = change => fired = change
  setState('test', false)
  bindState('test', null, div)
  expect(fired).toBe(false)
  setState('test', true)
  expect(fired).toBe(true)
})

test('Should bind state listener', () => {
  let fired = false
  setState('test', false)
  addStateListener('test', change => fired = change)
  expect(fired).toBe(false)
  setState('test', true)
  expect(fired).toBe(true)
})

test('Should error state listener for bad argument', () => {
  setState('test', false)
  expect(() => addStateListener('test', 1)).toThrow(new Error('Argument is not a function!'))
})

test('Should error state listener for non-existent state', () => {
  expect(() => addStateListener('new-test', change => change)).toThrow(new Error('State does not exist!'))
})

test('Should throw error for setting invalid state name', () => {
  expect(() => setState('toString', false)).toThrow(new Error('Invalid state name!'))
})

test('Should throw error for getting non-existent state', () => {
  expect(() => getState('unset-state')).toThrow(new Error('State does not exist!'))
})

test('Should throw error for binding non-existent state', () => {
  expect(() => bindState('unset-state', null, document.body)).toThrow(new Error('State does not exist!'))
})
