import { getConfig } from "../../src/utils/config";
import {I18nMorphConfig} from "./i18n-morph-default.config";

export function getConfig(): I18nMorphConfig;
export function findAppRoot(): string;
export function generateDefaultConfig(): void;
export function validateConfig(): void;