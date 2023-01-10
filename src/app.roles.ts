import { AccessControl } from 'accesscontrol';

export enum AppRoles {
  USER = 'user',
  TESTER = 'tester',
  ADMIN = 'admin',
}

const acl = new AccessControl({
  [AppRoles.USER]: {
    news: {
      'create:own': ['*', '!views'],
      'read:own': ['*', '!views'],
      'update:own': ['*', '!views'],
      'delete:own': ['*'],
    },
  },
  [AppRoles.ADMIN]: {
    // extends: [AppRoles.USER],
    user: {
      'create:any': ['*'],
      'read:any': ['*'],
      'update:any': ['*'],
      'delete:any': ['*'],
    },
  },
});

acl.grant(AppRoles.ADMIN).extend(AppRoles.USER);

acl.lock(); // Больше никаких правок

export { acl };
