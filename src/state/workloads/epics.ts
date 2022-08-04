import moment from 'moment';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { from, of, pipe, timer } from 'rxjs';
import { filter, map, tap, ignoreElements, switchMap, delay, delayWhen, mergeMap, concatMap, takeUntil, takeWhile, catchError } from 'rxjs/operators';
import { action, isActionOf } from 'typesafe-actions';

import { RootAction, RootState } from '../reducer';
import * as workloadsActions from './actions';
import { WorkloadService } from './services';


type AppEpic = Epic<RootAction, RootAction, RootState>;
const workloadService = new WorkloadService();

const logWorkloadSubmissions: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    map(action => action.payload),
    tap((payload) => console.log('Workload submitted', payload)),
    ignoreElements(),
  )
);

export const createWorkload: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    mergeMap((action) => from(workloadService.create(action.payload))),
    map(response => workloadsActions.created(response)),
  )
);

export const cancelWorkload: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.cancel)),
    map(action => action.payload),
    mergeMap((payload) => from(workloadService.cancel(payload))),
    map(response => workloadsActions.updateStatus(response)),
    catchError(error => of(console.log(error)).pipe(ignoreElements())),
  )
);

/**
 * the trick was to add an additional delay in the second timer
 * which would ensure that the 2nd timer would always finish at
 * the end. We can make optimisations on how much you can reduce
 * the delay, but due to the nature of JS being a single thread
 * and the presence of 2 different queues for setTimeouts and
 * promises, you can never Deterministically say which one would
 * get executed. A great article read on rxjs schedulers on which
 * the delay function was based on:
 * https://blog.strongbrew.io/what-are-schedulers-in-rxjs/
 * delay internals:
 * https://github.com/ReactiveX/rxjs/blob/c45e07cef887fded09473ce64ea59f54a77e8efc/src/internal/operators/delay.ts
 */
export const checkWorkloadStatus: AppEpic = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(workloadsActions.created)),
    mergeMap((action) =>
      from(workloadService.checkStatus(action.payload)).pipe(
        map((response) => ({ ...response })),
        delay(action.payload.completeDate),
        delay(10),
        mergeMap((response) =>
          from(workloadService.checkStatus({ id: response.id })).pipe(
            map((response) =>
              workloadsActions.updateStatus({
                id: response.id,
                status: response.status,
              })
            )
        )
      ),
      takeUntil(action$.pipe(filter(isActionOf(workloadsActions.cancel))))
    )
  )
);

export const epics = combineEpics(
  logWorkloadSubmissions,
  createWorkload,
  cancelWorkload,
  checkWorkloadStatus
);

export default epics;
