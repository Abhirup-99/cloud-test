import React from 'react';
import TimeAgo from 'react-timeago';
import { Status } from '../../state/workloads'

export interface WorkloadItemStateProps {
  id: number;
  complexity: number;
  status: Status;
  completeDate: Date;
}

export interface WorkloadItemMethodProps {
  onCancel: () => void;
}

export interface WorkloadItemProps extends 
  WorkloadItemStateProps,
  WorkloadItemMethodProps {}


const WorkloadItem: React.SFC<WorkloadItemProps> = (props) => (
  <div className="bg-white shadow sm:rounded-md px-4 py-4 sm:px-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-md font-semibold text-indigo-600 truncate">Workload #{props.id}</p>
        <p className="flex items-center text-sm text-gray-500">
          Complexity: {props.complexity}
        </p>
      </div>
      <div className="ml-2 flex-shrink-0 flex">
      {props.status === 'WORKING'
        ? (
          <div className='flex flex-col items-end'>
            <span className='text-sm text-gray-600'><TimeAgo date={props.completeDate} /></span>
            <button 
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={props.onCancel}
            >
              Cancel
            </button>
          </div>
        )
        :
        <>
          {props.status === 'SUCCESS'
            ? <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {props.status}
              </p>
            : null
          }
          {props.status === 'FAILURE'
            ? <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                {props.status}
              </p>
            : null
          }
          {props.status === 'CANCELED'
            ? <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                {props.status}
              </p>
            : null
          }
        </> 
      }
        
      </div>
    </div>
  </div>
);


export { 
  WorkloadItem,
};

export default WorkloadItem;