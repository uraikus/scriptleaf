/* globals test, expect */

import { createElement } from '../src/index.js'

test('Should create a div element', () => {
  let div = createElement('div')
  expect(div.tagName).toBe('DIV')
})

test('Should create an anchor element', () => {
  let anchor = createElement({ tagName: 'a' })
  expect(anchor.tagName).toBe('A')
})

test('Should create a table with three rows', () => {
  let table = createElement('table', {
    rows: [
      {cells: [{ innerText: 'Hello!' }]},
      {cells: ['Hello again!']},
      'Hello again and again!'
    ]
  })
  expect(table.rows.length).toBe(3)
  expect(table.rows[0].cells[0].innerText).toBe('Hello!')
})

test('Element should have functioning deleteElement method', () => {
  let div = createElement({
    children: [{}, {}]
  })
  div.firstElementChild.deleteElement()
  expect(div.children.length).toBe(1)
})

test('Element should have functioning createChildren method', () => {
  let div = createElement()
  div.createChildren({}, {}, {})
  expect(div.children.length).toBe(3)
})

test('Element should create children from an array', () => {
  let div = createElement()
  div.createChildren([{}, {}, {}])
  expect(div.children.length).toBe(3)
})

test('Element should append Element as child', () => {
  let childElement = createElement({ id: 'child-element' })
  let div = createElement({ children: [childElement] })
  expect(div.firstElementChild.id).toBe('child-element')
})

test('Should create textNodes with child method', () => {
  let div = createElement()
  div.createChildren('Greetings!')
  expect(div.firstChild.textContent).toBe('Greetings!')
})

test('Should throw error due to not utilizing proper child', () => {
  let div = createElement()
  expect(() => div.createChildren(1)).toThrowError()
})
test('Should create element with default styles', () => {
  let style = {
    fontWeight: 'bold',
    color: 'black'
  }
  let div = createElement({ style })
  expect(div.style.fontWeight).toBe('bold')
  expect(div.style.color).toBe('black')
})
test('Should throw error for invalid argument type', () => {
  expect(() => createElement(0)).toThrow()
})

test('Should append element to body though bound to an object', () => {
  document.body.innerHTML = ''
  let div = createElement.bind({})({ id: 'test' })
  expect(document.body.firstElementChild.id).toBe('test')
})

test('Should append element to a bound element', () => {
  let div = createElement()
  createElement.bind(div)({ id: 'test' })
  expect(div.firstElementChild.id).toBe('test')
})

test('Should fire "oncreation" event', () => {
  let div = createElement({oncreation: function () { this.innerHTML = 'Hello Test!' } })
  expect(div.innerHTML).toBe('Hello Test!')
})
