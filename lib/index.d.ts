export function useParams<T>(params: T): T;
export function setParam(
  name: string,
  value: string | number | boolean
): void;
export function removeParam(name: string): void;
/**
 * Param Mask
 */
type Pmask = {
  /** Parses the value string to Number */
  num: number;
  /** Parses the value to always be an string */
  str: string;
  /** Parses the value to be boolean, ie: true || true=="true"*/
  bool: boolean;
};

export const pmask: Pmask;
