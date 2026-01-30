import { atomicWrite } from "./AtomicFileSystem";
import { expoExists, expoMove, expoRead, expoRemove } from "./expofilesystem";

export const FileSystenPortal = {
  read: expoRead,
  write: atomicWrite,
  move: expoMove,
  remove: expoRemove,
  exists: expoExists,
};
