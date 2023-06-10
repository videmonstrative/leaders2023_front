import { createStore } from 'vuex'
import { mutations } from './mutations'
import actions from './actions'

export default createStore({
    state: {
        projects: JSON.parse(window.localStorage.getItem('projects-vuejs') || '[]'),
        activeProject: JSON.parse(window.localStorage.getItem('active-project-vuejs') || null)
    },
    actions,
    mutations
})
