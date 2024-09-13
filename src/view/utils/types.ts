export type NotNullObj<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

export type DeepRequired<T> = T extends Date | Blob
  ? T
  : {
      [K in keyof T]-?: NonNullable<DeepRequired<T[K]>>;
    };

export type ValidationParams = {
  onSuccess: (...params: any) => void;
  onError: (err: string) => void;
};

export type TimeTz = {
  hour: number;
  minute: number;
  timezone: string;
};
