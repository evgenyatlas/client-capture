
import { useUserValue } from "./useUserValue";

export function useColor(): string {
    return useUserValue<string>('color')
}