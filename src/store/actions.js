
let autoIncrement = 0
let riserIncrement = 0
let dropIncrement = 0

export default {

    addProject ({ commit }, name) {
        commit('addProject', {
            id: ++autoIncrement,
            name,
            wallsPoints: [],
            risers: [],
            drops: [],
            response: null,
        })
    },

    setActiveProject ({ commit }, project) {
        commit('setActiveProject', project)
    },

    setWallPoint ({ commit }, point) {
        commit('setWallPoint', point)
    },

    addRiser ({ commit }, point) {
        point['id'] = ++riserIncrement
        commit('addRiser', point)
    },

    addDrop ({ commit }, point) {
        point['id'] = ++dropIncrement
        commit('addDrop', point)
    },

    clearProject ({ commit }) {
        commit('clearProject')
    },
}
