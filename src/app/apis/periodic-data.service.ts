import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { PeriodicElement } from '../types/periodic/periodic'

@Injectable({ providedIn: 'root' })
export class PeriodicDataService {
    ELEMENT_DATA: PeriodicElement[] = [
        { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
        { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
        { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
        { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
        { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
        { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
        { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    ]

    getPeriodicTableData(): Observable<PeriodicElement[]> {
        return new Observable<PeriodicElement[]>((subscriber) => {
            setTimeout(() => {
                subscriber.next(this.ELEMENT_DATA)
            }, 3000)
        })
    }

    putSinglePeriodic(editedPosition: number, editedElement: PeriodicElement): Observable<PeriodicElement> {
        return new Observable<PeriodicElement>((subscriber) => {
            setTimeout(() => {
                this.ELEMENT_DATA = [
                    ...this.ELEMENT_DATA.filter((el) => el.position !== editedPosition),
                    editedElement,
                ].sort((a, b) => a.position - b.position)
                subscriber.next(editedElement)
            }, 1000)
        })
    }
}
