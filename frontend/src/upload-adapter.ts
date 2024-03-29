import { PageDataService } from "./app/services/page.data.service";

export class UploadAdapter {
    constructor(private loader: any, private pds: PageDataService) { }
    upload() {
        return this.loader.file.then((file: any) => new Promise((resolve, reject) => {
            this.pds.uploadFile(file).subscribe(url => {
                if (url === '') {
                    reject();
                }
                resolve({
                    default: url,
                });
            })
        }));
    }
    abort() {
        console.error('aborted');
    }
}