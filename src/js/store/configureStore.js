import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk' // 非同期処理を実現するMiddleware
// 通常reducerはActionCreatorの戻り値であるactionを受け取る
// しかしAjaxなどの非同期処理では、戻り値としてactionを返せない
// その場合は、非同期処理を実行する関数を戻り値として返しておけば、thunkがその関数を実行してくれる
import createLogger from 'redux-logger' // reducerがactionを処理したときに、reducer前のstateの値、actionの値、reducer後のstateの値をコンソールログに書き出すMiddleware
import rootReducer from '../reducers/reducers'

const loggerMiddleware = createLogger()

export default const configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}
