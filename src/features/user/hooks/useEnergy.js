import { useUserValue } from "./useUserValue";

export function useEnergy() {
    return useUserValue('energy')
}