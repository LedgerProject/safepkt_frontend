import { Component, mixins, namespace } from 'nuxt-property-decorator'
import ProgramVerificationMixin from '~/mixins/step/program-verification'

const UploadSourceStore = namespace('step/upload-source')

@Component
class UploadSourceMixin extends mixins(ProgramVerificationMixin) {
  @UploadSourceStore.Getter
  canUploadSource!: () => boolean

  @UploadSourceStore.Getter
  isEditorVisible!: boolean

  @UploadSourceStore.Mutation
  enableSourceUpload!: () => void

  @UploadSourceStore.Mutation
  hideEditor!: () => void

  @UploadSourceStore.Mutation
  showEditor!: () => void

  @UploadSourceStore.Action
  uploadSource!: ({ name, source }: {name: string, source: string }) => void

  async tryToUploadSource () {
    this.setProjectId({ projectId: '' })

    await this.uploadSource({
      name: this.projectName,
      source: this.base64EncodedSource
    })
    await this.tryToVerifyProgram()
  }
}

export default UploadSourceMixin
