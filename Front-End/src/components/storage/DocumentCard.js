import React, { Component } from 'react'
import { connect } from 'react-redux'
var assets = require.context("../../assets", true)
class DocumentCard extends Component {
    state = {
        projectDocuments: this.props.projectInContext.documents//dont delete. ignore
    }
    renderLogo = (contentType) => {
        let imgSrc;
        try {
            let type = contentType.substring(contentType.indexOf("/") + 1);
            console.log(type)
            imgSrc = assets("./"+type+".png")
        } catch (error) {
            imgSrc = assets("./file.png")
        }
        return(
            <img src={imgSrc} />
        )

    }
    renderDocumentsCard = () => {
        return (
            this.props.projectInContext.documents.map(doc => {
                if(doc.hidden){
                    return
                }
                if (doc.file !== "" ) {
                    return (
                        <div class="card border-secondary mb-3 col-sm-3" key={doc._id} >
                            <div class="card-header bg-transparent border-primary"><span className="storage-card">{doc.name}</span></div>
                            <div class="card-body ">
                                <h5 class="card-title">
                                    {this.renderLogo(doc.contentType)}
                                </h5>
                                <p class="card-text">
                                    <a className="text-dark" href={doc.file} target="_blank"><i class="material-icons">cloud_download</i></a>
                                </p>
                            </div>
                            <div class="card-footer bg-transparent border-primary">Footer</div>
                        </div>
                    )
                }
            })
        )
    }
    render() {
        return (
            <div className="row">
                {this.renderDocumentsCard()}
            </div>
        )
    }

}
const mapStateToProps = (state) => {
    return {
        projectInContext: state.projectInContext
    }
}
export default connect(mapStateToProps)(DocumentCard)
