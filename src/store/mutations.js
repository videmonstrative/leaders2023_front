
// for testing
if (navigator.webdriver) {
    window.localStorage.clear()
}

export const mutations = {
    addProject (state, project) {
        state.projects.push(project)
        state.activeProject = project
    },

    setActiveProject (state, project) {
        state.activeProject = project
    },

    setWallPoint (state, point) {
        state.activeProject.wallsPoints.push(point)
    },

    addRiser (state, point) {
        if (!state.activeProject) {
            return
        }
        point['z'] = null
        state.activeProject.risers.push(point)
    },

    addDrop (state, point) {
        if (!state.activeProject) {
            return
        }
        point['z'] = null
        state.activeProject.drops.push(point)
    },

    clearProject (state) {
        if (!state.activeProject) {
            return
        }
        state.activeProject.wallsPoints = []
        state.activeProject.risers = []
        state.activeProject.drops = []
    },
}
