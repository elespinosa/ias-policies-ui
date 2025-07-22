import { useUserDataStore } from '@/store/userStore';

export const hasPermission = (permission: string): boolean => {
  // @ts-ignore
  const userPermissions = useUserDataStore.getState().userAuthData?.permissions || [];
  return userPermissions.includes(permission);
};
