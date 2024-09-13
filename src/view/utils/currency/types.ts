import currencies from "./currency.json";

export type Currency = (typeof currencies)[number];
