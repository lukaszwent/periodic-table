import { Component, inject, model, ModelSignal, signal, WritableSignal } from '@angular/core'
import { PeriodicEditDialogData, PeriodicElement } from '../../../types/periodic/periodic'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { PeriodicDataService } from '../../../apis/periodic-data.service'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { finalize, tap } from 'rxjs'

@Component({
    selector: 'pt-edit-dialog',
    standalone: true,
    imports: [MatDialogModule, MatFormFieldModule, FormsModule, CommonModule, MatInputModule, MatButtonModule],
    templateUrl: './periodic-edit-dialog.component.html',
    styleUrl: './periodic-edit-dialog.component.css',
})
export class PeriodicEditDialogComponent {
    readonly data = inject<PeriodicEditDialogData>(MAT_DIALOG_DATA)
    readonly dialogRef = inject(MatDialogRef<PeriodicEditDialogComponent>)
    readonly periodicDataService = inject(PeriodicDataService)

    isLoading: WritableSignal<boolean> = signal(false)

    selectedPeriodic: ModelSignal<PeriodicElement> = model({ ...this.data.selectedPeriodic })

    close(): void {
        this.dialogRef.close()
    }

    update(): void {
        this.isLoading.set(true)
        this.periodicDataService
            .putSinglePeriodic(this.data.selectedPeriodic.position, this.selectedPeriodic())
            .pipe(
                tap(() => {
                    this.dialogRef.close(true)
                }),
                finalize(() => {
                    this.isLoading.set(false)
                })
            )
            .subscribe()
    }
}
