import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootAction, RootState } from '../../state';
import { cancel } from '../../state/workloads/actions';
import { WorkloadItem, WorkloadItemStateProps } from '../WorkloadItem';

export interface WorkloadListStateProps {
  workloads: WorkloadItemStateProps[];
}

export interface WorkloadListDispatchProps {
  cancelWorkload: (id: number) => void;
}

export interface WorkloadListProps extends 
  WorkloadListStateProps,
  WorkloadListDispatchProps {}


const WorkloadList: React.SFC<WorkloadListProps> = ({ workloads, cancelWorkload }) => (
  !workloads.length 
    ? (
      <div
        className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
          />
        </svg>
        <span className="mt-2 block text-sm font-medium text-gray-900">No workloads to display</span>
    </div>
    )
  : (
    <ol className='space-y-3'>
      {workloads.map((workload) => (
        <li key={workload.id}>
          <WorkloadItem {...workload} onCancel={() => cancelWorkload(workload.id)} />
        </li>
      ))}
    </ol>
  )
);


const mapStateToProps = (state: RootState): WorkloadListStateProps => ({
  workloads: Object.values(state.workloads).sort((a, b) => b.id > a.id ? 1: -1),
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): WorkloadListDispatchProps => ({
  cancelWorkload: (id: number) => dispatch(cancel({ id })),
}) 

const WorkloadListContainer = connect(mapStateToProps, mapDispatchToProps)(WorkloadList);


export {
  WorkloadList,
  WorkloadListContainer,
};

export default WorkloadList;
