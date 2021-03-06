import { EnvParam, EnvProvider } from '~/modules/shared-state'

const getHostParams = (environmentProvider: EnvProvider) => {
  let host: string|undefined = 'localhost'
  let port: string|Number|undefined = '3000'
  let scheme: string|undefined = 'http://'

  const environment: EnvParam = environmentProvider.getEnvironmentParameters()
  if (environment.productionMode) {
    scheme = 'https://'
    host = process.env.API_HOST
    port = ''

    if (
      typeof process.env.API_PORT !== 'undefined' &&
      process.env.API_PORT
    ) {
      port = `:${process.env.API_PORT}`
    }
  } else if (
    typeof process.env.API_HOST !== 'undefined' &&
    process.env.API_HOST
  ) {
    host = process.env.API_HOST

    if (
      typeof process.env.API_PORT !== 'undefined' &&
      process.env.API_PORT
    ) {
      port = `:${process.env.API_PORT}`
    }

    if (
      typeof process.env.API_SCHEME !== 'undefined' &&
      process.env.API_SCHEME
    ) {
      scheme = process.env.API_SCHEME
    }
  }

  return {
    host,
    port,
    scheme
  }
}

type METHOD_GET = 'GET'
type METHOD_POST = 'POST'

type HttpMethod = METHOD_GET|METHOD_POST

class methods {
  static METHOD_GET: HttpMethod = 'GET'
  static METHOD_POST: HttpMethod = 'POST'
}

export {
  HttpMethod
}

type Route = {
  method: HttpMethod,
  url: string,
  params: {[key: string]: StringConstructor},
}

type Routes = {
  [key: string]: Route
}

type Api = {
  host?: string,
  port?: string,
  scheme?: string,
  routes: Routes
}

const api: Api = {
  routes: {
    uploadSource: {
      method: methods.METHOD_POST,
      url: '/source',
      params: {}
    },
    startSourceRestoration: {
      method: methods.METHOD_POST,
      url: '/source-restoration/{{ projectId }}',
      params: {
        projectId: String
      }
    },
    getSourceRestorationProgress: {
      method: methods.METHOD_GET,
      url: '/source-restoration/{{ projectId }}/progress',
      params: {
        projectId: String
      }
    },
    getSourceRestorationReport: {
      method: methods.METHOD_GET,
      url: '/source-restoration/{{ projectId }}/report',
      params: {
        projectId: String
      }
    },
    startProgramVerification: {
      method: methods.METHOD_POST,
      url: '/program-verification/{{ projectId }}',
      params: {
        projectId: String
      }
    },
    getProgramVerificationProgress: {
      method: methods.METHOD_GET,
      url: '/program-verification/{{ projectId }}/progress',
      params: {
        projectId: String
      }
    },
    getProgramVerificationReport: {
      method: methods.METHOD_GET,
      url: '/program-verification/{{ projectId }}/report',
      params: {
        projectId: String
      }
    }
  }
}

const getApi = (environmentProvider: EnvProvider) => {
  api.host = getHostParams(environmentProvider).host
  api.port = getHostParams(environmentProvider).port
  api.scheme = getHostParams(environmentProvider).scheme

  return api
}

const getRoutes = (): Routes => api.routes
const getBaseURL = () => `${api.scheme}${api.host}${api.port}`

export { Api, Routes }

export default {
  getApi,
  getRoutes,
  getBaseURL
}
