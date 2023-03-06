import { IApplicationContext } from './Context'
import { AppContainerLifecycle } from './Lifecycle'

export interface AppContainerPlugin extends AppContainerLifecycle {
  name: string

  description: string

  config: Record<string, any>

  version: string
}

export abstract class AppPluginAdapter<PluginConfig extends Record<string, any>> implements AppContainerPlugin {
  abstract name: string

  abstract description: string

  abstract version: string

  config: PluginConfig

  constructor(config: PluginConfig) {
    this.config = config
  }

  onBeforeMount?: ((context: IApplicationContext) => Promise<void>) | undefined

  onBeforeUnmount?: ((context: IApplicationContext) => Promise<void>) | undefined

  onMount?: ((context: IApplicationContext) => Promise<void>) | undefined

  onUnmount?: ((context: IApplicationContext) => Promise<void>) | undefined
}