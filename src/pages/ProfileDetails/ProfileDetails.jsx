import React, { Component } from 'react';
import UserCard from '../../components/UserCard/UserCard'
import { friend, getUserProfile } from "../../services/userService"
import * as profileService from "../../services/profileService"


class ProfileDetails extends Component {

    state = {
        profile: {},
        formData:{
            //profile: '',
            activityId: '',
            date: '',
            time: ''
        }
    }

  handleSubmit = e=>{
    e.preventDefault()
    this.handleUpdate()
  }

  handleChange= e=> {
    const formData = {...this.state.formData, [e.target.name]: e.target.value}
      this.setState({
        formData: formData,
    })
    console.log('formData', formData)
  }
    
  async componentDidMount() {
    //console.log("this.props.match", this.props.match)
    const profile = await profileService.getDetails(this.props.match.params.id)
    console.log('this.props.match', this.props.match)
    console.log('profile', profile)
    this.setState({profile})
  }
  render () {
        // console.log("Profile", this.state.profile)
        // console.log("My Friends", this.state.profile?.friends)
        // console.log('Acitivity', this.state.formData)
    return (
          <>
      <h1>{this.state.profile?.name}'s Profile</h1>
      <h1>Friends List:</h1>
      {this.state.profile?.friends?.map(friend =>{
        return(<h1>{friend.name}</h1>)
      })}
      <h1>{this.state.profile?.name}'s Solo Activities: </h1>
      {this.state.profile?.activities?.map(activity=>{
        return(
        <>
        <p>{activity.name} </p>
        <button 
        type="submit"
        onClick={()=>this.props.handleRemoveActivity(activity._id)}>
          DELETE
        </button>
        
        </>
        )
      })}
            <h1>{this.state.profile?.name}'s Group Activities: </h1>
            {this.state.groups?.activities?.map(activity=>{
        return(
        <>
        <p>{activity.name} </p>
          
        
        </>
        )
      })}


      <h1>{this.state.profile.name}'s Groups: </h1>
              {this.state.profile.groups?.map(group=>{ 
                return(
                  <>
                  <p>{group.name}</p>
                  <button
                  type="submit"
                  onClick={() =>this.props.handleLeaveGroup(group._id)}>Leave {group.name}
                  

                  </button>
                  </>
                )
              })}
        </>
      )
    
}
}

export default ProfileDetails;
