/* globals Element */

const assignAttributes = require('./common.js')

function createElement () {
  let tagName = 'div'
  let attributes = {}
  let parentElement = this instanceof Element ? this : document.body
  for (let x = 0; x < arguments.length; x++) {
    if (typeof arguments[x] === 'string') tagName = arguments[x]
    else if (arguments[x] instanceof Element) parentElement = arguments[x]
    else if (typeof arguments[x] === 'object') attributes = arguments[x]
    else throw new Error('Invalid argument type')
  }
  if (attributes.tagName) {
    tagName = attributes.tagName
    delete attributes.tagName
  }
  if (attributes.parentElement) {
    if (attributes.parentElement instanceof Element) parentElement = attributes.parentElement
    else if (typeof attributes.parentElement === 'string') parentElement = document.querySelector(attributes.parentElement)
    delete attributes.parentElement
  }
  let element
  if (tagName === 'td') {
    element = parentElement.insertCell(parentElement.cells.length)
  } else if (tagName === 'tr') {
    element = parentElement.insertRow(parentElement.rows.length)
  } else {
    element = document.createElement(tagName)
    parentElement.appendChild(element)
  }
  element.createChild = createElement.bind(element)
  element.createChildren = function () {
    for (let x = 0; x < arguments.length; x++) {
      if (Array.isArray(arguments[x])) {
        arguments[x].forEach(element => {
          processChild(element, this)
        })
      } else processChild(arguments[x], this)
    }
    return this.children
  }
  element.deleteElement = function () {
    this.parentElement.removeChild(this)
  }
  if (attributes.children) {
    attributes.children.forEach(child => processChild(child, element))
    delete attributes.children
  }
  if (attributes.rows) {
    attributes.rows.forEach(row => {
      if (typeof row === 'string') {
        createElement('tr', { innerText: row }, element)
      } else createElement('tr', row, element)
    })
    delete attributes.rows
  }
  if (attributes.cells) {
    attributes.cells.forEach(cell => {
      if (typeof cell === 'string') {
        createElement('td', { innerText: cell }, element)
      } else createElement('td', cell, element)
    })
    delete attributes.cells
  }
  let oncreation = attributes.oncreation
  delete attributes.oncreation
  assignAttributes(element, attributes)
  if (typeof oncreation === 'function') oncreation.bind(element)()
  return element
}

function processChild (childObject, parentElement) {
  if (typeof childObject === 'string') {
    parentElement.appendChild(document.createTextNode(childObject))
  } else if (childObject instanceof Element) {
    parentElement.appendChild(childObject)
  } else if (typeof childObject === 'object' && Array.isArray(childObject) === false) {
    createElement(childObject, parentElement)
  } else {
    throw new Error('Argument is invalid type. Must either be string or object.')
  }
}

module.exports =  createElement
