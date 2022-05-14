import { useEffect, useState } from "react";

type Params<T> = { [name: string]: any } & T;
type Param<T> = keyof Params<T>;

const getDomParams = (): Params<{}> => {
  return [...new URLSearchParams(location.search) as any].reduce(
    (acc, [name, value]) => {
      return {
        ...acc,
        [name]: value,
      };
    },
    {}
  );
};

const __safeParamsUpdate = (params: URLSearchParams) => {
  const strParams = params.toString();
  const url = new URL(`?${strParams}`, window.location as any).toString();
  if (window.history) {
    window.history.replaceState({}, "", url);
  } else {
    location.search = strParams;
  }
};

export const removeParam = (name: string) => {
  const curParams = new URLSearchParams(location.search);
  curParams.set(name, ""); // If many remove all and keep 1
  curParams.delete(name);
  __safeParamsUpdate(curParams);
};

export const setParam = (name: string, value: any) => {
  const curParams = new URLSearchParams(location.search);
  curParams.set(name, value);
  __safeParamsUpdate(curParams);
  return curParams;
};

export const useParams = <T>(defaultParamVals: Params<T>): Params<T> => {
  const [stateUpdates, setStateUpdates] = useState(0);
  const [params, setParams] = useState({});

  useEffect(() => {
    const domParams = getDomParams();
    const keys = [...Object.keys(domParams), ...Object.keys(defaultParamVals)];
    const getParamValue = (name: string) => {
      const defaultValue = defaultParamVals[name as Param<T>];
      if (domParams[name]) return domParams[name];
      if (defaultValue) {
        return setParam(name, defaultValue).get(name);
      }
      return null;
    };
    setParams(
      keys.reduce((obj, name) => ({ ...obj, [name]: getParamValue(name) }), {})
    );
  }, [location.search, stateUpdates]);

  useEffect(() => {
    window.history.replaceState = new Proxy(window.history.replaceState, {
      apply: (fn, __this, props) => {
        setStateUpdates((n) => n + 1);
        return fn.apply(__this, props as any);
      },
    });
  }, []);

  return params as Params<T>;
};
