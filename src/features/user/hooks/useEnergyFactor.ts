import { useUserValue } from "./useUserValue";

export function useEnergyFactor(): number {
    return useUserValue<number>('energyFactor')
}