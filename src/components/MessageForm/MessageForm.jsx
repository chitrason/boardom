import React, { Component } from 'react';


class MessagePost extends Component {
  state = { 
    invalidForm: true,
    formData: {
      body: '',
    }
   }

   formRef = React.createRef();

   handleChange = e => {
    const formData = {...this.state.formData, [e.target.name]: e.target.value};
    this.setState({
    formData,
    invalidForm: !this.formRef.current.checkValidity()
      });
    };

    handleSubmit = e => {
      //e.preventDefault();
      this.props.handleAddMessage(this.state.formData) //create and pass handleAddMessage from App
    };


  render() { 
    const { body } = this.state.formData
    return ( 
      <>
      <form
        ref={this.formRef}
        onSubmit={this.handleSubmit}
      >
        <h3>Message:</h3>
        <input 
        autoComplete="off"
          type="text"
          name="body"
          value={this.state.formData.body}
          onChange={this.handleChange}
          placeholder="enter message post"
          required
        />
         <button
          type="submit"
    			disabled={this.state.invalidForm}
        >
				  create
        </button>
      </form>
      </>
     );
  }
}
 
export default MessagePost;