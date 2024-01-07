import { MenuStatus } from '../enum/menu-status.enum';

export interface UpdateStatusArgs {
    prevStatus: MenuStatus;
    updateStatus: MenuStatus;
}
