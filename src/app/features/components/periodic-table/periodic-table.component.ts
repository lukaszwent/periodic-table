import { LoadingService } from './../../../shared/services/loading.service'
import { PeriodicDataService } from './../../../apis/periodic-data.service'
import { Component, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PeriodicElement } from '../../../types/periodic/periodic'
import { MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common'
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatDialog } from '@angular/material/dialog'
import { PeriodicEditDialogComponent } from '../periodic-edit-dialog/periodic-edit-dialog.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { BehaviorSubject, debounceTime, exhaustMap, tap } from 'rxjs'
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { NoRecordsFoundComponent } from '../../../shared/components/no-records-found/no-records-found.component'
import { rxState } from '@rx-angular/state'
import { rxActions } from '@rx-angular/state/actions'

@Component({
    selector: 'pt-periodic-table',
    standalone: true,
    imports: [
        MatTableModule,
        CommonModule,
        MatCard,
        MatCardContent,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        NoRecordsFoundComponent,
    ],
    templateUrl: './periodic-table.component.html',
    styleUrl: './periodic-table.component.css',
})
export class PeriodicTableComponent {
    readonly dialog = inject(MatDialog)
    readonly route = inject(ActivatedRoute)
    readonly periodicDataService = inject(PeriodicDataService)
    readonly loadingService = inject(LoadingService)

    displayedColumns = ['position', 'name', 'weight', 'symbol']

    query: BehaviorSubject<string> = new BehaviorSubject('')

    private actions = rxActions<{ refresh: void }>()

    private state = rxState<{
        periodicData: PeriodicElement[]
        query: string
    }>(({ set, connect }) => {
        set({ periodicData: [], query: '' })

        connect('periodicData', this.route.snapshot.data['periodicData'])
        connect('query', this.query.pipe(debounceTime(2000)))
    })

    private refreshEffect = this.actions.onRefresh(
        (refresh$) =>
            refresh$.pipe(
                exhaustMap(() => {
                    this.loadingService.loadingOn()
                    return this.periodicDataService.getPeriodicTableData().pipe(
                        tap(() => {
                            this.loadingService.loadingOff()
                        })
                    )
                })
            ),

        (periodicData) => this.state.set('periodicData', (state) => periodicData)
    )

    filteredPeriodicData$ = this.state.select(['periodicData', 'query'], ({ periodicData, query }) => {
        return periodicData.filter(
            (val) =>
                val.position.toString().toLowerCase().indexOf(query.trim().toLowerCase()) !== -1 ||
                val.name.toLowerCase().indexOf(query.trim().toLowerCase()) !== -1 ||
                val.symbol.toLowerCase().indexOf(query.trim().toLowerCase()) !== -1 ||
                val.weight.toString().toLowerCase().indexOf(query.trim().toLowerCase()) !== -1
        )
    })

    editPeriodic(periodic: PeriodicElement): void {
        const dialogRef = this.dialog.open(PeriodicEditDialogComponent, {
            data: {
                allPeriodics: this.state.get('periodicData'),
                selectedPeriodic: periodic,
            },
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.actions.refresh()
            }
        })
    }
}
