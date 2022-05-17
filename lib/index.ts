import { useEffect, useState } from "react";

type Params<T> = { [name: string]: any } & T;
const USEPARAMS = "USEPARAMS";
const POPSTATE = "popstate";
const str = "?s";
const num = "?n";
const bool = "?b";
/** string::'true' */
const True = "true";
export const pmask = {
  str,
  num,
  bool,
};
const noOp = () => null;
const hist = () =>
  (typeof window != "undefined" ? window.history : {}) as typeof history;
const getUrlParams = () => new URLSearchParams(location.search);
/** Object.keys(of) */
const kof = (obj: any) => Object.keys(obj);
const getHistParams = (): Params<{}> => {
  const state = hist().state;
  // We first check if satate was user->next prev pushed
  if (state && state[USEPARAMS]) return state[USEPARAMS];
  if (window[USEPARAMS]) return window[USEPARAMS];
  return [...(getUrlParams() as any)].reduce(
    (acc, [name, value]) => ({
      ...acc,
      [name]: value,
    }),
    {}
  );
};

const getParamsHref = (params: URLSearchParams) =>
  new URL(`?${params.toString()}`, location as any).toString();

const safelyPushState = (
  param: string,
  urlParams: URLSearchParams,
  histState: Params<{}>
) => {
  if (param) {
    dispatchEvent(
      new CustomEvent(POPSTATE, {
        detail: {
          param,
        },
      })
    );
    window[USEPARAMS] = histState;
    hist().pushState({ [USEPARAMS]: histState }, "", getParamsHref(urlParams));
  }
};

export const removeParam = (name: string) => {
  const histParams = getHistParams();
  const urlParams = getUrlParams();
  urlParams.delete(name);
  delete histParams[name];
  safelyPushState(name, urlParams, histParams);
};

export const setParam = (name: string, value: any) => {
  const urlParams = getUrlParams();
  urlParams.set(name, value + "");
  safelyPushState(name, urlParams, { ...getHistParams(), [name]: value });
};

export const useParams = <T>(defaultParams: Params<T>): Params<T> => {
  const [triggerEffect, setTriggerEffect] = useState(0);
  const [params, setParams] = useState({});

  useEffect(() => {
    const histParams = getHistParams();
    const urlParams = getUrlParams();
    const maskOverrides = {};
    let triggerPush = ""; // falsy param name;
    const getParamValue = (name: string) => {
      const defaultValue = defaultParams[name];
      const histParamValue = histParams[name];
      const urlParamValue = urlParams.get(name);
      const inDefaultVals = name in defaultParams;
      const value =
        histParamValue === undefined ? defaultValue : histParamValue;
      // If ?urlParam="undefined" developer expects undefined as value
      if (urlParamValue === "undefined") return undefined;
      if ([str, num, bool].includes(defaultValue)) {
        // Since value is a mask, it's value is stored from history.state
        maskOverrides[name] = histParamValue;
        if (defaultValue == num) return (urlParamValue as any) * 1;
        return defaultValue == bool ? urlParamValue == True : urlParamValue;
      }
      if (inDefaultVals && urlParamValue === null) {
        triggerPush = True;
        urlParams.set(name, value);
      }
      return value;
    };
    const hookParams = [...kof(histParams), ...kof(defaultParams)].reduce(
      (obj, name) => ({ ...obj, [name]: getParamValue(name) }),
      {}
    );
    setParams(hookParams);
    const params = { ...hookParams, ...maskOverrides };
    safelyPushState(triggerPush, urlParams, params);
  }, [triggerEffect]);

  useEffect(() => {
    const Next = "next" in window && window["next"];
    const mockRouter = {
      events: {
        on: noOp as (e: string, fn: any) => void,
        off: noOp as (e: string, fn: any) => void,
      },
    };
    const NextRouter: typeof mockRouter = Next.router || mockRouter;
    function proxyFn({ detail }: CustomEvent) {
      const param = detail && detail.param;
      if (!param || param in defaultParams || param === True) {
        setTriggerEffect((n) => n + 1);
      }
      /**
       * Re-render component if param is actually invoked by the hook
       * NOTE: param == false when it's an origial POPSTATE.
       * NOTE: param === "true" when POPSTATE is called urlParam update.
       */
    }
    addEventListener(POPSTATE, proxyFn);
    NextRouter.events.on("routeChangeComplete", proxyFn);
    return () => {
      removeEventListener(POPSTATE, proxyFn);
      NextRouter.events.off("routeChangeComplete", proxyFn);
    };
  }, []);
  return params as Params<T>;
};
