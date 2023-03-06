import { IApplicationContext } from './Context'
import { AppContainerLifecycle } from './Lifecycle'

export interface IAppPluginOption {
  // 插件储存命名空间， 例如插件原本是 ctx.i18n = xxx, 有时候i18n可能会被别的插件所占用，可以通过命名空间转移 ctx.[namespace] = xxx
  namespace?: string
  [key: string]: any
}

/**
 * 插件生命周期， 暂时和容器生命周期共享
 */
export interface IAppPluginLifecycle extends AppContainerLifecycle {

}

/**
 * 插件定义
 */
export interface IAppPlugin<T extends IAppPluginOption> extends IAppPluginLifecycle {
  // 插件名称
  name: string
  desc?: string
  // 插件配置
  config?: T
  // 插件状态
  enabled?: boolean
  // 开启插件
  enable?(): void
  // 禁用插件
  disable?(): void
  // 移除插件
  remove?(): void
  // 插件调用
  execute?(context: IApplicationContext, options?: IAppPluginOption): Promise<void>
}

/**
 * 插件管理器
 *
 * 为单例模式，用来管理所有的插件
 */
export class PluginManager {
  private static instance: PluginManager

  private plugins: Map<string, IAppPlugin<any>>

  constructor() {
    this.plugins = new Map()
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager()
    }
    return PluginManager.instance
  }

  public register(plugin: IAppPlugin<any>) {
    // 默认启用
    plugin.enabled = true
    this.plugins.set(plugin.name, plugin)
  }

  public getPlugin(name: string): IAppPlugin<any> | undefined {
    return this.plugins.get(name)
  }

  public enablePlugin(name: string) {
    const plugin = this.getPlugin(name)
    if (plugin) {
      plugin.enabled = true
    }
  }

  public disablePlugin(name: string) {
    const plugin = this.getPlugin(name)
    if (plugin) {
      plugin.enabled = false
    }
  }

  public removePlugin(name: string) {
    const plugin = this.getPlugin(name)
    if (plugin) {
      this.plugins.delete(name)
    }
  }

  public async executeAll(context: IApplicationContext) {
    const promises: any[] = []
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.execute) {
        promises.push(plugin.execute(context))
      }
    }
    await Promise.all(promises)
  }

  public async onBeforeMountAll<T extends IApplicationContext>(context: T) {
    const promises: any[] = []
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.onBeforeMount) {
        promises.push(plugin.onBeforeMount(context))
      }
    }
    await Promise.all(promises)
  }

  public async onMountAll<T extends IApplicationContext>(context: T) {
    const promises: any[] = []
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.onMount) {
        promises.push(plugin.onMount(context))
      }
    }
    await Promise.all(promises)
  }

  public async onBeforeUnmountAll<T extends IApplicationContext>(context: T) {
    const promises: any[] = []
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.onBeforeUnmount) {
        promises.push(plugin.onBeforeUnmount(context))
      }
    }
    await Promise.all(promises)
  }

  public async onUnmountAll<T extends IApplicationContext>(context: T) {
    const promises: any[] = []
    for (const plugin of this.plugins.values()) {
      if (plugin.enabled && plugin.onUnmount) {
        promises.push(plugin.onUnmount(context))
      }
    }
    await Promise.all(promises)
  }
}
