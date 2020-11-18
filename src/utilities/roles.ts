import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();

export const roles = (() => {
    ac.grant('user')
    .readOwn('profile')
    .readAny('product')
    .createAny('refresh')
    .readAny('review')
    .updateOwn('review');
    ac.grant('admin')
    .extend('user')
    .createAny('product')
    .updateAny('product')
    .deleteAny('product');
    return ac;
})();
