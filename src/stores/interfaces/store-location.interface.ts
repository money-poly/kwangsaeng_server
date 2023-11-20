import { Store } from '../entity/store.entity';

export interface StoreLocation {
    name: Pick<Store, 'name'>;
    id: Pick<Store, 'id'>;
    latitude: Pick<Store, 'latitude'>;
    longitude: Pick<Store, 'longitude'>;
}
