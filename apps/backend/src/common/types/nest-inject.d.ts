import "@nestjs/common";

declare module "@nestjs/common" {
  export function Inject<T = any>(
    token?: T
  ): (target: object, key: string | symbol | undefined, index?: number) => void;
}
