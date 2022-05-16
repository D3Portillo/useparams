/// <reference types="vite/client" />

import * as devDefs from "../lib/index.d";
import * as PACK from "useparams";
import * as DEV from "dev_useparams";

console.log({ MODE: import.meta.env.MODE });
/**
 * MODE==PACK
 * Basically it builds and npm links the package then
 * starts vite server to test the actual package bundle.
 */
const useparams = import.meta.env.MODE == "PACK" ? PACK : DEV;
export const setParam = useparams.setParam as typeof devDefs.setParam;
export const removeParam = useparams.removeParam as typeof devDefs.removeParam;
export const useParams = useparams.useParams as typeof devDefs.useParams;
export const pmask = useparams.pmask as typeof devDefs.pmask;
