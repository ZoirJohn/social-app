import { useSelector } from 'react-redux'
import { ComponentType, FC } from 'react'
import { getIsFetching } from '../../selectors'
import Users from './Users'
import Loader from '../../assets/Loader'
import { compose } from 'redux'
import { withAuthRedirect } from '../../hoc/withAuthRedirect'

type TProps = {}

const UsersContainer: FC<TProps> = () => {
      const isFetching = useSelector(getIsFetching)
      return (
            <>
                  <Loader isFetching={isFetching} />
                  <Users />
            </>
      )
}

export default compose(withAuthRedirect)(UsersContainer)
