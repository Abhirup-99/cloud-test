import { ActionsObservable, StateObservable } from 'redux-observable';
import { Subject } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import * as workloadsActions from './actions';
import { cancelWorkload, checkWorkloadStatus, createWorkload } from './epics';

const testScheduler = new TestScheduler((actual, expected) => {
  // somehow assert the two objects are equal
  // e.g. with chai `expect(actual).deep.equal(expected)`
});

jest.setTimeout(10000);

describe('Workload Epic', () => {
    it('creates a new workload with status working', (done) => {
        const expectedResponse = workloadsActions.created({id: 0, status: 'WORKING', complexity: 5, completeDate: new Date()})

        const action$ = ActionsObservable.of(workloadsActions.submit({ complexity: 5 }))

        createWorkload(action$, null, testScheduler).subscribe((actualResponse: any) => {
            const { id: actualId, status: actualStatus } = actualResponse.payload;
            const {id: expectedId, status: expectedStatus} = expectedResponse.payload;
            expect(actualResponse.type === expectedResponse.type).toBe(true);
            expect(actualId).toEqual(expectedId);
            expect(actualStatus).toEqual(expectedStatus);
            done();
        })
    })

    it('checks status for a workload before timout', async (done) => {
        const expectedResponse = workloadsActions.updateStatus({id: 0, status: 'WORKING'})

        const action$ = ActionsObservable.of(workloadsActions.created({ id: 0, status: 'WORKING', complexity: 5, completeDate: new Date() }))
        
        checkWorkloadStatus(action$, null, testScheduler).subscribe((actualResponse: any) => {
            const { id: actualId, status: actualStatus } = actualResponse.payload;
            const {id: expectedId, status: expectedStatus} = expectedResponse.payload;
            
            expect(actualResponse.type === expectedResponse.type).toBe(true);
            expect(actualId).toEqual(expectedId);
            expect(actualStatus).toEqual(expectedStatus);
            done();
        })
    })

    it('cancels an ongoing workload', async (done) => {
        const expectedResponse = workloadsActions.updateStatus({id: 0, status: 'CANCELED'})

        const action$ = ActionsObservable.of(workloadsActions.cancel({ id: 0 }))
        
        cancelWorkload(action$, null, testScheduler).subscribe((actualResponse: any) => {
            const { id: actualId, status: actualStatus } = actualResponse.payload;
            const {id: expectedId, status: expectedStatus} = expectedResponse.payload;
            
            expect(actualResponse.type === expectedResponse.type).toBe(true);
            expect(actualId).toEqual(expectedId);
            expect(actualStatus).toEqual(expectedStatus);
            done();
        })
    })

    it('checks status of an ongoing workload before timeout',  (done) => {

        const expectedResponse = workloadsActions.updateStatus({id: 1, status: 'WORKING'})

        const action$ = ActionsObservable.of(workloadsActions.created({ id: 1, status: 'WORKING', complexity: 5, completeDate: new Date() }))

        createWorkload(ActionsObservable.of(workloadsActions.submit({ complexity: 4 })), null, testScheduler).subscribe(() => { 
            checkWorkloadStatus(action$, null, testScheduler).subscribe((actualResponse: any) => {
                const { id: actualId, status: actualStatus } = actualResponse.payload;
                const {id: expectedId, status: expectedStatus} = expectedResponse.payload;
                
                expect(actualResponse.type === expectedResponse.type).toBe(true);
                expect(actualId).toEqual(expectedId);
                expect(actualStatus).toEqual(expectedStatus);
                done();
            })  
        })
    })

    it('checks status of an ongoing workload after timeout',  async (done) => {

        const expectedResponse = workloadsActions.updateStatus({id: 1, status: 'FAILURE'})

        const action$ = ActionsObservable.of(workloadsActions.created({ id: 1, status: 'WORKING', complexity: 5, completeDate: new Date() }))
        await new Promise(resolve => setTimeout(resolve, 5000));    
        checkWorkloadStatus(action$, null, testScheduler).subscribe((actualResponse: any) => {
            const { id: actualId, status: actualStatus } = actualResponse.payload;
            const {id: expectedId, status: expectedStatus} = expectedResponse.payload;
            
            expect(actualResponse.type === expectedResponse.type).toBe(true);
            expect(actualId).toEqual(expectedId);
            expect(actualStatus).toEqual(expectedStatus);
            done();
        })  
    })
})
