import { IApplicationContext } from "./Context"

export interface AppContainerLifecycle {
    // 容器应用启动前执行
    onBeforeMount?: (context: IApplicationContext) => Promise<void>
    // 容器应用启动后执行
    onMount?: (context: IApplicationContext) => Promise<void>
    // 容器应用卸载前执行
    onBeforeUnmount?: (context: IApplicationContext) => Promise<void>
    // 容器应用卸载后执行
    onUnmount?: (context: IApplicationContext) => Promise<void>
  }