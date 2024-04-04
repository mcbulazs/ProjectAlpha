export interface Saveable {
    changed: boolean;
    save(): void;
    reset(): void;
}
