import { Module, VuexModule } from 'vuex-module-decorators'
import { VerificationStep as Step, VerificationStep } from '~/modules/verification-steps'
import { VerificationStep as VerificationStepType } from '~/types/verification-steps'

@Module({
  name: 'report',
  stateFactory: true,
  namespaced: true
})
class ReportStore extends VuexModule {
  get isReportVisible (): boolean {
    return this.context.rootGetters['verification-steps/nextStep']() !== Step.uploadSourceStep
  }

  get reportTitle (): (step: VerificationStepType) => string {
    return (step: VerificationStepType) => {
      switch (true) {
        case step === VerificationStep.uploadSourceStep:
          return 'Source upload'

        case step === VerificationStep.llvmBitcodeGenerationStep:
          return 'LLVM bitcode generation report'

        case step === VerificationStep.symbolicExecutionStep:
          return 'Symbolic execution report'

        default:
          return ''
      }
    }
  }
}

export default ReportStore
