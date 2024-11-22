import { ThunkAction } from 'redux-thunk'
import { ResultCodeSuccessError } from '../api/api'
import { usersAPI } from '../api/users-api'
import { UserType } from '../types'
import { ActionsTypes, rootStateType } from './store'
import { Dispatch } from 'redux'

let initialState = {
      usersList: [] as Array<UserType>,
      overall: 40 as number | null,
      pageSize: 5 as number | null,
      currentPage: 1 as number | null,
      page: 1 as number | null,
      isFetching: null as boolean | null,
      inProgress: [] as Array<number>, // ? Array of user ids that are being processed by following or unfollowing
      filter: {},
}

export type InitialStateUsersType = typeof initialState

const users_reducer = (_state = initialState, action: UsersActionsTypes): InitialStateUsersType => {
      switch (action.type) {
            case 'social-app/users/FOLLOW-PROFILE': {
                  return {
                        ..._state,
                        usersList: _state.usersList.map((u: any) => {
                              if (u.id === action.userId) {
                                    return { ...u, followed: true }
                              }
                              return u
                        }),
                  }
            }
            case 'social-app/users/UNFOLLOW-PROFILE': {
                  return {
                        ..._state,
                        usersList: _state.usersList.map((u: any) => {
                              if (u.id === action.userId) {
                                    return { ...u, followed: false }
                              }
                              return u
                        }),
                  }
            }
            case 'social-app/users/SET-USERS': {
                  return {
                        ..._state,
                        usersList: [...action.users],
                  }
            }

            case 'social-app/users/SEARCH-USERS': {
                  return { ..._state, usersList: [...action.users] }
            }
            case 'social-app/users/SET-CURRENT-PAGE': {
                  return {
                        ..._state,
                        currentPage: action.thisPageNumber,
                  }
            }
            case 'social-app/users/SET-FETCHING': {
                  return {
                        ..._state,
                        isFetching: action.isFetching,
                  }
            }
            case 'social-app/users/SET-IN-PROGRESS': {
                  return {
                        ..._state,
                        inProgress: action.isInProgress ? [..._state.inProgress, action.id] : _state.inProgress.filter((i) => i !== action.id),
                  }
            }
            case 'social-app/users/SET-FILTER-SEARCH': {
                  return {
                        ..._state,
                        filter: { ...action.payload },
                  }
            }
            default: {
                  return _state
            }
      }
}

let UsersActions = {
      followDone: (userId: number) => ({ type: 'social-app/users/FOLLOW-PROFILE', userId: userId } as const),
      unfollowDone: (userId: number) => ({ type: 'social-app/users/UNFOLLOW-PROFILE', userId: userId } as const),
      setUsers: (users: Array<UserType>) => ({ type: 'social-app/users/SET-USERS', users } as const),
      setFriends: (friends: Array<UserType>) => ({ type: 'social-app/users/SET-FRIENDS', friends } as const),
      searchUsers: (users: Array<UserType>) => ({ type: 'social-app/users/SEARCH-USERS', users } as const),
      setCurrentPage: (thisPageNumber: number) => ({ type: 'social-app/users/SET-CURRENT-PAGE', thisPageNumber } as const),
      setFetching: (isFetching: boolean) => ({ type: 'social-app/users/SET-FETCHING', isFetching } as const),
      setInProgress: (isInProgress: boolean, id: number) =>
            ({
                  type: 'social-app/users/SET-IN-PROGRESS',
                  isInProgress,
                  id,
            } as const),
      setFilterSearch: (term: string, onlyFriends: boolean | null) => ({ type: 'social-app/users/SET-FILTER-SEARCH', payload: { term, onlyFriends } } as const),
}

type UsersActionsTypes = ActionsTypes<typeof UsersActions>

// ? One type of typization
const getUsersThunk = (currentPage: number, pageSize: number, onlyFriends: boolean | null, term: string) => async (dispatch: Dispatch<UsersActionsTypes>, getState: rootStateType) => {
      dispatch(UsersActions.setFetching(true))
      dispatch(UsersActions.setCurrentPage(currentPage))
      const data = await usersAPI.GET_USERS(currentPage, pageSize, onlyFriends)
      if (data.items) {
            dispatch(UsersActions.setUsers(data.items))
            dispatch(UsersActions.setFetching(false))
      }
}

// ? Second type of typization
const searchUsersThunk = getUsersThunk
const unfollow =
      (userId: number): ThunkAction<Promise<void>, rootStateType, unknown, UsersActionsTypes> =>
      async (dispatch) => {
            dispatch(UsersActions.setInProgress(true, userId))
            const data = await usersAPI.UNFOLLOW(userId)
            if (data.resultCode === ResultCodeSuccessError.Success) {
                  dispatch(UsersActions.unfollowDone(userId))
                  dispatch(UsersActions.setInProgress(false, userId))
            }
      }

const follow =
      (userId: number): ThunkAction<Promise<void>, rootStateType, unknown, UsersActionsTypes> =>
      async (dispatch) => {
            dispatch(UsersActions.setInProgress(true, userId))
            const data = await usersAPI.FOLLOW(userId)
            if (data.resultCode === ResultCodeSuccessError.Success) {
                  dispatch(UsersActions.followDone(userId))
                  dispatch(UsersActions.setInProgress(false, userId))
            }
      }

export { users_reducer, UsersActions, getUsersThunk, searchUsersThunk, follow, unfollow }
