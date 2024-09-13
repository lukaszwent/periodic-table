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

@Component({
    selector: 'pt-periodic-table',
    standalone: true,
    imports: [MatTableModule, CommonModule, MatCard, MatCardContent],
    templateUrl: './periodic-table.component.html',
    styleUrl: './periodic-table.component.css',
})
export class PeriodicTableComponent implements OnInit {
    readonly dialog = inject(MatDialog)
    readonly route = inject(ActivatedRoute)
    readonly periodicDataService = inject(PeriodicDataService)
    readonly loadingService = inject(LoadingService)

    periodicData: WritableSignal<PeriodicElement[]> = signal([])

    displayedColumns = ['position', 'name', 'weight', 'symbol']

    ngOnInit(): void {
        this.route.snapshot.data['periodicData'].subscribe((data: PeriodicElement[]) => {
            this.periodicData.set(data)
        })
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
