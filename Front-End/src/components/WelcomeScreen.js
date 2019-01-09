import React,{Component }from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
class WelcomeScreen extends Component {

    render(){
        if(this.props.authenticated){
            this.props.history.push('/home')
        }
    return (

        <div className="jumbotron">
            <h1 className="display-4">Hello, world!</h1>
            <p className="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
            <hr className="my-4" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <p className="lead">
                    <Link to="/login"> <button className="btn btn-primary btn-lg"> Sign In </button> </Link>
                    <Link to="/register"> <button className="btn btn-primary btn-lg"> Register </button> </Link>
                </p> 
        </div>

    )
    }
}
const mapStateToProps = (state, ownProps) =>{
    return {authenticated : state.isAuthenticated}
}

export default connect(mapStateToProps)(WelcomeScreen)

