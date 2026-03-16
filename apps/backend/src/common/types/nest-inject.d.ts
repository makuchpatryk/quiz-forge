import "@nestjs/common";

declare module "@nestjs/common" {
  export function Inject<T = unknown>(
    token?: T,
  ): (target: object, key: string | symbol | undefined, index?: number) => void;
}
