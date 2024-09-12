import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { PeriodicElement } from '../../../types/periodic/periodic'
import { MatTableModule } from '@angular/material/table'
import { CommonModule } from '@angular/common'
import { MatCard, MatCardContent } from '@angular/material/card'
import { MatDialog } from '@angular/material/dialog'

@Component({
    selector: 'pt-empty-value',
    standalone: true,
    imports: [MatTableModule, CommonModule, MatCard, MatCardContent],
    templateUrl: './periodic-table.component.html',
    styleUrl: './periodic-table.component.css',
})
export class PeriodicTableComponent implements OnInit {
    readonly dialog = inject(MatDialog)

    readonly route = inject(ActivatedRoute)

    periodicData: WritableSignal<PeriodicElement[]> = signal([])

    displayedColumns = ['position', 'name', 'weight', 'symbol']

    ngOnInit(): void {
        this.route.snapshot.data['periodicData'].subscribe((data: PeriodicElement[]) => {
            this.periodicData.set(data)
        })
    }
}
