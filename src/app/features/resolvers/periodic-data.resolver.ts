import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router'
import { PeriodicElement } from '../../types/periodic/periodic'
import { inject } from '@angular/core'
import { PeriodicDataService } from '../../apis/periodic-data.service'
import { EMPTY, map, of, Observable } from 'rxjs'
import { LoadingService } from '../../shared/services/loading.service'

export const PeriodicDataResolver: ResolveFn<Observable<PeriodicElement[]>> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router)
    const loadingService = inject(LoadingService)

    loadingService.loadingOn()
    return inject(PeriodicDataService)
        .getPeriodicTableData()
        .pipe(
            map((data) => {
                if (data) {
                    loadingService.loadingOff()
                    return of(data)
                }

                router.navigate(['error-page'])
                return EMPTY
            })
        )
}
