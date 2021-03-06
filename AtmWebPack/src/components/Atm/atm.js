import emitter from '../other/EventEmitterSingleton.js'
import AtmButton from '../AtmButton/atmButton.js'
import AtmRender from './atmRender.js'

export default class Atm {
  constructor(parentContainer, servicingTime, timeGap, id, className) {
    let self = this
    this.status = 'working'
    this.servicingTime = servicingTime
    this.id = id
    this.count = 0 // Всего обслужено клиентов
    this.parentContainer = parentContainer // родительский
    this.ownContainer = null // собственный
    this.display = null
    this.mainContainer = document.getElementById('mainContainer')
    this.id = id // Наименование айдишника
    this.className = className // Наименование класса
    this.servicing = false // Обслуживание клиента
    this.servicingTime = parseInt(servicingTime) // Время на обслуживание в миллисекундах
    this.timeGap = timeGap // Промежуток между тем как банкомат закончил обслуживание
    // клиента и приступил к обслуживание другого

    this.atmCounter = 0
    this.deleteButton = null
    this.render = null
    emitter.on('clientEntered', function(x) {
      if (self.id === x && self.status === 'working') {
        self.servicingClientStart()
      }
    })
    emitter.on(`ATM_DELETE_${this.id}`, function() {
      self.delete()
    })
  }

  getDataForRendering(state) {
    return {
      state: state,
      selector: this.parentContainer,
      variables: {
        servicing: this.servicing,
        servicingTime: this.servicingTime,
        count: this.count,
        id: this.id
      }
    }
  }

  init() {
    this.render = new AtmRender(this.id)
    emitter.emit(`RENDER_COMPONENT_ATM_${this.id}`, this.getDataForRendering(false))
    emitter.emit('AtmIsFree', `${this.id}`)

    this.ownContainer = document.getElementById(`${this.id}`)
    this.deleteButton = new AtmButton(this.parentContainer, `ATM_DELETE_${this.id}`).init()
  }

  update() {
    emitter.emit(`RENDER_COMPONENT_ATM_${this.id}`, this.getDataForRendering(true))
  }

  delete() {
    this.status = 'offline' // обрубаем связь
    emitter.emit(`RENDER_COMPONENT_ATM_${this.id}`, this.getDataForRendering(null))
  }

  servicingClientStart() {
    this.servicing = true
    this.update()
    this.servicingClient()
  }

  servicingClient() {
    setTimeout(() => {
      this.servicing = false
      this.count += 1
      this.update()
    }, this.servicingTime)
    setTimeout(() => {
      this.servicingClientEnd()
    }, this.servicingTime + this.timeGap)
  }

  servicingClientEnd() {
    this.servicing = false
    this.update()
    if (this.status === 'working') {
      emitter.emit('AtmIsFree', `${this.id}`)
    }
  }
}
