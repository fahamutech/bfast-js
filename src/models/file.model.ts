import {Readable} from "stream";

export interface FileModel {
    pn: boolean,
    filename: string,
    data: File | Readable
}
