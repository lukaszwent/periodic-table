export interface PeriodicElement {
    position: number
    name: string
    weight: number
    symbol: string
}

export interface PeriodicEditDialogData {
    allPeriodics: PeriodicElement[]
    selectedPeriodic: PeriodicElement
}
