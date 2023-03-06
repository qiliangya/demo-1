import { IApplicationContext } from "./Context"
import { AppContainerLifecycle } from "./Lifecycle"
import { IAppPlugin, IAppPluginOption, PluginManager } from "./PluginManager"
import { Logger } from './Logger'

/**
 * 应用容器入口
 * 支持生命周期
 * 支持插件调用
 * 支持外部访问上下文
 */
export class AppContainer {
    private lifecycle: AppContainerLifecycle = {
      async onBeforeMount(context) {
        
      },

      async onMount(context) {
        
      },

      async onBeforeUnmount(context) {
        
      },

      async onUnmount(context) {
        
      },
    }
  
    private plugins = PluginManager.getInstance()
  
    private context: IApplicationContext
  
    private logger = new Logger()
    /**
     * 注册生命周期
     */
    registerLifecycle(lifecycle: AppContainerLifecycle) {
      this.lifecycle = lifecycle
    }
  
    /**
     * 注册插件
     */
    registerPlugin<T extends IAppPluginOption>(plugin: IAppPlugin<T>) {
      this.plugins.register(plugin)
    }
  
    /**
     * 注册上下文
     */
    registerContext(context: IApplicationContext = {} as any) {
      if (context.logger) {
        this.logger = context.logger
        this.context.logger = this.logger
      } else {
        this.context = context
        this.context.logger = this.logger
      }
    }

    getContext() {
      return this.context
    }
  
    /**
     * 容器启动
     */
    async start() {
      if (this.lifecycle.onBeforeMount) {
        // 初始化上下文
        this.registerContext()
        this.logger.info('应用准备中')
        await this.lifecycle.onBeforeMount(this.context)
        this.logger.info('插件准备中')
        // 插件初始化之前的操作
        await this.plugins.onBeforeMountAll(this.context)
      }
  
      if (this.lifecycle.onMount) {
        await this.lifecycle.onMount(this.context)
        this.logger.info('应用初始化成功')
        await this.plugins.onMountAll(this.context)
        this.logger.info('插件初始化成功')
      }
    }
  
    /**
     * 容器卸载
     */
    async unmount() {
      if (this.lifecycle.onBeforeUnmount) {
        this.logger.info('应用准备卸载')
        await this.lifecycle.onBeforeUnmount(this.context)
        this.logger.info('插件准备卸载')
        await this.plugins.onBeforeUnmountAll(this.context)
      }
      // 其他卸载逻辑
      if (this.lifecycle.onUnmount) {
        await this.lifecycle.onUnmount(this.context)
        this.logger.info('应用卸载成功')
        await this.plugins.onUnmountAll(this.context)
        this.logger.info('插件卸载成功')
      }
    }
  }