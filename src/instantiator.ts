import * as vscode from 'vscode';
import { Container } from "injection";
import { Instance } from "./instance";
import { Library } from './library';
import { ScriptLoader } from './loader';
import { CommandRegistry } from './registry';
import { Configuration } from './configuration';

export class Instantiator {
  private static _container: Container;

  public static get container(): Container {
    return Instantiator._container;
  }

  public static set container(value: Container) {
    Instantiator._container = value;
  }

  public static async startup(context: vscode.ExtensionContext) {
    const ctors = [
      ScriptLoader,
      Library,
      CommandRegistry,
      Configuration
    ];
    const container = await this.setupIocContainer(context, ctors);
    Instantiator.container = container;
    await this.instantiate(container, ctors);
    return Instantiator.container;
  }

  private static async setupIocContainer(context: vscode.ExtensionContext, ctors: any[]) {
    const container = new Container();
    container.registerObject(Instance.ExtensionContext, context);
    ctors.forEach(Constructor => container.bind(Constructor));
    return container;
  }

  private static async instantiate(container: Container, ctors) {
    for (const Constructor of ctors) {
      await container.getAsync(Constructor);
    }
  }

}