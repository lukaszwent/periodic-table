import { LoadingService } from './../../../shared/services/loading.service'
import { PeriodicDataService } from './../../../apis/periodic-data.service'
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PeriodicElement } from '../../../types/periodic/periodic'
import { MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common'
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatDialog } from '@angular/material/dialog'
import { PeriodicEditDialogComponent } from '../periodic-edit-dialog/periodic-edit-dialog.component'
import { MatFormFieldModule } from '@angular/material/form-field'
import { debounceTime, Subject } from 'rxjs'
import { MatInputModule } from '@angular/material/input'
import { FormsModule } from '@angular/forms'
import { NoRecordsFoundComponent } from '../../../shared/components/no-records-found/no-records-found.component'

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
export class PeriodicTableComponent implements OnInit {
    readonly dialog = inject(MatDialog)
    readonly route = inject(ActivatedRoute)
    readonly periodicDataService = inject(PeriodicDataService)
    readonly loadingService = inject(LoadingService)

    periodicData: WritableSignal<PeriodicElement[]> = signal([])

    filteredPeriodicData: WritableSignal<PeriodicElement[]> = signal([])

    displayedColumns = ['position', 'name', 'weight', 'symbol']

    query: string = ''

    queryChange: Subject<string> = new Subject<string>()

    ngOnInit(): void {
        this.route.snapshot.data['periodicData'].subscribe((data: PeriodicElement[]) => {
            this.periodicData.set(data)
            this.filteredPeriodicData.set(data)
        })

        this.queryChange.pipe(debounceTime(2000)).subscribe((search) => {
            this.filteredPeriodicData.set(
                this.periodicData().filter(
                    (val) =>
                        val.position.toString().toLowerCase().indexOf(search.trim().toLowerCase()) !== -1 ||
                        val.name.toLowerCase().indexOf(search.trim().toLowerCase()) !== -1 ||
                        val.symbol.toLowerCase().indexOf(search.trim().toLowerCase()) !== -1 ||
                        val.weight.toString().toLowerCase().indexOf(search.trim().toLowerCase()) !== -1
                )
            )
        })
    }

    onQueryChange(value: string): void {
        this.queryChange.next(value)
        this.query = value
    }

    editPeriodic(periodic: PeriodicElement): void {
        const dialogRef = this.dialog.open(PeriodicEditDialogComponent, {
            data: {
                allPeriodics: this.periodicData(),
                selectedPeriodic: periodic,
            },
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.loadingService.loadingOn()
                this.periodicDataService.getPeriodicTableData().subscribe((data) => {
                    this.periodicData.set(data)
                    this.loadingService.loadingOff()
                })
            }
        })
    }
}
