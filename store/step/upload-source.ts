import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import Vue from 'vue'
import { HttpMethod } from '~/config'
import { Project } from '~/types/project'
import { GETTER_PROJECT_ID, GETTER_PROJECT_REVISION } from '~/store/editor'
import {
  MUTATION_ADD_PROJECT,
  MUTATION_PUSH_ERROR
} from '~/store/verification-runtime'

const MUTATION_HIDE_EDITOR = 'hideEditor'
const MUTATION_SHOW_EDITOR = 'showEditor'

export {
  MUTATION_HIDE_EDITOR,
  MUTATION_SHOW_EDITOR
}

@Module({
  name: 'upload-source',
  stateFactory: true,
  namespaced: true
})
class UploadSourceStore extends VuexModule {
    step: {
      enabledSourceUpload: boolean,
      isEditorVisible: boolean
    } = {
      enabledSourceUpload: true,
      isEditorVisible: true
    }

    get canUploadSource (): () => boolean {
      return () => this.step.enabledSourceUpload
    }

    get isEditorVisible (): boolean {
      return this.step.isEditorVisible
    }

    @Mutation
    [MUTATION_HIDE_EDITOR] (): void {
      this.step = {
        ...this.step,
        ...{ isEditorVisible: false }
      }
    }

    @Mutation
    [MUTATION_SHOW_EDITOR] (): void {
      this.step = {
        ...this.step,
        ...{ isEditorVisible: true }
      }
    }

    @Mutation
    enableSourceUpload (): void {
      this.step = {
        ...this.step,
        ...{ enabledSourceUpload: true }
      }
    }

    @Mutation
    disableSourceUpload (): void {
      this.step = {
        ...this.step,
        ...{ enabledSourceUpload: false }
      }
    }

    @Action
    async uploadSource ({ name, source }: {name: string, source: string }) {
      const { baseUrl, routes } = this.context.rootGetters['verification-runtime/routingParams']

      const url = `${baseUrl}${routes.uploadSource.url}`
      const method: HttpMethod = routes.uploadSource.method
      const body: BodyInit = JSON.stringify({ source })

      try {
        const response = await fetch(url, this.context.rootGetters['verification-runtime/getFetchRequestInit'](method, body))
        const json = await response.json()

        if (
          typeof json.project_id === 'undefined' ||
                !json.project_id
        ) {
          Vue.notify({
            title: 'Warning',
            text: 'Sorry, the source upload has failed.',
            type: 'warn'
          })

          return
        }

        Vue.notify({
          title: 'Success',
          text: `The source was successfully uploaded under project id ${json.project_id}.`,
          type: 'success'
        })

        this.context.commit(
          'editor/setProjectId',
          { projectId: json.project_id },
          { root: true }
        )

        const project: Project = {
          id: this.context.rootGetters[`editor/${GETTER_PROJECT_ID}`],
          revision: this.context.rootGetters[`editor/${GETTER_PROJECT_REVISION}`],
          name,
          source,
          llvmBitcodeGenerationStepStarted: false,
          llvmBitcodeGenerationStepReport: {},
          llvmBitcodeGenerationStepProgress: {},
          llvmBitcodeGenerationStepDone: false,
          symbolicExecutionStepStarted: false,
          symbolicExecutionStepReport: {},
          symbolicExecutionStepProgress: {},
          symbolicExecutionStepDone: false,
          sourceRestorationStepStarted: false,
          sourceRestorationStepReport: {},
          sourceRestorationStepProgress: {},
          sourceRestorationStepDone: false,
          programVerificationStepStarted: false,
          programVerificationStepReport: {},
          programVerificationStepProgress: {},
          programVerificationStepDone: false
        }

        this.context.commit(
          `verification-runtime/${MUTATION_ADD_PROJECT}`,
          project,
          { root: true }
        )
        this.context.commit(
          'disableSourceUpload'
        )
      } catch (e) {
        this.context.commit(
          `verification-runtime/${MUTATION_PUSH_ERROR}`,
          { error: e },
          { root: true }
        )

        Vue.notify({
          title: 'Oops',
          text: 'Sorry, something went wrong when trying to upload some source code.',
          type: 'error'
        })
      }
    }
}

export default UploadSourceStore
