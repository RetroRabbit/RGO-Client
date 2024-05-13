import { Dialog } from "./confirm-modal.interface";

export class DialogTypeData {
    constructor() {
        this.dialogTypeData = { 
            type: '', 
            title: '', 
            subtitle: '', 
            confirmButtonText: '', 
            denyButtonText: '' 
        };
    }
    dialogTypeData!: Dialog;
}