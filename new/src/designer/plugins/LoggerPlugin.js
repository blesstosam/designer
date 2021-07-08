export class LoggerPlugin {
  constructor(attr) {
    console.log(attr, 'mylogger')
    this.__attr__ = attr
  }
}

LoggerPlugin.$inject = ['__attr__']
LoggerPlugin.$name = 'myLoggerPlugin'