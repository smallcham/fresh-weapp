import api from './api'
const app = getApp()

const addCart = (goods_code, amount=1, callback=undefined, errcall=undefined) => {
  api.post(app.globalApi.cart_add + '/' + goods_code + '/' + amount).then(res => {
    if (undefined !== callback) callback()
   }).catch(err => { 
     if (undefined !== errcall) errcall()
    })
}

module.exports = {
  addCart
}