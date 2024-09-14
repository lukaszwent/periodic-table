import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core'
import { LayoutComponent } from './core/components/layout/layout.component'
import { RouterModule } from '@angular/router'
import { LoadingService } from './shared/services/loading.service'
import { MatProgressSpinner } from '@angular/material/progress-spinner'
import { CommonModule } from '@angular/common'
import { NavigationItem } from './types/navigation/navigation'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [LayoutComponent, RouterModule, MatProgressSpinner, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    readonly loadingService = inject(LoadingService)

    showSpinner: WritableSignal<boolean> = signal(false)

    navigationItems: NavigationItem[] = [
        {
            name: 'Home',
            url: '/periodic-table',
        },
    ]

    ngOnInit(): void {
        this.loadingService.loading$.subscribe((isLoading) => {
            this.showSpinner.set(isLoading)
        })
    }
}
