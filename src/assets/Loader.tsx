import loader from '../img/loader.gif'

export default (props: { isFetching: boolean }) => (props.isFetching ? <img src={loader} alt='loader' /> : null)