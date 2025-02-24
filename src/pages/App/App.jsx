import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import About from '../About/About'
import AddActivity from '../AddActivity/AddActivity'
import GroupAddActivity from '../GroupAddActivity/GroupAddActivity'
//import Calendar from '../Calendar/Calendar'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import Group from '../Group/Group'
import Landing from '../Landing/Landing'
import Login from '../Login/Login'
import ProfileDetails from '../ProfileDetails/ProfileDetails'
import GroupDetails from '../GroupDetails/GroupDetails'
import ProfileList from '../ProfileList/ProfileList'
import GroupList from '../GroupList/GroupList'
import Signup from '../Signup/Signup'
import * as authService from '../../services/authService'
import * as userAPI from '../../services/userService'
import * as activityAPI from '../../services/activityService'
import * as groupAPI from '../../services/groupService'
import Users from '../Users/Users'
import './App.css'
import * as profileAPI from '../../services/profileService'
import MessagePost from '../MessagePost/MessagePost'
import * as messageAPI from '../../services/messagePostService'
import EditMessageForm from '../../components/EditMessageForm/EditMessageForm'
import EditActivityForm from '../../components/EditActivityForm/EditActivityForm'



class App extends Component {
	state = {
		user: authService.getUser(),
		userProfile: null,
		groups: [],
		messages: [],
		activities:{}
	}

	renderEventContent = () => {
		return (
		  <>
			<b>event</b>
			<i>{this.state.title}</i>
		  </>
		)
	  }

	handleLogout = () => {
		authService.logout()
		this.setState({ user: null })
		this.props.history.push('/')
	}

	handleSignupOrLogin = () => {
		this.setState({ user: authService.getUser() })
	}

	handleCreateGroup = async newGroupData => {
		const newGroup = await groupAPI.createGroup(newGroupData)
		console.log("handleCreateGroup new group", newGroup)
		this.setState ({ userProfile: newGroup }) // not sure what to set new group
	}

	handleAddFriend = async friendId => {
		const updatedProfile = await profileAPI.friend(friendId)
		console.log(updatedProfile)
		this.setState({ userProfile: updatedProfile })
	}

	handleRemoveFriend = async friendId => {
		const updatedProfile = await profileAPI.unfriend(friendId)
		this.setState({ userProfile: updatedProfile })
	}
	
	handleGetAllGroups = async () => {
		const groups = await groupAPI.getAllGroups()
		this.setState({ groups: groups })
	}
	
	
	handleJoin = async groupId => {
		const updatedGroup = await groupAPI.join(groupId)
		console.log(updatedGroup)
		// this.setState({ groups: updatedGroup })
	} 
	
	// handleLeaveGroup = async groupId => {
	// 	const updatedGroup = await groupAPI.leave(groupId)
	// 	this.setState({ groups: updatedGroup })
	// } 
	
	handleLeaveGroup = async groupId => {
		const updatedGroup = await groupAPI.leave(groupId)
		console.log('updatedGroup', updatedGroup)
		const newGroups=[...this.state.groups]
		const leaveGroup = (element) => element._id === groupId
		const leaveGroupIdx = newGroups.findIndex(leaveGroup)
		newGroups.splice(leaveGroupIdx,1)
		this.setState({
			groups: newGroups
		})
	}
	
	handleAddActivity = async activity =>{
		//console.log('before', activity)
		const updatedProfile = await activityAPI.addActivity(activity)
		//console.log('updatedProfile', updatedProfile)
		this.setState({userProfile: updatedProfile})
		//this.props.history.push('/addActivity')
	} 
	handleAddGroupActivity = async (activity, groupId) =>{
		console.log('activity', activity)
		const updatedGroup = await groupAPI.addActivity(activity, groupId)
		const groups = this.state.groups
		groups.filter((group)=>group._id!==updatedGroup._id)
		groups.push(updatedGroup)
		//console.log('updatedProfile', updatedProfile)
		this.setState({groups: groups})
		this.props.history.push('/')
	} 
	
	handleRemoveActivity = async activity =>{
		const updatedProfile = await activityAPI.removeActivity(activity)
		this.setState({userProfile:updatedProfile})
		//this.props.history.push('/addActivity')
	}
	
	handleGetAllMessages = async () => {
		const messages = await messageAPI.getAllMessages()
		this.setState({ messages: messages })
	}
	
	handleAddMessage = async message => {
		console.log(this.state.messages)
		const newMessage = await messageAPI.createMessagePost(message)
		this.setState(state => ({
			messages: [...state.messages, newMessage]
		})
	)}

	handleDeleteMessage = async messageId => {
		const updatedMessages = await messageAPI.deleteMessagePost(messageId)
		const newMessages=[...this.state.messages]
		const deleteMessage = (element) => element._id === messageId
		const deleteMessageIdx = newMessages.findIndex(deleteMessage)
		newMessages.splice(deleteMessageIdx,1)
		this.setState({
			messages: newMessages
		})
	}

	handleUpdateMessage = async messageId => {
		const updatedMessage = await messageAPI.update(messageId)
		const newMessagesArray = this.state.messages.map(p => 
      p._id === updatedMessage._id ? updatedMessage : p
    );
		this.setState(
      {messages: newMessagesArray}
		)
		this.props.history.push('/messagePost')
	}

	handleUpdateActivity = async activityId => {
		const updatedActivity = await activityAPI.updateActivity(activityId);
		console.log("This is updatedActivity", updatedActivity)
		// const newActivitiesArray = this.state.activities.map(a => 
		//   a._id === updatedActivity._id ? updatedActivity : a
		// );
		this.setState(
		  //{activities: newActivitiesArray},
		  {activities: updatedActivity},
//		  () => this.props.history.push('/')
		);
		this.props.history.push('/addActivity')

	  }

	  handleJoinGroupActivity = async groupId => {
		  const joinGroupActivity = await groupAPI.joinGroupActivity(groupId);
		  this.setState(
			  {activities: joinGroupActivity} //try array later
		  );

		//   this.props.history.push('/group/${group._id}')
	  }
	  

	async componentDidMount() {
		if (!this.state.userProfile){
			const userProfile = await userAPI.getUserProfile()
			console.log("This is the userProfile", userProfile)
			this.setState({ userProfile })
		}
		this.handleGetAllGroups()
		this.handleGetAllMessages()
		}

	render() {
		const { user, userProfile } = this.state
		return (
			<>
			<NavBar user={user} handleLogout={this.handleLogout} />
				
			<Route exact path='/'>
			<Landing user={user} />
			</Route>
				
			<Route exact path='/signup'>
			<Signup history={this.props.history} handleSignupOrLogin={this.handleSignupOrLogin}/>
			</Route>
				
			<Route exact path='/login'>
			<Login handleSignupOrLogin={this.handleSignupOrLogin} history={this.props.history}/>
			</Route>
				
			<Route 
			exact path="/users"
			render={()=> 
				user ? <Users /> : <Redirect to='/login'/>
			}/>
				
			<Route exact path='/addActivity'>
			<AddActivity 
			userProfile={userProfile}
			handleSignupOrLogin={this.handleSignupOrLogin} 
			history={this.props.history}
			handleAddActivity={this.handleAddActivity}
			handleRemoveActivity={this.handleRemoveActivity}
			/>
			</Route>
			
			<Route exact path='/groupAddActivity'
			render={({history})=>
			<GroupAddActivity 
			groups={this.state.groups}
			userProfile={userProfile}
			handleSignupOrLogin={this.handleSignupOrLogin} 
			history={history}
			handleAddGroupActivity={this.handleAddGroupActivity}

			//handleRemoveGroupActivity={this.handleRemoveActivity}
			/>
			}
			
			/>


			<Route exact path='/about'>
			<About handleSignupOrLogin={this.handleSignupOrLogin} history={this.props.history}/>
			</Route>

			<Route exact path='/calendar'>
			<FullCalendar 
				handleSignupOrLogin={this.handleSignupOrLogin} 
				history={this.props.history}
				plugins={[ dayGridPlugin ]}
				initialViews="dayGridMonth"
				//events={this.state.events}
				events={[
					{ title: 'event 1', date: '2019-04-01' },
					{ title: 'event 2', date: '2019-04-02' }
				]}
				eventContent={this.renderEventContent}
			/>
			</Route>

			<Route exact path='/group'>
			<Group 
				handleSignupOrLogin={this.handleSignupOrLogin} 
				history={this.props.history} 
				handleCreateGroup={this.handleCreateGroup}
				/>
			</Route>

			<Route 
			exact path='/profile/:id'
			render={({ match })=> 
				authService.getUser() ?
			<ProfileDetails
			match={match}
			handleAddFriend={this.handleAddFriend}
			handleRemoveFriend={this.handleRemoveFriend}
			handleRemoveActivity={this.handleRemoveActivity}
			handleLeaveGroup={this.handleLeaveGroup}
			userProfile={userProfile}
			/> : <Redirect to='/login' />
  			}
			/>

			<Route 
			exact path='/group/:id'
			render={({ match, location })=> 
				authService.getUser() ?
			<GroupDetails
			group={this.state.groups}
			match={match}
			handleJoinGroupActivity={this.handleJoinGroupActivity}
			handleJoin={this.handleJoin}
			handleLeaveGroup={this.handleLeaveGroup}
			userProfile={userProfile}
			location={location}
			/> : <Redirect to='/login' />
			}
			/>


			<Route 
			exact path='/profileList'>
			<ProfileList
				userProfile={this.state.userProfile}
				handleAddFriend={this.handleAddFriend}
				handleRemoveFriend={this.handleRemoveFriend}
			handleSignupOrLogin={this.handleSignupOrLogin} 
			history={this.props.history}/>
			</Route>

			<Route 
			exact path='/groupList'>
			<GroupList
				userProfile={this.state.userProfile}
				groups={this.state.groups}
				handleJoin={this.handleJoin}
				handleLeaveGroup={this.handleLeaveGroup}
			handleSignupOrLogin={this.handleSignupOrLogin} 
			history={this.props.history}/>
			</Route>

			<Route 
			exact path='/messagePost'>
			<MessagePost
				messages={this.state.messages}
				handleAddMessage={this.handleAddMessage}
				handleDeleteMessage={this.handleDeleteMessage}
				handleUpdateMessage={this.handleUpdateMessage}
				/>
			</Route>

			<Route exact path='/edit/:id' render={({location}) => 
			<EditMessageForm
				handleUpdateMessage={this.handleUpdateMessage}
				location={location}
			/>
			} />

			<Route exact path='/editActivity/:id' render={({location}) => 
			<EditActivityForm
				handleUpdateActivity={this.handleUpdateActivity}
				location={location}
			/>
			} />

			</>
		)
	}
}

// function renderEventContent(eventInfo) {
// 	return (
// 	  <>
// 		<b>{eventInfo.timeText}</b>
// 		<i>{eventInfo.event.title}</i>
// 	  </>
// 	)
//   }

export default App
