<template>

  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Новая конфигурация СТМ</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Уникальный идентификатор</label>
              <input v-model="projectName" type="text" class="form-control">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Отмена</button>
          <button type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal" @click="addProject">Создать</button>
        </div>
      </div>
    </div>
  </div>

  <div class="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
    <div class="d-flex align-items-center flex-shrink-0 p-3 link-body-emphasis text-decoration-none border-bottom">
      <div class="row">
        <div class="col-lg-10">
          <span class="fs-6 fw-semibold">Конфигурации СТМ</span>
        </div>
        <div class="col-lg-2">
          <button type="button" class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Add
          </button>
        </div>
      </div>
    </div>
    <div class="list-group list-group-flush border-bottom scrollarea">
      <a
          v-for="project in store.state.projects"
          :class="store.state.activeProject.id === project.id ? 'active' : ''"
          href="#"
          class="list-group-item list-group-item-action py-3 lh-sm"
          aria-current="true"
          @click="setActiveProject(project)"
      >
        <div class="d-flex w-100 align-items-center justify-content-between">
          <strong class="mb-1">{{ project.name }}</strong>
          <small></small>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {ref} from "vue";

const store = useStore()

const projectName = ref('СТМ8-1П-Б-')

function addProject() {
  if (projectName.value.trim()) {
    store.dispatch('addProject', projectName.value.trim())
  }
  projectName.value = 'СТМ8-1П-Б-'
}

function setActiveProject(project) {
  store.dispatch('setActiveProject', project)
}

</script>
