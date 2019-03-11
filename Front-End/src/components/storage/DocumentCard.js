import React, { Component } from 'react'
import {connect} from 'react-redux'

class DocumentCard extends Component {
    state = {
        projectDocuments: this.props.projectInContext.documents
    }
    renderDocumentsCard = ()=>{
        return(
            this.props.projectInContext.documents.map(doc=>{
                return (
                    
                    <div class="card border-secondary mb-3 col-sm-3" key={doc._id} >
                        <div class="card-header bg-transparent border-primary">{doc.name}</div>
                        <div class="card-body ">
                            <h5 class="card-title">...</h5>
                            <p class="card-text">{doc.contentType}</p>
                        </div>
                        <div class="card-footer bg-transparent border-primary">Footer</div>
                    </div>
                
                )
            })
        )
    }
    render() {
        return (
            <div className="row">
           { this.renderDocumentsCard()}
            </div>
        )
    }

}
const mapStateToProps = (state) =>{
    return{
        projectInContext : state.projectInContext
    }
}
export default connect(mapStateToProps)(DocumentCard)
