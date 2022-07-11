import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { submit } from '../../state/workloads/actions';


interface WorkloadFormDispatchProps {
  submitWorkload: (complexity: number) => void  
}

interface WorkloadFormProps extends 
  WorkloadFormDispatchProps {}

interface WorkloadFormState {
  complexity: number;
}

class WorkloadForm extends React.PureComponent<WorkloadFormProps, WorkloadFormState> {
  defaultState = {
    complexity: 5,
  }

  state = this.defaultState;

  handleSubmit = (e: React.MouseEvent) => {
    this.props.submitWorkload(this.state.complexity);
    this.setState(this.defaultState);
    e.preventDefault();
  }

  render() {
    return (
      <form className='flex flex-col items-center m-4 shadow-sm sm:w-8/12 w-10/12 mx-auto p-4 rounded bg-white'>
        <h2 className='text-lg text-gray-800 font-semibold'>Create workload</h2>
        
        <div className='my-4'>
          <label>
            Complexity: {this.state.complexity}
            <br />
            <input 
              value={this.state.complexity} 
              onChange={(e) => this.setState({ complexity: Number(e.target.value) })} 
              type="range" 
              min="1" 
              max="10"
              className='input-range' 
            />
          </label>
        </div>

        <div>
          <button className='bg-indigo-500 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold py-2 px-4' onClick={this.handleSubmit} type="submit">Start work</button>
        </div>
      </form>
    );
  }
}


const mapDispatchToProps = (dispatch: Dispatch): WorkloadFormDispatchProps => ({
  submitWorkload: (complexity: number) => dispatch(submit({ complexity })),
});

const WorkloadFormContainer = connect(null, mapDispatchToProps)(WorkloadForm);


export {
  WorkloadForm,
  WorkloadFormContainer,
}

export default WorkloadForm;