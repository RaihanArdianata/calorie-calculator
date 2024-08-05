import * as _ from "lodash";

export const toQueryString = (obj: any) => {
  return _.map(obj, (value, key) => `${key}=${encodeURIComponent(value)}`).join('&');
};
