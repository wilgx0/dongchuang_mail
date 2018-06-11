import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import director_mail from './modules/director_mail.js'


Vue.use(Vuex)

export default new Vuex.Store({
    state,
	getters,
	actions,
	mutations,
	modules:{
        director_mail
    }
})
