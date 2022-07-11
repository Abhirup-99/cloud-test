import React, { PureComponent } from 'react';

import { WorkloadListContainer } from '../WorkloadList';
import { WorkloadFormContainer } from '../WorkloadForm';
import './App.css';


class App extends PureComponent {
  render() {
    return (
      <div className='bg-zinc-50 h-screen'>
        <header className='bg-indigo-600 px-4 py-4'>
          <h1 className='text-xl text-white font-bold'>CloudWork</h1>
        </header>
        
        <div >
          <WorkloadFormContainer />
        </div>

        <div className='sm:w-8/12 w-10/12 mx-auto my-4 mt-8'>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-zinc-50 text-lg font-medium text-gray-900">Workloads</span>
            </div>
          </div>
          <WorkloadListContainer />
        </div>
      </div>
    );
  }
}

export default App;
