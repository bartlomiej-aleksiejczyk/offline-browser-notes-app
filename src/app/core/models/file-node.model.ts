import { FileType } from "./file-type.model";

export interface FileNode {
  id: string;
  parentId: string | null;
  name: string;
  isFolder: boolean;
  fileType: FileType;
  children: FileNode[]
}
