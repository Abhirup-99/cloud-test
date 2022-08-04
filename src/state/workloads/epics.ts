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

export const checkWorkloadStatus: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.created)),
    mergeMap(action => from(workloadService.checkStatus(action.payload)).pipe(
      delay(action.payload.completeDate),
      delay(1000),
      tap(response => console.log('workload status check', response)),
      map(response => workloadsActions.updateStatus(response)),
      takeUntil(action$.pipe(
        filter(isActionOf(workloadsActions.cancel)),
      ))
    )),
  )
);

export const epics = combineEpics(
  logWorkloadSubmissions,
  createWorkload,
  cancelWorkload,
  checkWorkloadStatus
);

export default epics;
