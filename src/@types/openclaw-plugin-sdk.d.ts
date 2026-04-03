declare module "openclaw/plugin-sdk/plugin-entry" {
  interface ToolRegistration {
    name: string;
    description: string;
    parameters: import("@sinclair/typebox").TObject<any>;
    execute(id: string, params: Record<string, unknown>): Promise<{
      content: Array<{ type: "text"; text: string }>;
    }>;
  }

  interface PluginApi {
    registerTool(registration: ToolRegistration, options?: { optional?: boolean }): void;
  }

  interface PluginEntryConfig {
    id: string;
    name: string;
    description: string;
    register(api: PluginApi): void;
  }

  export function definePluginEntry(config: PluginEntryConfig): PluginEntryConfig & { default: PluginEntryConfig };
}
