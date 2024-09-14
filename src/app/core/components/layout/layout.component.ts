import { Component, Input } from '@angular/core'

@Component({
    selector: 'pt-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css',
})
export class LayoutComponent {
    @Input()
    headerTitle = 'My website'
}
