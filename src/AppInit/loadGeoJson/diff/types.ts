
export type DiffFile = {
  logicalId: string;
  relativePath: string;
  size?: number;
  version?: string;
};

export type OperateFile = {
  logicalId: string;
  relativePath: string;
};

export type DiffResult = {
  add: OperateFile[] | undefined;
  remove: OperateFile[] | undefined;
  update: OperateFile[] | undefined;
};
