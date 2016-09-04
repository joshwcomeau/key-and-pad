import { getQueryParams } from './misc-helpers';

export default function isAdminMode() {
  const { adminMode } = getQueryParams();
  return !!adminMode;
}
